import fs from 'fs';
import path from 'path';
import { Feed } from 'feed';
import { marked } from 'marked';

// 明确指出新闻稿存放在 news 文件夹中
const newsDir = 'news';

// 1. 初始化 RSS 频道信息
const feed = new Feed({
  title: "新闻联播文字稿",
  description: "每日新闻联播文字稿自动更新 RSS",
  id: "https://github.com/ALLCAPS-Droid/xin-wen-lian-bo/",
  link: "https://github.com/ALLCAPS-Droid/xin-wen-lian-bo/",
  language: "zh-CN",
  // image 对应的是大号封面图（<atom:logo> 和 RSS 2.0 image）
  image: "https://gh-proxy.org/https://raw.githubusercontent.com/ALLCAPS-Droid/xin-wen-lian-bo/refs/heads/master/logo.png",
  // favicon 对应的是左侧列表的小图标（<atom:icon>）
  favicon: "https://gh-proxy.org/https://raw.githubusercontent.com/ALLCAPS-Droid/xin-wen-lian-bo/refs/heads/master/logo.png",
  updated: new Date(),
});

// 检查文件夹是否存在
if (!fs.existsSync(newsDir)) {
  console.log(`错误：未找到 ${newsDir} 文件夹。`);
  process.exit(1);
}

// 2. 读取 news 文件夹下所有类似 20260320.md 的文件，取最新的 15 篇
const files = fs.readdirSync(newsDir)
  .filter(f => /^\d{8}\.md$/.test(f))
  .sort()
  .reverse()
  .slice(0, 15);

if (files.length === 0) {
  console.log('没有找到任何格式为 YYYYMMDD.md 的新闻文件，跳过生成。');
  process.exit(0);
}

// 3. 循环处理每一天的文件
files.forEach(file => {
  const filePath = path.join(newsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  // 将 Markdown 转成带格式的 HTML
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
    link: `https://github.com/ALLCAPS-Droid/xin-wen-lian-bo/blob/master/news/${file}`,
    content: htmlContent,
    // ====== 强行加上作者信息，防止某些弱智客户端报错 ======
    author: [
      {
        name: "CCTV",
        link: "https://tv.cctv.com/"
      }
    ],
    // =========================================================
    date: new Date(`${y}-${m}-${d}T21:00:00+08:00`), 
  });
});

// 4. 生成 feed.xml 文件到根目录
fs.writeFileSync('feed.xml', feed.rss2());
console.log('RSS 订阅源 feed.xml 已成功生成！包含了 ' + files.length + ' 篇文章。');

