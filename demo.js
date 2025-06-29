#!/usr/bin/env node

console.log(`
🚀 GitHub Trending to Wiki 项目演示
=====================================

这个项目可以：
✅ 自动获取 GitHub Trending 热门项目
✅ 格式化为美观的 Markdown 表格
✅ 直接发布到仓库的 wiki/ 目录
✅ 支持定时任务和手动触发
✅ 完善的错误处理

📂 项目结构：
├── src/
│   └── fetch-and-publish.js  # GitHub Actions 发布脚本
├── .github/workflows/
│   └── fetch-trending.yml    # 主要工作流（每日执行）
├── package.json              # 项目配置
├── README.md                 # 详细说明文档
└── QUICKSTART.md             # 快速开始指南

🎯 使用方法：
1. Fork 此项目到你的 GitHub 账户
2. 启用 GitHub Actions 功能
3. 等待每天自动执行，或手动触发 Actions

📊 发布位置：
文件将直接保存到仓库的 wiki/ 目录中，便于查看和管理
例如：2025-06-29.md 等文件

📊 输出格式示例：
| 排名 | 项目 | 语言 | Stars | Forks | 今日新增 |
|------|------|------|-------|-------|----------|
| 1 | [项目名] | TypeScript | 30,716 | 3,504 | 425 stars today |

项目描述...

🔧 测试命令：
- npm run fetch-trending    # 运行脚本（本地测试时生成本地文件，GitHub Actions 中发布到 wiki）

📝 更多信息请查看 README.md 和 QUICKSTART.md

Happy Coding! 🎉
`);
