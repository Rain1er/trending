# GitHub Trending to Wiki

🚀 自动获取 GitHub Trending 热门项目并发布到项目 Wiki 的工具

## 功能特性

- 📊 每日自动抓取 [GitHub Trending](https://github.com/trending) 热门项目
- 📝 自动发布到项目 Wiki，格式化为美观的 Markdown 表格
- ⏰ 支持定时任务（每天北京时间 08:00）
- 🔧 支持手动触发执行
- 📋 包含项目排名、名称、语言、Stars、Forks、今日新增等信息
- 🏠 自动维护 Wiki 首页和历史记录

## 输出格式

每个项目都会按照以下格式显示：

| 排名 | 项目 | 语言 | Stars | Forks | 今日新增 |
|------|------|------|-------|-------|----------|
| 1 | [twentyhq / twenty](https://github.com/twentyhq/twenty) | TypeScript | 30,716 | 3,504 | 425 stars today |

Building a modern alternative to Salesforce, powered by the community.

---

## 快速开始

### 1. 使用此模板

点击 "Use this template" 按钮创建你自己的仓库。

### 2. 启用 GitHub Actions

确保在仓库设置中启用了 GitHub Actions。

### 3. 启用 Wiki

在仓库的 Settings → Features 中启用 Wiki 功能。

### 4. 配置权限

确保 GitHub Actions 有足够的权限：
- 在 Settings → Actions → General → Workflow permissions 中选择 "Read and write permissions"

### 5. 运行

- **自动运行**: 每天北京时间 08:00 自动执行
- **手动运行**: 在 Actions 页面点击 "Run workflow" 手动触发

## 本地开发

### 安装依赖

\`\`\`bash
npm install
\`\`\`

### 运行脚本

\`\`\`bash
# 本地测试（生成本地文件）
npm start

# GitHub Actions 模式（需要环境变量）
npm run fetch-trending
\`\`\`

### 环境变量

对于 GitHub Actions 模式，需要以下环境变量：

- \`GITHUB_TOKEN\`: GitHub Personal Access Token
- \`GITHUB_REPOSITORY_OWNER\`: 仓库所有者
- \`GITHUB_REPOSITORY_NAME\`: 仓库名称

## 文件结构

\`\`\`
├── .github/
│   └── workflows/
│       └── fetch-trending.yml     # GitHub Actions 工作流
├── src/
│   ├── index.js                   # 本地测试脚本
│   └── fetch-and-publish.js       # GitHub Actions 发布脚本
├── package.json
└── README.md
\`\`\`

## 自定义配置

### 修改执行时间

编辑 \`.github/workflows/fetch-trending.yml\` 中的 cron 表达式：

\`\`\`yaml
schedule:
  # 每天 UTC 00:00 运行 (北京时间 08:00)
  - cron: '0 0 * * *'
\`\`\`

### 修改输出格式

编辑 \`src/fetch-and-publish.js\` 中的 \`formatAsMarkdown\` 方法来自定义输出格式。

## 故障排除

### 常见问题

1. **Wiki 发布失败**
   - 确保仓库启用了 Wiki 功能
   - 检查 GitHub Token 权限

2. **数据获取失败**
   - GitHub Trending 页面可能临时不可用
   - 网络连接问题

3. **权限错误**
   - 确保 GitHub Actions 有 "Read and write permissions"

### 查看日志

在 GitHub Actions 页面查看详细的执行日志来诊断问题。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 相关链接

- [GitHub Trending](https://github.com/trending)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [GitHub Wiki API](https://docs.github.com/en/rest/wikis)
