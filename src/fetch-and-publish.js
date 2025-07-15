const axios = require('axios');
const cheerio = require('cheerio');
const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

class GitHubTrendingIssuePublisher {
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
      wikiPageName: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
      isoDate: now.toISOString().split('T')[0],
      // 添加日期前缀，格式为 YYYY-M（不补零）
      monthPrefix: `${year}-${month}`
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

  async publishToIssue(content, dateInfo) {
    try {
      const issueTitle = `📊 GitHub Trending Daily - ${dateInfo.dateString}`;
      console.log(`📝 正在发布到 Issue: ${issueTitle}`);
      
      // 检查今天是否已经有相同的Issue
      const existingIssues = await this.octokit.issues.listForRepo({
        owner: this.owner,
        repo: this.repo,
        state: 'open',
        labels: 'github-trending',
        sort: 'created',
        direction: 'desc',
        per_page: 10
      });

      // 查找今天的Issue
      const todayIssue = existingIssues.data.find(issue => 
        issue.title === issueTitle
      );

      if (todayIssue) {
        // 更新现有Issue
        await this.octokit.issues.update({
          owner: this.owner,
          repo: this.repo,
          issue_number: todayIssue.number,
          body: content
        });
        
        console.log(`✅ Issue 更新成功: #${todayIssue.number}`);
        console.log(`🔗 Issue 链接: https://github.com/${this.owner}/${this.repo}/issues/${todayIssue.number}`);
        return { number: todayIssue.number, url: todayIssue.html_url };
      } else {
        // 创建新Issue
        const response = await this.octokit.issues.create({
          owner: this.owner,
          repo: this.repo,
          title: issueTitle,
          body: content,
          labels: ['github-trending', `${dateInfo.monthPrefix}`]
        });

        console.log(`✅ Issue 创建成功: #${response.data.number}`);
        console.log(`🔗 Issue 链接: ${response.data.html_url}`);
        return { number: response.data.number, url: response.data.html_url };
      }
      
    } catch (error) {
      console.error(`❌ Issue 发布失败:`, error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  }

  async saveToLocalFile(content, title) {
    try {
      const dateInfo = this.getDateInfo();
      const outputDir = path.join('output', dateInfo.monthPrefix);
      const fileName = `${title}.md`;
      const filePath = path.join(outputDir, fileName);
      
      // 创建输出目录
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // 保存文件
      fs.writeFileSync(filePath, content, 'utf8');
      
      console.log(`✅ 内容已保存到本地文件: ${filePath}`);
      console.log(`📄 你可以手动将此文件内容复制到 GitHub`);
      return true;
      
    } catch (error) {
      console.error('❌ 本地文件保存失败:', error.message);
      return false;
    }
  }

  async run() {
    console.log('🚀 开始执行 GitHub Trending 数据获取和发布任务...\n');
    
    // 检查是否在 GitHub Actions 环境中
    const isGitHubActions = !!process.env.GITHUB_ACTIONS;
    
    if (!isGitHubActions) {
      console.log('⚠️  当前不在 GitHub Actions 环境中');
      console.log('📝 将使用本地模式运行...\n');
    }
    
    // 验证环境变量
    if (!process.env.GITHUB_TOKEN) {
      console.log('⚠️  GITHUB_TOKEN 未设置');
      if (isGitHubActions) {
        console.log('📝 GitHub Actions 中没有有效 token，任务将失败\n');
        throw new Error('在 GitHub Actions 中 GITHUB_TOKEN 是必需的');
      } else {
        console.log('📝 本地模式：将保存到本地文件\n');
      }
    }
    
    if (!this.owner || !this.repo) {
      console.log('⚠️  GitHub 仓库信息获取失败');
      if (isGitHubActions) {
        throw new Error('GitHub 仓库信息获取失败');
      } else {
        console.log('📝 本地模式：使用默认值\n');
        this.owner = 'local-user';
        this.repo = 'trending';
      }
    }
    
    console.log(`📍 目标仓库: ${this.owner}/${this.repo}`);
    
    try {
      // 获取trending数据
      const repositories = await this.fetchTrending();
      const dateInfo = this.getDateInfo();
      
      // 生成markdown内容
      const markdown = this.formatAsMarkdown(repositories, dateInfo);
      
      let success = false;
      
      // 发布逻辑
      if (process.env.GITHUB_TOKEN && this.owner !== 'local-user') {
        // 有 GitHub Token，发布到 Issues
        const result = await this.publishToIssue(markdown, dateInfo);
        success = !!result;
        
        if (success) {
          console.log('\n🎉 任务执行成功！');
          console.log(`📄 查看结果: ${result.url}`);
          console.log(`📋 Issue 编号: #${result.number}`);
        }
      } else {
        // 本地环境，保存到本地文件
        success = await this.saveToLocalFile(markdown, dateInfo.wikiPageName);
        
        if (success) {
          console.log('\n🎉 任务执行成功！');
          console.log(`📄 本地文件已生成，请查看 output/${dateInfo.monthPrefix}/ 目录`);
        }
      }
      
      if (!success) {
        throw new Error('发布失败');
      }
      
    } catch (error) {
      console.error('\n❌ 任务执行失败:', error.message);
      if (isGitHubActions) {
        process.exit(1);
      } else {
        console.log('\n💡 提示：在 GitHub Actions 中运行时将自动发布到仓库的 Issues');
      }
    }
  }
}

// 执行主程序
if (require.main === module) {
  const publisher = new GitHubTrendingIssuePublisher();
  publisher.run();
}

module.exports = GitHubTrendingIssuePublisher;
