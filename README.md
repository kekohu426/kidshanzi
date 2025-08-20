# 汉字学习Web应用

一个为"qian"和"忘"两个汉字设计的6步学习PWA应用，基于React + TypeScript + Vite构建。

## ✨ 功能特性

- 🎨 **6步学习流程**：引入 → 拆解 → 笔顺 → 描红 → 组词 → 小测
- 💾 **本地缓存**：IndexedDB存储，支持离线使用
- 🏆 **SRS算法**：间隔重复学习系统
- 🎧 **音频播放**：支持.ogg格式音频
- ✍️ **手写识别**：Canvas描红功能
- 📺 **笔顺动画**：基于Hanzi Writer
- 📱 **响应式设计**：兼容桌面和移动设备

## 🚀 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 访问 http://localhost:5173
```

## 📝 文档

- 🛠️ **[部署说明](./DEPLOYMENT.md)** - 完整部署指南
- 📁 **[数据维护](./CHARS_MAINTENANCE.md)** - chars.json文件维护指南

## 📂 项目结构

```
hanzi-kids/
├── public/
│   ├── data/chars.json          # 汉字数据 ⭐
│   └── images/                 # 图片资源
├── src/                        # 源代码
├── scripts/
│   └── validate-chars.js       # 数据验证脚本
├── DEPLOYMENT.md               # 部署说明
└── CHARS_MAINTENANCE.md        # 数据维护指南
```

## 🔧 chars.json 维护

### 添加新汉字
1. 准备图片资源（演变图 + 组词图）
2. 编辑 `public/data/chars.json`
3. 验证数据：`node scripts/validate-chars.js`
4. 测试应用：`npm run dev`

### 数据结构示例
```json
{
  "char": "新字",
  "pinyin": "xīn zì",
  "strokes": 8,
  "evolution": ["/images/xinzi_1.jpg"],
  "audio": "https://commons.wikimedia.org/...",
  "components": [
    {"part": "部件", "meaning": "含义"}
  ],
  "wordCards": [
    {"word": "词语", "img": "/images/word.jpg", "hint": "提示"}
  ],
  "quiz": {"similarChars": ["相似1", "相似2"]},
  "srs": {"ease": 2.5, "interval": 1, "due": ""}
}
```

## 🌐 部署选项

### 1. 静态网站托管
```bash
npm run build
# 上传 dist/ 到 Vercel/Netlify/GitHub Pages
```

### 2. 服务器部署
```bash
npm run build
sudo cp -r dist/* /var/www/html/
```

### 3. Docker部署
```bash
docker build -t hanzi-kids .
docker run -p 80:80 hanzi-kids
```

## 🐛 故障排除

### 常见问题
- **音频无法播放**：检查URL可访问性
- **图片加载失败**：确认文件路径正确
- **数据加载错误**：验证JSON格式

### 调试工具
```javascript
// 在浏览器控制台清空缓存
indexedDB.deleteDatabase('hanzi-kids');
location.reload();
```

## 📊 性能优化

- 图片优化：WebP格式，<50KB
- 代码分割：React.lazy()懒加载
- 缓存策略：IndexedDB本地存储
- CDN加速：静态资源使用CDN

## 📞 技术支持

如遇到问题，请检查：
1. 浏览器控制台错误信息
2. Network标签中的网络请求状态
3. Application > IndexedDB中的数据库状态

---

🎉 **祝您学习愉快！**

**作者**：MiniMax Agent  
**版本**：1.0.0  
**日期**：2025-08-20
