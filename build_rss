const fs = require('fs');
const { Feed } = require('feed');
const marked = require('marked');

// 1. 初始化 RSS 频道信息
const feed = new Feed({
  title: "新闻联播文字稿",
  description: "每日新闻联播文字稿自动更新 RSS",
  id: "https://github.com/",
  link: "https://github.com/",
  language: "zh-CN",
  updated: new Date(),
});

// 2. 找到当前目录下所有类似 20260320.md 的文件，按日期倒序排列，取最新的 15 篇
const files = fs.readdirSync('.')
  .filter(f => /^\d{8}\.md$/.test(f))
  .sort()
  .reverse()
  .slice(0, 15);

// 3. 循环处理每一天的文件
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // 将 Markdown 转成带格式的 HTML，保证 RSS 阅读器里排版好看
  const htmlContent = marked.parse(content); 
  
  // 提取文件名中的年月日
  const dateStr = file.replace('.md', '');
  const y = dateStr.slice(0, 4);
  const m = dateStr.slice(4, 6);
  const d = dateStr.slice(6, 8);

  // 添加单篇文章到 RSS
  feed.addItem({
    title: `${y}年${m}月${d}日 新闻联播文字稿`,
    id: file,
    link: `https://github.com/`, 
    content: htmlContent,
    date: new Date(`${y}-${m}-${d}T21:00:00+08:00`), // 设定为北京时间晚上 9 点
  });
});

// 4. 生成 feed.xml 文件
fs.writeFileSync('feed.xml', feed.rss2());
console.log('RSS 订阅源 feed.xml 已成功生成！');
