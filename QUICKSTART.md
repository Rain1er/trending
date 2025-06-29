# 快速开始指南

## 🚀 一键部署到你的 GitHub 仓库

### 步骤1: Fork 或复制这个项目
将此项目复制到你的 GitHub 账户

### 步骤2: 启用必要功能
1. **启用 GitHub Actions**:
   - 进入你的仓库 → Settings → Actions → General
   - 确保选择 "Allow all actions and reusable workflows"

2. **配置权限**:
   - 进入 Settings → Actions → General → Workflow permissions
   - 选择 "Read and write permissions"
   - 勾选 "Allow GitHub Actions to create and approve pull requests"

### 步骤3: 运行
- **自动运行**: 每天北京时间早上 8:00 自动执行
- **手动运行**: 进入 Actions 页面，点击 "GitHub Trending to Wiki" → "Run workflow"

### 步骤4: 查看结果
运行完成后，访问你的仓库的 `wiki/` 目录即可看到结果！

文件将保存在: `https://github.com/你的用户名/trending/tree/main/wiki`

例如：`2025-06-29.md` 等文件

## 📊 输出示例

将自动生成如下格式的内容：

| 排名 | 项目 | 语言 | Stars | Forks | 今日新增 |
|------|------|------|-------|-------|----------|
| 1 | [twentyhq / twenty](https://github.com/twentyhq/twenty) | TypeScript | 30,716 | 3,504 | 425 stars today |

Building a modern alternative to Salesforce, powered by the community.

---

## 🛠️ 自定义

### 修改执行时间
编辑 `.github/workflows/fetch-trending.yml` 文件中的 cron 表达式

### 修改输出格式  
编辑 `src/fetch-and-publish.js` 文件中的 `formatAsMarkdown` 方法

### 本地测试
```bash
npm install
npm run fetch-trending
```

## ❓ 问题排除

如果遇到问题，请检查：
1. GitHub Actions 是否启用
2. 仓库权限是否正确配置
3. Actions 页面的详细日志

**发布位置**：
文件将直接保存到仓库的 `wiki/` 目录中，便于查看和管理。

更多详细信息请查看 [README.md](README.md)。
