# 小走「记忆统一版」基线备份

备份日期：2026-11-06

Git 标签：`memory-unified-20261106`

线上版本：`https://beyondyouth.com.cn/`

## 1. 这个版本保存了什么

这是后续“知己 / 主持人 / 聆听者”交互优化之前的完整回退基线，核心能力是：

- 文字与语音共用 `buildContext()`、`BASE_PROMPT`、账号档案、行程、会话和记忆。
- 一般文字对话接入上游豆包文本模型；身份、行程、记忆和明确目录事实走确定性规则。
- 模型失败自动回退规则，响应通过 `understanding = model/rules` 标明实际链路。
- 区分 `preference`、`profile`、`journey`、`feedback`，同槽位新记录替换旧有效记录。
- 按钮、预约草稿、主理人选择、反馈、文字、语音和开场进入会话或相应记忆。
- 上下文包含预约草稿、行后反馈、主理人弱信号、近期摘要和最近 6 条对话。
- 文字和语音开场根据行程、待确认申请、本次选择、近期话题和偏好轮换。
- 推荐卡片只映射模型回复中真实出现的场地，最多两个。

## 2. 文件清单

| 文件 | 用途 |
|---|---|
| `index.html` | 当前前端、按钮采集、文字/语音交互和页面自检 |
| `xiaozou-service.js` | 提示词、记忆、上下文、开场、规则和模型回复入库 |
| `voice-proxy-server.js` | 账号/API、文字模型请求、语音票据和代理 |
| `catalog-seed.json` | 当前真实场地和人物初始化目录 |
| `BASE_PROMPT.txt` | 与 `xiaozou-service.js` 中基线提示词逐行一致 |
| `SYSTEM.md` | 基线完整系统文档，来自仓库根 README |
| `VERSION.md` | 本说明和恢复方法 |

备份不包含数据库、Cookie、密码、环境变量或任何真实用户数据。SQLite 数据备份属于生产运维，不能用源码备份代替。

## 3. 如何恢复

### 只查看基线，不改变当前工作区

```bash
git show memory-unified-20261106:xiaozou-v3/xiaozou-service.js
```

### 在独立目录打开完整基线

```bash
git worktree add ../goout-memory-unified memory-unified-20261106
```

### 用本目录副本恢复核心代码

先确认当前新改动已经另行提交，再在仓库根目录执行：

```bash
cp backups/xiaozou-memory-unified-20261106/index.html xiaozou-v3/index.html
cp backups/xiaozou-memory-unified-20261106/xiaozou-service.js xiaozou-v3/xiaozou-service.js
cp backups/xiaozou-memory-unified-20261106/voice-proxy-server.js xiaozou-v3/voice-proxy-server.js
cp backups/xiaozou-memory-unified-20261106/catalog-seed.json xiaozou-v3/catalog-seed.json
```

恢复后需要重新部署 `xiaozou-v3` 并执行回归。数据库已有表结构可继续使用；如果恢复涉及目录内容，注意种子文件不会自动覆盖已有数据库。

## 4. 基线验证记录

上一阶段完成并通过：

- 文字模型与路由单测 13 项；
- 记忆分层和槽位替换单测 14 项；
- 上下文开场单测 15 项；
- 生产 UI 回归 231 + 14 项；
- 生产 API 8 组；
- 跨文字/语音上下文的四轮生产实测；
- SQLite 完整性检查正常，测试临时账号已清理，真实账号保持 4 个。

## 5. 已知边界

- 会话摘要仍是最近 8 条的确定性滚动拼接，不是语义摘要或向量检索。
- 部分按钮和会话写入是异步请求，极端情况下仍可能失败或乱序。
- 删除动态、评论与历史会话/记忆的联动尚不完整。
- 语音开场在票据生成时记录，不代表上游一定播放成功。
- 文字和语音使用不同上游引擎；统一的是理解上下文和记忆，不是底层模型。
- 当前对话策略仍有信息收集顺序感，后续自然交互优化必须从这个基线之外另行提交。
