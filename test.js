const GitHubTrendingIssuePublisher = require('./src/fetch-and-publish.js');

// 创建测试实例
const publisher = new GitHubTrendingIssuePublisher();

// 测试日期信息功能
console.log('🧪 测试日期信息功能...');
const dateInfo = publisher.getDateInfo();
console.log('📅 日期信息:', dateInfo);

// 测试格式化功能
console.log('\n🧪 测试格式化功能...');
const testRepos = [
  {
    name: 'test/repo1',
    url: 'https://github.com/test/repo1',
    description: '这是一个测试仓库',
    language: 'JavaScript',
    stars: '1,234',
    forks: '567',
    todayStars: '89 stars today'
  },
  {
    name: 'test/repo2',
    url: 'https://github.com/test/repo2',
    description: '另一个测试仓库',
    language: 'Python',
    stars: '2,345',
    forks: '678',
    todayStars: '90 stars today'
  }
];

const markdown = publisher.formatAsMarkdown(testRepos, dateInfo);
console.log('📝 格式化结果:');
console.log(markdown.substring(0, 300) + '...');

console.log('\n✅ 核心功能测试完成！');
