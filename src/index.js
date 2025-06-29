const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

class TrendingFetcher {
  constructor() {
    this.baseUrl = 'https://github.com/trending';
  }

  // 获取日期信息
  getDateInfo() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    return {
      dateString: `${year}年${month}月${day}日`,
      filename: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}.md`,
      folder: 'daily'
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
        timeout: 30000 // 30秒超时
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
      console.log(`❌ 获取 GitHub Trending 失败:`, error.message);
      return [];
    }
  }

  formatAsMarkdown(repositories, dateInfo) {
    let markdown = `# GitHub Trending Daily - ${dateInfo}\n\n`;
    markdown += `> **更新时间:** ${new Date().toLocaleString('zh-CN')}\n`;
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

    markdown += `\n*本文件由程序自动生成，更新时间: ${new Date().toLocaleString('zh-CN')}*\n`;
    return markdown;
  }

  async generateContent() {
    console.log('📊 开始获取 GitHub Trending 数据...\n');
    
    const repositories = await this.fetchTrending();
    const dateInfo = this.getDateInfo();
    const markdown = this.formatAsMarkdown(repositories, dateInfo.dateString);
    
    return {
      folder: dateInfo.folder,
      filename: dateInfo.filename,
      fullPath: `${dateInfo.folder}/${dateInfo.filename}`,
      content: markdown,
      dateString: dateInfo.dateString
    };
  }

  async saveToFile(content, filepath) {
    try {
      // 创建目录（如果不存在）
      const dir = path.dirname(filepath);
      if (dir && dir !== '.') {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filepath, content, 'utf8');
      console.log(`💾 文件已保存: ${filepath}`);
    } catch (error) {
      console.error(`❌ 保存文件失败 (${filepath}):`, error.message);
    }
  }
}

async function main() {
  const fetcher = new TrendingFetcher();
  
  try {
    console.log('🚀 开始获取 GitHub Trending 数据...\n');
    
    // 生成每日热门内容
    const result = await fetcher.generateContent();
    
    // 保存文件
    await fetcher.saveToFile(result.content, result.fullPath);
    console.log(`✅ 今日热门 (${result.dateString}) 数据已保存到 ${result.fullPath}`);
    
    console.log('\n🎉 GitHub trending data fetched and saved successfully!');
    console.log(`� 文件: ${result.fullPath}`);
    
  } catch (error) {
    console.error('❌ Error in main process:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = TrendingFetcher;
