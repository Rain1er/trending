# GitHub Trending to Issues

🚀 自动获取 GitHub Trending 热门项目并发布到 GitHub Issues 的工具

## 功能特性

- 📊 每日自动抓取 [GitHub Trending](https://github.com/trending) 热门项目
- 📝 自动发布到项目仓库的 Issues 中，格式化为美观的 Markdown 表格
- ⏰ 支持定时任务（每天北京时间 19:00）
- 🔧 支持手动触发执行
- 📋 包含项目排名、名称、语言、Stars、Forks、今日新增等信息
- �️ 自动添加标签进行分类和搜索
- 🔄 智能更新：每日只创建一个Issue，后续运行会更新当天的Issue内容

## 输出格式

每个项目都会按照以下格式显示：

| 排名 | 项目 | 语言 | Stars | Forks | 今日新增 |
|------|------|------|-------|-------|----------|
| 1 | [twentyhq / twenty](https://github.com/twentyhq/twenty) | TypeScript | 30,716 | 3,504 | 425 stars today |

Building a modern alternative to Salesforce, powered by the community.

---

## 为什么使用 Issues？

使用 GitHub Issues 相比文件存储有以下优势：

- 🔍 **更好的搜索**：可以通过标签、日期、关键词快速搜索
- 💬 **支持评论**：可以对特定日期的热门项目进行讨论
- 📱 **移动友好**：GitHub Issues 在移动端体验更好
- 🔔 **通知功能**：可以订阅Issues更新通知
- 🏷️ **标签管理**：自动添加 `github-trending` 和月份标签
- 📊 **数据分析**：更容易进行数据统计和分析

## 快速开始

### 1. 使用此模板

点击 "Use this template" 按钮创建你自己的仓库。

### 2. 启用 GitHub Actions

确保在仓库设置中启用了 GitHub Actions。

### 3. 启用功能

在仓库设置中启用 GitHub Actions。

### 4. 配置权限

确保 GitHub Actions 有足够的权限：
- 在 Settings → Actions → General → Workflow permissions 中选择 "Read and write permissions"
- 确保 Issues 功能已启用（Settings → General → Features）

### 5. 运行

- **自动运行**: 每天北京时间 19:00 自动执行
- **手动运行**: 在 Actions 页面点击 "Run workflow" 手动触发
- **查看结果**: 在 Issues 页面查看每日的 trending 数据

## 如何查看数据

### 查看所有 Trending Issues
访问: `https://github.com/你的用户名/你的仓库名/issues?q=label%3Agithub-trending`

### 按月份查看
访问: `https://github.com/你的用户名/你的仓库名/issues?q=label%3A2025-7`

### 搜索特定项目
在 Issues 中搜索项目名称或关键词

## 本地开发

### 安装依赖

```bash
npm install
```

### 运行脚本

```bash
# 运行脚本（本地测试时生成本地文件，GitHub Actions 中发布到 wiki）
npm run fetch-trending
```


## 文件结构

```
├── .github/
│   └── workflows/
│       └── fetch-trending.yml     # GitHub Actions 工作流
├── src/
│   └── fetch-and-publish.js       # GitHub Actions 发布脚本
├── output/                        # 本地生成的文件目录
│   └── YYYY-M/                    # 按年月分组的输出文件
│       └── YYYY-MM-DD.md          # 每日 trending 数据
├── package.json
└── README.md
```

## 标签系统

Issues 会自动添加以下标签：
- `github-trending`: 标识这是trending数据
- `YYYY-M`: 月份标签，如 `2025-7`，便于按月份筛选

## 自定义配置

### Issues 管理

Issues 会按照以下规则管理：
- 每天只创建一个Issue
- 如果当天已有Issue，会更新现有Issue内容
- 自动添加 `github-trending` 和月份标签便于分类

### 修改执行时间

编辑 `.github/workflows/fetch-trending.yml` 中的 cron 表达式：

```yaml
schedule:
  # 改为 UTC 11:00 执行，北京时间 19:00.确保能获取到最新的 trending 数据
  - cron: '0 11 * * *'
```

### 修改输出格式

编辑 `src/fetch-and-publish.js` 中的 `formatAsMarkdown` 方法来自定义输出格式。

### 数据查看和管理

**查看所有数据**: 访问仓库的 Issues 页面并过滤 `github-trending` 标签
**按月查看**: 使用月份标签如 `2025-7` 进行过滤
**搜索功能**: 直接在 Issues 中搜索项目名称或关键词


### 查看日志

在 GitHub Actions 页面查看详细的执行日志来诊断问题。

## 使用技巧

### 快速访问链接

将以下链接加入书签以快速访问：

- **所有 Trending Issues**: `https://github.com/你的用户名/trending/issues?q=label%3Agithub-trending`
- **本月 Issues**: `https://github.com/你的用户名/trending/issues?q=label%3A2025-7`
- **搜索特定语言**: 在 Issues 中搜索 "language: Python" 等

### 数据分析

- 通过标签快速筛选不同月份的数据
- 在Issues评论中记录对特定项目的观察和思考
- 利用GitHub的搜索功能分析项目趋势

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 相关链接

- [GitHub Trending](https://github.com/trending)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [GitHub Wiki API](https://docs.github.com/en/rest/wikis)
