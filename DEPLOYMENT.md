# 汉字学习Web应用 - 部署说明

## 项目概述

这是一个基于React + TypeScript + Vite构建的汉字学习web应用，支持离线缓存和6步学习流程。

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- pnpm (推荐) 或 npm

### 本地开发
```bash
# 1. 安装依赖
pnpm install
# 或
npm install

# 2. 启动开发服务器
pnpm dev
# 或
npm run dev

# 3. 访问 http://localhost:5173
```

### 生产构建
```bash
# 构建生产版本
pnpm build
# 或
npm run build

# 预览构建结果
pnpm preview
# 或
npm run preview
```

## 📁 项目结构

```
hanzi-kids/
├── public/
│   ├── data/
│   │   └── chars.json          # 汉字数据文件 ⭐
│   └── images/                 # 图片资源
├── src/
│   ├── components/             # React组件
│   ├── pages/                  # 页面组件
│   ├── services/               # 数据服务
│   ├── hooks/                  # 自定义Hooks
│   ├── types/                  # TypeScript类型
│   └── lib/                    # 工具库
├── dist/                       # 构建输出目录
└── package.json
```

## 🎯 核心功能

- **6步学习流程**：引入→拆解→笔顺→描红→组词→小测
- **本地缓存**：IndexedDB存储字符数据和学习进度
- **SRS复习算法**：间隔重复学习系统
- **音频播放**：支持远程.ogg格式音频
- **笔顺动画**：基于Hanzi Writer库
- **手写识别**：Canvas描红功能
- **响应式设计**：支持移动设备

## 📝 chars.json 文件维护指南

### 文件位置
`public/data/chars.json`

### 数据结构
```json
[
  {
    "char": "钱",                    // 汉字
    "pinyin": "qián",               // 拼音
    "strokes": 10,                  // 笔画数
    "strokeOrder": "撇、横、横...",    // 笔顺描述
    "evolution": [                  // 字形演变图片
      "/images/qian_oracle.png",
      "/images/qian_bronze.png",
      "/images/qian_kai.png"
    ],
    "audio": "https://...",         // 音频URL
    "components": [                 // 构形部件
      {
        "part": "钅",
        "meaning": "金属相关"
      }
    ],
    "wordCards": [                  // 组词卡片
      {
        "word": "零钱",
        "img": "/images/coin.png",
        "hint": "口袋里的小钱"
      }
    ],
    "quiz": {                       // 测验配置
      "similarChars": ["钳", "浅"]
    },
    "srs": {                        // SRS算法参数
      "ease": 2.5,
      "interval": 1,
      "due": ""
    },
    "meaning": "货币、金钱",          // 字义
    "story": "记忆故事...",          // 记忆故事
    "mnemonic": "记忆技巧..."        // 记忆技巧
  }
]
```

### 添加新汉字步骤

#### 1. 准备资源文件
```bash
# 在public/images/目录下添加图片
public/images/
├── [字]_evolution_1.jpg      # 字形演变图1
├── [字]_evolution_2.jpg      # 字形演变图2  
├── [字]_evolution_3.jpg      # 字形演变图3
├── [字]_word1.jpg           # 组词图片1
├── [字]_word2.jpg           # 组词图片2
└── [字]_word3.jpg           # 组词图片3
```

#### 2. 编辑chars.json
在数组中添加新的字符对象：
```json
{
  "char": "新字",
  "pinyin": "xīn zì",
  "strokes": 8,
  "strokeOrder": "横、竖、撇、捺...",
  "evolution": [
    "/images/xinzi_evolution_1.jpg",
    "/images/xinzi_evolution_2.jpg",
    "/images/xinzi_evolution_3.jpg"
  ],
  "audio": "https://音频链接.ogg",
  "components": [
    {"part": "部件1", "meaning": "含义1"},
    {"part": "部件2", "meaning": "含义2"}
  ],
  "wordCards": [
    {"word": "词语1", "img": "/images/xinzi_word1.jpg", "hint": "提示1"},
    {"word": "词语2", "img": "/images/xinzi_word2.jpg", "hint": "提示2"}
  ],
  "quiz": {
    "similarChars": ["相似字1", "相似字2", "相似字3"]
  },
  "srs": {"ease": 2.5, "interval": 1, "due": ""},
  "meaning": "字的含义",
  "story": "记忆故事",
  "mnemonic": "记忆技巧"
}
```

