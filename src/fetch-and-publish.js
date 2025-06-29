const axios = require('axios');
const cheerio = require('cheerio');
const { Octokit } = require('@octokit/rest');

class GitHubTrendingWikiPublisher {
  constructor() {
    this.baseUrl = 'https://github.com/trending';
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
    this.owner = process.env.GITHUB_REPOSITORY_OWNER;
    this.repo = process.env.GITHUB_REPOSITORY_NAME || process.env.GITHUB_REPOSITORY?.split('/')[1];
  }

  // 获取日期信息
  getDateInfo() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    return {
      dateString: `${year}年${month}月${day}日`,
      wikiPageName: `GitHub-Trending-${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
      isoDate: now.toISOString().split('T')[0]
    };
  }

  async fetchTrending() {
    try {
      const url = this.baseUrl;
      console.log(`📡 正在获取 GitHub Trending 数据...`);
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 30000
      });

      const $ = cheerio.load(response.data);
      const repositories = [];

      $('article.Box-row').each((index, element) => {
        const $repo = $(element);
        
        // 获取项目名称和链接
        const nameElement = $repo.find('h2 a');
        const name = nameElement.text().trim().replace(/\s+/g, ' ');
        const url = 'https://github.com' + nameElement.attr('href');
        
        // 获取描述
        const description = $repo.find('p.col-9').text().trim().replace(/\s+/g, ' ').replace(/\|/g, '\\|');
        
        // 获取编程语言
        const language = $repo.find('[itemprop="programmingLanguage"]').text().trim();
        
        // 获取stars和forks
        const starsElement = $repo.find('a[href*="/stargazers"]');
        const forksElement = $repo.find('a[href*="/forks"]');
        const stars = starsElement.text().trim();
        const forks = forksElement.text().trim();
        
        // 获取今日新增stars
        const todayStarsElement = $repo.find('.float-sm-right');
        let todayStars = todayStarsElement.text().trim();
        
        // 清理今日stars数据
        if (todayStars && todayStars.includes('stars today')) {
          const match = todayStars.match(/(\d+[\d,]*)\s*stars today/);
          todayStars = match ? `${match[1]} stars today` : todayStars;
        } else {
          todayStars = '-';
        }

        if (name && url) {
          repositories.push({
            name,
            url,
            description: description || '暂无描述',
            language: language || '未知',
            stars: stars || '0',
            forks: forks || '0',
            todayStars
          });
        }
      });

      console.log(`✅ 成功获取 ${repositories.length} 个项目`);
      return repositories;
    } catch (error) {
      console.error(`❌ 获取 GitHub Trending 失败:`, error.message);
      throw error;
    }
  }

  formatAsMarkdown(repositories, dateInfo) {
    let markdown = `# GitHub Trending Daily - ${dateInfo.dateString}\n\n`;
    markdown += `> **更新时间:** ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}\n`;
    markdown += `> **数据来源:** [GitHub Trending](https://github.com/trending)\n`;
    markdown += `> **项目数量:** ${repositories.length}\n\n`;
    
    if (repositories.length === 0) {
      markdown += '今日暂无热门项目数据\n\n';
      return markdown;
    }

    repositories.forEach((repo, index) => {
      const rank = index + 1;
      
      // 表格
      markdown += `| 排名 | 项目 | 语言 | Stars | Forks | 今日新增 |\n`;
      markdown += `|------|------|------|-------|-------|-----------|\n`;
      markdown += `| ${rank} | [${repo.name}](${repo.url}) | ${repo.language} | ${repo.stars} | ${repo.forks} | ${repo.todayStars} |\n\n`;
      
      // 项目描述
      if (repo.description && repo.description !== '暂无描述') {
        markdown += `${repo.description}\n\n`;
      }
      
      markdown += `---\n\n`;
    });

    markdown += `\n*本页面由 GitHub Actions 自动生成和更新*\n`;
    return markdown;
  }

