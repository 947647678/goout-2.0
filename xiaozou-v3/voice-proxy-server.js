// 本地预览服务：静态文件 + 同源 API + 豆包语音网关反向代理
const http = require('http');
const https = require('https');
const tls = require('tls');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');
const { DatabaseSync } = require('node:sqlite');
const { createXiaozouService } = require('./xiaozou-service');

const ROOT = __dirname;
const PORT = process.env.PORT === undefined ? 8099 : Number(process.env.PORT);
const UP = 'ceo.pianai.love';
const DB_FILE = process.env.DB_PATH ? path.resolve(process.env.DB_PATH) : path.join(ROOT, 'data', 'xiaozou.db');
const SESSION_COOKIE = 'xiaozou_session';
const SESSION_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const SESSION_AGE_SECONDS = SESSION_AGE_MS / 1000;
const MAX_BODY_BYTES = 2 * 1024 * 1024;
const MAX_METADATA_BYTES = 16 * 1024;

if (!Number.isInteger(PORT) || PORT < 0 || PORT > 65535) {
  throw new Error('PORT must be an integer between 0 and 65535');
}

fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
const db = new DatabaseSync(DB_FILE);
db.exec(`
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS user_state (
    user_id INTEGER PRIMARY KEY,
    state_json TEXT NOT NULL,
    revision INTEGER NOT NULL DEFAULT 1,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS memories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    kind TEXT NOT NULL,
    content TEXT NOT NULL,
    metadata_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
  CREATE INDEX IF NOT EXISTS idx_memories_user_created ON memories(user_id, created_at DESC, id DESC);
`);

const xiaozou = createXiaozouService({ db, root: ROOT, httpError });
const CATALOG_ADMIN_USERS = String(process.env.CATALOG_ADMIN_USERS || '').split(',').map(v => v.trim()).filter(Boolean);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.gif': 'image/gif',
  '.md': 'text/plain; charset=utf-8'
};

const DUMMY_SALT = crypto.randomBytes(16).toString('hex');
const DUMMY_HASH = crypto.scryptSync('not-the-password', Buffer.from(DUMMY_SALT, 'hex'), 64);

function upstreamHeaders(h) {
  const out = Object.assign({}, h, { host: UP });
  delete out.origin;
  delete out.referer;
  delete out.cookie;
  delete out.authorization;
  return out;
}

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  error.expose = true;
  return error;
}

function sendJson(res, status, value) {
  const body = JSON.stringify(value);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'content-length': Buffer.byteLength(body)
  });
  res.end(body);
}

function characterLength(value) {
  return Array.from(value).length;
}

function validateUsername(username) {
  return typeof username === 'string' && /^[\p{Script=Han}A-Za-z0-9._@-]{3,32}$/u.test(username);
}

function validatePassword(password) {
  return typeof password === 'string' && characterLength(password) >= 6 && characterLength(password) <= 128;
}

function validateDisplayName(displayName) {
  return typeof displayName === 'string' && characterLength(displayName.trim()) >= 1 && characterLength(displayName.trim()) <= 24;
}

function requireObject(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw httpError(400, 'JSON body must be an object');
  }
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let done = false;
    const chunks = [];

    function cleanup() {
      req.off('data', onData);
      req.off('end', onEnd);
      req.off('error', onError);
      req.off('aborted', onAborted);
    }

    function fail(error) {
      if (done) return;
      done = true;
      cleanup();
      reject(error);
    }

    function onData(chunk) {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        chunks.length = 0;
        fail(httpError(413, 'Request body too large'));
        req.resume();
        return;
      }
      chunks.push(chunk);
    }

    function onEnd() {
      if (done) return;
      done = true;
      cleanup();
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        reject(httpError(400, 'Invalid JSON'));
      }
    }

    function onError() {
      fail(httpError(400, 'Unable to read request body'));
    }

    function onAborted() {
      fail(httpError(400, 'Request body was aborted'));
    }

    if (Number(req.headers['content-length']) > MAX_BODY_BYTES) {
      fail(httpError(413, 'Request body too large'));
      req.resume();
      return;
    }

    req.on('data', onData);
    req.on('end', onEnd);
    req.on('error', onError);
    req.on('aborted', onAborted);
  });
}

