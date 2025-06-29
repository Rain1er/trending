const GitHubTrendingWikiPublisher = require('./fetch-and-publish');

// 模拟 GitHub Actions 环境变量进行测试
process.env.GITHUB_TOKEN = process.env.GITHUB_TOKEN || 'demo-token';
process.env.GITHUB_REPOSITORY_OWNER = process.env.GITHUB_REPOSITORY_OWNER || 'your-username';
process.env.GITHUB_REPOSITORY_NAME = process.env.GITHUB_REPOSITORY_NAME || 'trending';
process.env.GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY || 'your-username/trending';

async function testFetch() {
  const publisher = new GitHubTrendingWikiPublisher();
  
  console.log('🧪 测试数据获取功能...\n');
  
  try {
    // 只测试数据获取部分
    const repositories = await publisher.fetchTrending();
    const dateInfo = publisher.getDateInfo();
    const markdown = publisher.formatAsMarkdown(repositories, dateInfo);
    
    console.log('✅ 数据获取成功！');
    console.log(`📊 获取到 ${repositories.length} 个项目`);
    console.log(`📄 Wiki 页面名称: ${dateInfo.wikiPageName}`);
    console.log('\n📝 生成的 Markdown 预览 (前500字符):');
    console.log(markdown.substring(0, 500) + '...');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

if (require.main === module) {
  testFetch();
}