  async publishToWiki(content, pageTitle) {
    try {
      console.log(`📝 正在发布到 Wiki: ${pageTitle}`);
      
      // 检查仓库是否存在并且有权限
      await this.octokit.repos.get({
        owner: this.owner,
        repo: this.repo
      });

      // 创建或更新 Wiki 页面
      const wikiUrl = `https://api.github.com/repos/${this.owner}/${this.repo}/wiki/${pageTitle}`;
      
      try {
        // 尝试更新现有页面
        await axios.put(wikiUrl, {
          content: content,
          message: `Update ${pageTitle} - ${new Date().toISOString()}`
        }, {
          headers: {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'GitHub-Trending-Bot'
          }
        });
      } catch (error) {
        if (error.response?.status === 404) {
          // 页面不存在，创建新页面
          await axios.post(`https://api.github.com/repos/${this.owner}/${this.repo}/wiki`, {
            title: pageTitle,
            content: content,
            message: `Create ${pageTitle} - ${new Date().toISOString()}`
          }, {
            headers: {
              'Authorization': `token ${process.env.GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'GitHub-Trending-Bot'
            }
          });
        } else {
          throw error;
        }
      }

      console.log(`✅ Wiki 页面发布成功: ${pageTitle}`);
      return true;
    } catch (error) {
      console.error(`❌ Wiki 发布失败:`, error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      
      // 备用方案：使用 Gist
      return await this.publishToGist(content, pageTitle);
    }
  }

  async publishToGist(content, title) {
    try {
      console.log(`📝 Wiki 不可用，尝试发布到 Gist...`);
      
      const response = await this.octokit.gists.create({
        description: `GitHub Trending - ${title}`,
        public: true,
        files: {
          [`${title}.md`]: {
            content: content
          }
        }
      });

      console.log(`✅ Gist 创建成功: ${response.data.html_url}`);
      return true;
    } catch (error) {
      console.error(`❌ Gist 发布失败:`, error.message);
      return false;
    }
  }

  async updateHomePage(dateInfo) {
    try {
      console.log('📝 正在更新 Wiki 首页...');
      
      const homeContent = `# GitHub Trending 热门项目\n\n` +
        `本项目自动抓取并整理 GitHub 每日热门项目，每天自动更新。\n\n` +
        `## 最新更新\n\n` +
        `- [${dateInfo.dateString}](${dateInfo.wikiPageName}) - 最新热门项目\n\n` +
        `## 历史记录\n\n` +
        `- [查看所有历史记录](https://github.com/${this.owner}/${this.repo}/wiki)\n\n` +
        `---\n\n` +
        `*最后更新: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}*\n` +
        `*自动更新频率: 每天 UTC 00:00 (北京时间 08:00)*\n`;

      await this.publishToWiki(homeContent, 'Home');
      console.log('✅ Wiki 首页更新成功');
    } catch (error) {
      console.error('❌ Wiki 首页更新失败:', error.message);
    }
  }

  async run() {
    console.log('🚀 开始执行 GitHub Trending 数据获取和发布任务...\n');
    
    // 验证环境变量
    if (!process.env.GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN 环境变量未设置');
    }
    
    if (!this.owner || !this.repo) {
      throw new Error('GitHub 仓库信息获取失败');
    }
    
    console.log(`📍 目标仓库: ${this.owner}/${this.repo}`);
    
    try {
      // 获取trending数据
      const repositories = await this.fetchTrending();
      const dateInfo = this.getDateInfo();
      
      // 生成markdown内容
      const markdown = this.formatAsMarkdown(repositories, dateInfo);
      
      // 发布到Wiki
      const success = await this.publishToWiki(markdown, dateInfo.wikiPageName);
      
      if (success) {
        // 更新首页
        await this.updateHomePage(dateInfo);
        
        console.log('\n🎉 任务执行成功！');
        console.log(`📄 Wiki 页面: https://github.com/${this.owner}/${this.repo}/wiki/${dateInfo.wikiPageName}`);
      } else {
        throw new Error('发布失败');
      }
      
    } catch (error) {
      console.error('\n❌ 任务执行失败:', error.message);
      process.exit(1);
    }
  }
}

// 执行主程序
if (require.main === module) {
  const publisher = new GitHubTrendingWikiPublisher();
  publisher.run();
}

module.exports = GitHubTrendingWikiPublisher;