function parseCookies(req) {
  const cookies = {};
  const header = req.headers.cookie;
  if (!header) return cookies;
  for (const part of header.split(';')) {
    const index = part.indexOf('=');
    if (index < 0) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (!key) continue;
    try {
      cookies[key] = decodeURIComponent(value);
    } catch {
      cookies[key] = value;
    }
  }
  return cookies;
}

function tokenHash(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function isSecureRequest(req) {
  const forwarded = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim().toLowerCase();
  return Boolean(req.socket.encrypted) || forwarded === 'https';
}

function sessionCookie(req, token, maxAge) {
  const parts = [
    `${SESSION_COOKIE}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAge}`
  ];
  if (maxAge === 0) parts.push('Expires=Thu, 01 Jan 1970 00:00:00 GMT');
  if (isSecureRequest(req)) parts.push('Secure');
  return parts.join('; ');
}

function publicUser(row) {
  return { id: Number(row.id), username: row.username, displayName: row.display_name };
}

function createSession(req, res, userId) {
  const token = crypto.randomBytes(32).toString('base64url');
  const now = Date.now();
  db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(now);
  db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)')
    .run(tokenHash(token), userId, now + SESSION_AGE_MS);
  res.setHeader('Set-Cookie', sessionCookie(req, token, SESSION_AGE_SECONDS));
}

function sessionToken(req) {
  return parseCookies(req)[SESSION_COOKIE] || null;
}

function currentUser(req) {
  const token = sessionToken(req);
  if (!token) return null;
  const hash = tokenHash(token);
  const row = db.prepare(`
    SELECT u.id, u.username, u.display_name
    FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ? AND s.expires_at > ?
  `).get(hash, Date.now());
  if (!row) {
    db.prepare('DELETE FROM sessions WHERE token_hash = ? AND expires_at <= ?').run(hash, Date.now());
    return null;
  }
  return publicUser(row);
}

function requireUser(req) {
  const user = currentUser(req);
  if (!user) throw httpError(401, 'Authentication required');
  return user;
}

function passwordMatches(password, row) {
  const salt = row ? row.password_salt : DUMMY_SALT;
  const expected = row ? Buffer.from(row.password_hash, 'hex') : DUMMY_HASH;
  const actual = crypto.scryptSync(password, Buffer.from(salt, 'hex'), 64);
  return crypto.timingSafeEqual(actual, expected);
}

function recentMemories(userId) {
  return xiaozou.recentMemories(userId);
}

