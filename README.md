# 出去走走 3.0 — 单文件原型

> **本分支与 `main` 上的 GoOut 2.0（Next.js MVP）无关。**  
> 请勿将本分支合并进 `main`，以免覆盖 2.0 源码。

本仓库 `main` 分支是 **出去走走 2.0**（Next.js App Router MVP）。  
本分支 `v3-prototype` 是 **出去走走 3.0** 的单文件 HTML 原型存档，历史与 2.0 完全隔离（orphan 分支）。

## 内容

| 文件 | 说明 |
|------|------|
| `index.html` | 3.0 完整单文件原型（自包含） |
| `README.md` | 本说明 |

## 本地打开

任选其一：

```bash
# 直接用浏览器打开
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```

或起一个本地静态服务：

```bash
python3 -m http.server 8080
# 浏览器访问 http://localhost:8080
```

## 请勿合并进 main

本 PR / 本分支仅作 3.0 原型存档。合并进 `main` 会破坏 2.0 MVP。如需查看 3.0，请切换到本分支或直接下载 `index.html`。