#### 3. 音频资源
- **推荐来源**：维基共享资源 (Wikimedia Commons)
- **格式**：.ogg (Web标准格式)
- **示例URL**：`https://commons.wikimedia.org/wiki/Special:FilePath/Zh-字.ogg`
- **备选方案**：应用会自动使用TTS作为回退

#### 4. 图片优化
```bash
# 推荐图片格式和尺寸
演变图片: 300x200px, WebP/JPG
组词图片: 200x150px, WebP/JPG
文件大小: <50KB
```

### 维护工具脚本

创建 `scripts/validate-chars.js` 验证数据：
```javascript
const fs = require('fs');
const path = require('path');

function validateChars() {
  const charsPath = path.join(__dirname, '../public/data/chars.json');
  const chars = JSON.parse(fs.readFileSync(charsPath, 'utf8'));
  
  chars.forEach((char, index) => {
    // 验证必需字段
    const required = ['char', 'pinyin', 'strokes', 'components', 'wordCards'];
    required.forEach(field => {
      if (!char[field]) {
        console.error(`字符 ${index}: 缺少字段 ${field}`);
      }
    });
    
    // 验证图片文件存在
    char.evolution?.forEach(img => {
      const imgPath = path.join(__dirname, '../public', img);
      if (!fs.existsSync(imgPath)) {
        console.warn(`图片不存在: ${img}`);
      }
    });
  });
  
  console.log('验证完成');
}

validateChars();
```

## 🌐 部署方案

### 1. 静态网站托管
**推荐平台**：Vercel, Netlify, GitHub Pages

```bash
# 构建项目
npm run build

# 上传 dist/ 目录到托管平台
```

### 2. 服务器部署
```bash
# 使用 nginx 托管
sudo cp -r dist/* /var/www/html/
sudo systemctl reload nginx
```

### 3. Docker部署
创建 `Dockerfile`：
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -t hanzi-kids .
docker run -p 80:80 hanzi-kids
```

## 🔧 配置选项

### Vite配置 (vite.config.ts)
```typescript
export default defineConfig({
  base: '/hanzi-kids/',  // 如果部署在子路径
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
```

### 环境变量
创建 `.env.local`：
```
VITE_API_BASE_URL=https://your-api.com
VITE_AUDIO_CDN=https://your-cdn.com
```

## 📊 性能优化

1. **图片优化**：使用WebP格式，压缩至<50KB
2. **代码分割**：React.lazy()懒加载页面
3. **缓存策略**：IndexedDB缓存字符数据
4. **CDN加速**：静态资源使用CDN

## 🐛 故障排除

### 常见问题

**1. 音频无法播放**
- 检查音频URL是否可访问
- 确认浏览器支持.ogg格式
- 查看浏览器控制台错误信息

**2. 图片加载失败**
- 验证图片路径是否正确
- 检查public/images/目录下文件是否存在
- 确认图片格式支持

**3. 数据无法加载**
- 验证chars.json格式是否正确
- 检查网络请求是否成功
- 清空IndexedDB缓存重新加载

### 调试工具
```javascript
// 在浏览器控制台清空缓存
indexedDB.deleteDatabase('hanzi-kids');
location.reload();
```

## 📞 技术支持

如有问题，请检查：
1. **控制台错误**：F12打开开发者工具
2. **网络请求**：查看Network标签
3. **数据库状态**：Application > IndexedDB

---

**项目作者**：MiniMax Agent  
**最后更新**：2025-08-20  
**版本**：1.0.0
