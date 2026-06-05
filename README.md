# 出去走走 2.0

面向 35–55 岁高压城市中年人的焕活体验平台（MVP）。

## 技术栈

- Next.js 15 (App Router)
- Tailwind CSS
- Framer Motion
- Lucide React

## 本地运行

```bash
cd /Users/mima0000/Projects/zouchuququ-2.0
npm install
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。

## 部署到 Vercel

1. 将项目推送到 GitHub
2. 在 [vercel.com](https://vercel.com) 导入仓库
3. 使用默认 Next.js 设置，一键部署

## 页面路由

| 路径 | 说明 |
|------|------|
| `/` | 首页 |
| `/explore` | 日常充电站 |
| `/explore/[id]` | 体验详情 |
| `/destination` | 深度目的地 |
| `/destination/[id]` | 路线详情 |
| `/profile` | 我的 |

## MVP 说明

- 示例数据见 `src/data/`
- 小走 Agent 为预设脚本模拟对话
- 报名流程为「咨询报名」，跳转小走对话
