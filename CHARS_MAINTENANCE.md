# 汉字数据维护指南

本文档详细说明如何维护和扩展汉字学习应用的字符数据。

## 📋 目录

- [数据结构说明](#数据结构说明)
- [添加新汉字](#添加新汉字)
- [资源文件管理](#资源文件管理)
- [数据验证](#数据验证)
- [批量操作](#批量操作)
- [最佳实践](#最佳实践)

## 📊 数据结构说明

### 完整字符对象结构

```json
{
  "char": "钱",                      // 汉字 (必需)
  "pinyin": "qián",                 // 拼音 (必需)
  "tone": 2,                        // 声调 1-4 (可选)
  "strokes": 10,                    // 笔画数 (必需)
  "strokeOrder": "撇、横、横、横...",    // 笔顺文字描述 (可选)
  "radical": "钅",                  // 部首 (可选)
  "grade": 1,                       // 年级 1-6 (可选)
  
  // 字形演变 (推荐)
  "evolution": [
    "/images/qian_oracle.png",       // 甲骨文
    "/images/qian_bronze.png",       // 金文
    "/images/qian_kai.png"           // 楷书
  ],
  
  // 音频资源 (推荐)
  "audio": "https://commons.wikimedia.org/wiki/Special:FilePath/Zh-qi%C3%A1n.ogg",
  
  // 构形拆解 (必需)
  "components": [
    {
      "part": "钅",                   // 部件
      "meaning": "金属相关，表示与金属、货币有关"  // 部件含义
    },
    {
      "part": "戋",
      "meaning": "表音，同时有'少'的含义"
    }
  ],
  
  // 组词卡片 (必需，至少2个)
  "wordCards": [
    {
      "word": "零钱",                  // 词语
      "img": "/images/coin.png",      // 配图
      "hint": "口袋里的小钱币",         // 提示文字
      "audio": "https://...",         // 词语音频 (可选)
      "pinyin": "líng qián"            // 词语拼音 (可选)
    }
  ],
  
  // 测验配置 (必需)
  "quiz": {
    "similarChars": ["钳", "浅", "栈"],  // 相似字符(至少2个)
    "type": "choice"                     // 测验类型 (可选)
  },
  
  // SRS算法参数 (必需)
  "srs": {
    "ease": 2.5,                      // 容易度系数
    "interval": 1,                    // 间隔天数
    "due": ""                         // 到期时间 (留空)
  },
  
  // 语义信息 (推荐)
  "meaning": "货币、金钱",               // 字义
  "story": "古时铜钱圆形中孔，穿绳使用",   // 历史故事
  "mnemonic": "左'钅'指金属，右'戋'表音",  // 记忆技巧
  
  // 分类标签 (可选)
  "tags": ["形声", "生活", "经济"],
  
  // 例句 (可选)
  "sentences": [
    {
      "text": "我把零钱放进钱袋。",
      "pinyin": "wǒ bǎ líng qián fàng jìn qián dài."
    }
  ]
}
```

### 字段优先级

**🔴 必需字段**：
- `char` - 汉字本身
- `pinyin` - 拼音
- `strokes` - 笔画数
- `components` - 构形部件
- `wordCards` - 组词卡片
- `quiz` - 测验配置
- `srs` - SRS参数

**🟡 推荐字段**：
- `evolution` - 字形演变
- `audio` - 音频
- `meaning` - 字义
- `mnemonic` - 记忆技巧

**🟢 可选字段**：
- `tone` - 声调
- `radical` - 部首
- `grade` - 年级
- `tags` - 标签
- `sentences` - 例句

## ➕ 添加新汉字

### 步骤1：准备基础信息

```bash
# 创建工作清单
字符: 学
拼音: xué
笔画: 8
部首: 子
年级: 1
含义: 学习、学问
```

### 步骤2：准备图片资源

```bash
# 图片命名规范
public/images/
├── xue_evolution_1.jpg     # 甲骨文/古文字
├── xue_evolution_2.jpg     # 金文/小篆
├── xue_evolution_3.jpg     # 楷书
├── xue_word_1.jpg         # 第一个组词图片
├── xue_word_2.jpg         # 第二个组词图片
└── xue_word_3.jpg         # 第三个组词图片
```

**图片要求**：
- 格式：WebP > JPG > PNG
- 演变图：300x200px
- 组词图：200x150px
- 文件大小：<50KB
- 色彩：适合儿童，清晰明亮

### 步骤3：编写字符数据

```json
{
  "char": "学",
  "pinyin": "xué",
  "tone": 2,
  "strokes": 8,
  "radical": "子",
  "grade": 1,
  "evolution": [
    "/images/xue_evolution_1.jpg",
    "/images/xue_evolution_2.jpg",
    "/images/xue_evolution_3.jpg"
  ],
  "audio": "https://commons.wikimedia.org/wiki/Special:FilePath/Zh-xué.ogg",
  "components": [
    {"part": "爻", "meaning": "表示学习、交叉的符号"},
    {"part": "冖", "meaning": "覆盖，表示房屋"},
    {"part": "子", "meaning": "孩子、学生"}
  ],
  "wordCards": [
    {
      "word": "学习",
      "img": "/images/xue_word_1.jpg",
      "hint": "在学校或家里读书学知识"
    },
    {
      "word": "学校",
      "img": "/images/xue_word_2.jpg",
      "hint": "学生上课的地方"
    },
    {
      "word": "学生",
      "img": "/images/xue_word_3.jpg",
      "hint": "在学校学习的人"
    }
  ],
  "quiz": {
    "similarChars": ["觉", "党", "常"]
  },
  "srs": {"ease": 2.5, "interval": 1, "due": ""},
  "meaning": "学习知识、求学",
  "mnemonic": "房子里的孩子在学习交叉的知识",
  "story": "古代学堂里，老师用交叉的符号教导孩子们学习",
  "tags": ["会意", "教育", "基础"]
}
```

### 步骤4：更新chars.json

```bash
# 1. 备份原文件
cp public/data/chars.json public/data/chars.json.backup

# 2. 添加新字符到数组末尾
# 编辑 public/data/chars.json

# 3. 验证数据格式
node scripts/validate-chars.js

# 4. 测试应用
npm run dev
```

## 🗂️ 资源文件管理

### 音频资源

**优先来源**：
1. [Wikimedia Commons](https://commons.wikimedia.org/) - 免费开源
2. [Lingua Libre](https://lingualibre.org/) - 多语言录音
3. 自定义录音 - 标准普通话

**格式要求**：
- 主格式：OGG Vorbis
- 备选：MP3 (兼容性)
- 时长：1-3秒
- 音质：清晰、无杂音
- 音量：标准化

**URL格式示例**：
```
https://commons.wikimedia.org/wiki/Special:FilePath/Zh-{pinyin}.ogg
```

### 图片资源规范

**演变图片**：
```bash
甲骨文/古文字 → 金文/小篆 → 楷书/现代字
尺寸: 300x200px
风格: 学术准确，清晰可辨
来源: 可信的古文字资料
```

**组词图片**：
```bash
风格: 卡通插画，适合儿童
尺寸: 200x150px
色彩: 明亮温暖
内容: 与词义直接相关
```

### 资源组织结构

```
public/images/
├── evolution/          # 字形演变图
│   ├── oracle/        # 甲骨文
│   ├── bronze/        # 金文
│   └── modern/        # 现代字形
├── words/             # 组词图片
│   ├── animals/       # 动物类
│   ├── objects/       # 物品类
│   └── actions/       # 动作类
└── icons/             # 界面图标
```

## ✅ 数据验证

### 使用验证脚本

```bash
# 运行完整验证
node scripts/validate-chars.js

# 输出示例
🔍 开始验证 chars.json 数据...
📊 找到 2 个字符

验证字符 1: 钱
  ✅ 所有必需字段完整
  ✅ 图片文件存在
  ✅ 音频链接有效

验证字符 2: 忘
  ⚠️  组词图片不存在: /images/forget_new.jpg
  ✅ 其他检查通过

📋 验证结果:
✅ 验证通过: 2 个字符
⚠️  警告: 1 个
```

### 手动验证清单

**数据完整性**：
- [ ] 所有必需字段已填写
- [ ] 拼音格式正确 (带声调或数字)
- [ ] 笔画数准确
- [ ] 至少2个组词
- [ ] 至少2个相似字符

**资源文件**：
- [ ] 演变图片存在且加载正常
- [ ] 组词图片存在且加载正常
- [ ] 音频链接可访问
- [ ] 图片尺寸合适

**学习体验**：
- [ ] 记忆技巧有助于理解
- [ ] 组词贴近生活
- [ ] 相似字符确实相似
- [ ] 难度适合目标年级

## 🔄 批量操作

### 批量导入模板

创建 `scripts/batch-import.js`：

```javascript
const fs = require('fs');
const path = require('path');

// CSV格式模板
const csvTemplate = `
char,pinyin,strokes,meaning,mnemonic
学,xué,8,学习知识,房子里的孩子学习
教,jiào,11,教导学生,老师用文字教导
书,shū,4,书本文字,手写的文字记录
`;

// 转换CSV到JSON
function csvToJson(csvData) {
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',');
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const obj = {
      srs: {ease: 2.5, interval: 1, due: ""}
    };
    
    headers.forEach((header, index) => {
      if (header === 'strokes') {
        obj[header] = parseInt(values[index]);
      } else {
        obj[header] = values[index];
      }
    });
    
    // 添加默认结构
    obj.components = [{part: "待补充", meaning: "待补充"}];
    obj.wordCards = [
      {word: "待补充", img: "/images/placeholder.jpg", hint: "待补充"}
    ];
    obj.quiz = {similarChars: ["待", "补"]};
    
    result.push(obj);
  }
  
  return result;
}
```

### 数据迁移脚本

```javascript
// 升级数据结构
function upgradeDataStructure() {
  const chars = JSON.parse(fs.readFileSync('chars.json', 'utf8'));
  
  chars.forEach(char => {
    // 添加新字段
    if (!char.grade) char.grade = 1;
    if (!char.tags) char.tags = [];
    
    // 重命名字段
    if (char.definition) {
      char.meaning = char.definition;
      delete char.definition;
    }
    
    // 数据清理
    if (char.audio === '') {
      delete char.audio;
    }
  });
  
  fs.writeFileSync('chars-upgraded.json', JSON.stringify(chars, null, 2));
}
```

## 💡 最佳实践

### 内容编写原则

1. **年龄适宜**：
   - 语言简单易懂
   - 概念贴近儿童生活
   - 避免过于复杂的解释

2. **记忆友好**：
   - 记忆技巧要有逻辑性
   - 故事情节要有趣
   - 部件拆解要准确

3. **视觉一致**：
   - 插画风格统一
   - 色彩搭配和谐
   - 图片质量高清

### 数据质量控制

```javascript
// 质量检查清单
const qualityChecks = {
  // 基础数据
  basicData: {
    charNotEmpty: char => char.char && char.char.length === 1,
    pinyinValid: char => /^[a-zA-Z]+[1-4]?$/.test(char.pinyin),
    strokesPositive: char => char.strokes > 0 && char.strokes < 50
  },
  
  // 学习内容
  learningContent: {
    componentsMinimum: char => char.components && char.components.length >= 1,
    wordCardsMinimum: char => char.wordCards && char.wordCards.length >= 2,
    similarCharsMinimum: char => char.quiz.similarChars.length >= 2
  },
  
  // 资源文件
  resources: {
    imagesExist: char => {
      // 检查图片文件是否存在
    },
    audioValid: char => {
      // 检查音频链接是否有效
    }
  }
};
```

### 版本管理

```bash
# 使用Git管理数据版本
git add public/data/chars.json
git commit -m "添加新字符: 学、教、书"
git tag v1.1.0

# 数据备份策略
cp chars.json "chars-$(date +%Y%m%d).json"
```

### 协作工作流

1. **内容创作**：设计师/教育专家准备资源
2. **数据录入**：按照模板格式录入数据
3. **质量检查**：运行验证脚本
4. **测试验证**：在应用中测试学习流程
5. **版本发布**：合并到主分支

---

通过遵循本指南，您可以高效地维护和扩展汉字学习应用的内容数据，确保为学习者提供高质量的教育体验。
