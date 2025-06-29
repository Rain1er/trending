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
│   ├── index.js              # 本地测试脚本
│   ├── fetch-and-publish.js  # GitHub Actions 发布脚本
│   └── test.js               # 功能测试脚本
├── .github/workflows/
│   ├── fetch-trending.yml    # 主要工作流（每日执行）
│   └── test.yml              # 测试工作流
├── package.json              # 项目配置
├── README.md                 # 详细说明文档
└── QUICKSTART.md             # 快速开始指南

🎯 使用方法：
1. Fork 此项目到你的 GitHub 账户
2. 启用 GitHub Actions 功能
3. 等待每天自动执行，或手动触发 Actions

📊 发布位置：
文件将直接保存到仓库的 wiki/ 目录中，便于查看和管理

📊 输出格式示例：
| 排名 | 项目 | 语言 | Stars | Forks | 今日新增 |
|------|------|------|-------|-------|----------|
| 1 | [项目名] | TypeScript | 30,716 | 3,504 | 425 stars today |

项目描述...

🔧 测试命令：
- npm start         # 本地测试（保存到 daily/ 目录）
- npm test          # 功能测试（仅验证数据获取）  
- npm run test-actions  # 模拟 GitHub Actions 环境
- npm run fetch-trending  # 完整的 GitHub Actions 模式

📝 更多信息请查看 README.md 和 QUICKSTART.md

Happy Coding! 🎉
`);