async function handleApi(req, res, pathname) {
  if (pathname === '/api/auth/register' && req.method === 'POST') {
    const body = await readJsonBody(req);
    requireObject(body);
    if (!validateUsername(body.username) || !validatePassword(body.password) || !validateDisplayName(body.displayName)) {
      throw httpError(400, 'Invalid username, password, or displayName');
    }
    if (db.prepare('SELECT id FROM users WHERE username = ?').get(body.username)) {
      throw httpError(409, 'Username already exists');
    }
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(body.password, Buffer.from(salt, 'hex'), 64).toString('hex');
    const displayName = body.displayName.trim();
    const result = db.prepare(`
      INSERT INTO users (username, display_name, password_salt, password_hash, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(body.username, displayName, salt, hash, new Date().toISOString());
    const user = { id: Number(result.lastInsertRowid), username: body.username, displayName };
    createSession(req, res, user.id);
    return sendJson(res, 201, { user });
  }

  if (pathname === '/api/auth/login' && req.method === 'POST') {
    const body = await readJsonBody(req);
    requireObject(body);
    if (!validateUsername(body.username) || !validatePassword(body.password)) {
      throw httpError(400, 'Invalid username or password');
    }
    const row = db.prepare('SELECT * FROM users WHERE username = ?').get(body.username);
    const matches = passwordMatches(body.password, row);
    if (!row || !matches) {
      throw httpError(401, 'Invalid username or password');
    }
    const user = publicUser(row);
    createSession(req, res, user.id);
    return sendJson(res, 200, { user });
  }

  if (pathname === '/api/auth/logout' && req.method === 'POST') {
    const token = sessionToken(req);
    if (token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash(token));
    res.setHeader('Set-Cookie', sessionCookie(req, '', 0));
    return sendJson(res, 200, { ok: true });
  }

  if (pathname === '/api/auth/me' && req.method === 'GET') {
    return sendJson(res, 200, { user: currentUser(req) });
  }

  if (pathname === '/api/catalog' && req.method === 'GET') {
    return sendJson(res, 200, xiaozou.getCatalog());
  }

  if (pathname === '/api/catalog' && req.method === 'PUT') {
    const user = requireUser(req);
    const body = await readJsonBody(req);
    requireObject(body);
    return sendJson(res, 200, xiaozou.updateCatalog(user, body, CATALOG_ADMIN_USERS));
  }

  if (pathname === '/api/state' && req.method === 'GET') {
    const user = requireUser(req);
    const row = db.prepare('SELECT state_json, revision FROM user_state WHERE user_id = ?').get(user.id);
    return sendJson(res, 200, {
      state: row ? JSON.parse(row.state_json) : null,
      revision: row ? Number(row.revision) : 0,
      memory: recentMemories(user.id),
      profile: xiaozou.getProfile(user),
      itineraries: xiaozou.getItineraries(user)
    });
  }

  if (pathname === '/api/state' && req.method === 'PUT') {
    const user = requireUser(req);
    const body = await readJsonBody(req);
    requireObject(body);
    if (!Object.prototype.hasOwnProperty.call(body, 'state')) throw httpError(400, 'state is required');
    const stateJson = JSON.stringify(body.state);
    if (stateJson === undefined) throw httpError(400, 'state must be JSON serializable');
    const now = new Date().toISOString();
    db.exec('BEGIN IMMEDIATE');
    try {
      db.prepare(`
        INSERT INTO user_state (user_id, state_json, revision, updated_at)
        VALUES (?, ?, 1, ?)
        ON CONFLICT(user_id) DO UPDATE SET
          state_json = excluded.state_json,
          revision = user_state.revision + 1,
          updated_at = excluded.updated_at
      `).run(user.id, stateJson, now);
      xiaozou.syncItineraries(user, body.state);
      db.exec('COMMIT');
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
    const row = db.prepare('SELECT revision FROM user_state WHERE user_id = ?').get(user.id);
    return sendJson(res, 200, { revision: Number(row.revision), itineraries: xiaozou.getItineraries(user) });
  }

  if (pathname === '/api/profile' && req.method === 'GET') {
    return sendJson(res, 200, { profile: xiaozou.getProfile(requireUser(req)) });
  }

  if (pathname === '/api/profile' && req.method === 'PUT') {
    const user = requireUser(req);
    const body = await readJsonBody(req);
    requireObject(body);
    return sendJson(res, 200, { profile: xiaozou.updateProfile(user, body) });
  }

  if (pathname === '/api/itineraries' && req.method === 'GET') {
    return sendJson(res, 200, { itineraries: xiaozou.getItineraries(requireUser(req)) });
  }

  if (pathname === '/api/chat' && req.method === 'POST') {
    const body = await readJsonBody(req);
    requireObject(body);
    return sendJson(res, 200, xiaozou.chat(currentUser(req), body));
  }

  if (pathname === '/api/conversation' && req.method === 'POST') {
    const user = requireUser(req);
    const body = await readJsonBody(req);
    requireObject(body);
    if (!['voice', 'text'].includes(body.channel) || !['user', 'assistant'].includes(body.role)) throw httpError(400, 'Invalid channel or role');
    xiaozou.addTurn(user, body.channel, body.role, body.content);
    return sendJson(res, 201, { ok: true });
  }

  if (pathname === '/api/memory' && req.method === 'GET') {
    const user = requireUser(req);
    return sendJson(res, 200, { memory: recentMemories(user.id) });
  }

  if (pathname === '/api/memory' && req.method === 'POST') {
    const user = requireUser(req);
    const body = await readJsonBody(req);
    requireObject(body);
    return sendJson(res, 201, { memory: xiaozou.createMemory(user, body) });
  }

  const memoryMatch = pathname.match(/^\/api\/memory\/(\d+)$/);
  if (memoryMatch && req.method === 'PUT') {
    const user = requireUser(req);
    const body = await readJsonBody(req);
    requireObject(body);
    return sendJson(res, 200, { memory: xiaozou.updateMemory(user, Number(memoryMatch[1]), body) });
  }

  if (memoryMatch && req.method === 'DELETE') {
    const user = requireUser(req);
    xiaozou.deleteMemory(user, Number(memoryMatch[1]));
    return sendJson(res, 200, { ok: true });
  }

  throw httpError(404, 'API route not found');
}

function isInside(parent, candidate) {
  return candidate === parent || candidate.startsWith(parent + path.sep);
}

function serveStatic(req, res, pathname) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    throw httpError(405, 'Method not allowed');
  }
  let p;
  try {
    p = decodeURIComponent(pathname);
  } catch {
    throw httpError(400, 'Invalid path');
  }
  if (p.includes('\0')) throw httpError(400, 'Invalid path');
  if (p === '/') p = '/index.html';
  const f = path.resolve(ROOT, '.' + p);
  if (!isInside(ROOT, f)) throw httpError(403, 'Forbidden');
  if (f === __filename || isInside(path.join(ROOT, 'data'), f) || f === DB_FILE) {
    throw httpError(403, 'Forbidden');
  }

  fs.readFile(f, (error, buffer) => {
    if (error) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      return res.end('404 ' + p);
    }
    res.writeHead(200, {
      'content-type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream',
      'cache-control': 'no-store',
      'content-length': buffer.length
    });
    res.end(req.method === 'HEAD' ? undefined : buffer);
  });
}

function forwardVoice(req, res, body) {
  const headers = upstreamHeaders(req.headers);
  if (body) {
    headers['content-type'] = 'application/json; charset=utf-8';
    headers['content-length'] = Buffer.byteLength(body);
  }
  const up = https.request({ host: UP, port: 443, path: req.url, method: req.method, headers }, (ur) => {
    res.writeHead(ur.statusCode, ur.headers);
    ur.pipe(res);
  });
  up.on('error', (error) => {
    if (!res.headersSent) res.writeHead(502, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('upstream error: ' + error.message);
  });
  if (body) up.end(body);
  else req.pipe(up);
}

async function proxyVoice(req, res) {
  if (req.method !== 'POST' || url.parse(req.url).pathname !== '/voice-gateway/api/voice-ticket') {
    return forwardVoice(req, res);
  }
  const input = await readJsonBody(req);
  requireObject(input);
  const user = currentUser(req);
  const rawSession = input.session && typeof input.session === 'object' ? input.session : {};
  const session = {
    mood: String(rawSession.mood || '').slice(0, 40),
    door: String(rawSession.door || '').slice(0, 40),
    pace: String(rawSession.pace || '').slice(0, 40),
    vibe: String(rawSession.vibe || '').slice(0, 40),
    bias: String(rawSession.bias || '').slice(0, 40),
    shift: Number.isInteger(rawSession.shift) ? rawSession.shift : 0
  };
  const ticketInput = {
    userId: 'xz-' + (user ? String(user.id) : 'guest') + '-' + Date.now(),
    ceoId: 'xiaozou',
    ceoName: '小走',
    systemPrompt: xiaozou.buildContext(user, session),
    voiceId: 'ICL_uranus_zh_female_wenrouwenya_tob',
    openingText: user ? user.displayName + '，我在。今天想怎么走？' : '我在。今天想怎么走？'
  };
  return forwardVoice(req, res, JSON.stringify(ticketInput));
}

async function handleRequest(req, res) {
  if (req.url.startsWith('/voice-gateway/')) return proxyVoice(req, res);
  const pathname = url.parse(req.url).pathname;
  if (pathname === '/api' || pathname.startsWith('/api/')) {
    return handleApi(req, res, pathname);
  }
  return serveStatic(req, res, pathname);
}

const server = http.createServer((req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader('Permissions-Policy', 'microphone=(self)');
  handleRequest(req, res).catch((error) => {
    if (res.writableEnded) return;
    const status = Number.isInteger(error.status) ? error.status : 500;
    sendJson(res, status, { error: error.expose ? error.message : 'Internal server error' });
  });
});

// WebSocket 升级：直接把 TCP 管道接到上游 TLS
server.on('upgrade', (req, socket, head) => {
  if (!req.url.startsWith('/voice-gateway/')) return socket.destroy();
  const up = tls.connect({ host: UP, port: 443, servername: UP }, () => {
    const h = upstreamHeaders(req.headers);
    const raw = 'GET ' + req.url + ' HTTP/1.1\r\n' +
      Object.entries(h).map(([k, v]) => k + ': ' + v).join('\r\n') + '\r\n\r\n';
    up.write(raw);
    if (head && head.length) up.write(head);
    up.pipe(socket);
    socket.pipe(up);
  });
  up.on('error', () => socket.destroy());
  socket.on('error', () => up.destroy());
});

server.listen(PORT, () => {
  console.log('预览地址 http://localhost:' + PORT + '/');
  console.log('语音网关已同源代理到 ' + UP + '（无 CORS 问题）');
});
