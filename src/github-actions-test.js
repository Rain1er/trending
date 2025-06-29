#!/usr/bin/env node

// 模拟 GitHub Actions 环境进行测试
process.env.GITHUB_ACTIONS = 'true';
process.env.GITHUB_REPOSITORY_OWNER = process.env.GITHUB_REPOSITORY_OWNER || 'Rain1er';
process.env.GITHUB_REPOSITORY_NAME = process.env.GITHUB_REPOSITORY_NAME || 'trending';
process.env.GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY || 'Rain1er/trending';

// 如果有真实的 GitHub Token，使用它
if (!process.env.GITHUB_TOKEN) {
  console.log('⚠️  未设置 GITHUB_TOKEN，将使用本地模式测试');
  console.log('💡 要在 GitHub Actions 中测试，请设置有效的 GITHUB_TOKEN\n');
}

const GitHubTrendingWikiPublisher = require('./fetch-and-publish');

async function runTest() {
  console.log('🧪 模拟 GitHub Actions 环境测试...\n');
  
  const publisher = new GitHubTrendingWikiPublisher();
  await publisher.run();
}

if (require.main === module) {
  runTest();
}
