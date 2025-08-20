const fs = require('fs');
const path = require('path');

/**
 * 验证chars.json文件的数据完整性
 */
function validateChars() {
  console.log('🔍 开始验证 chars.json 数据...');
  
  const charsPath = path.join(__dirname, '../public/data/chars.json');
  
  if (!fs.existsSync(charsPath)) {
    console.error('❌ chars.json 文件不存在');
    return;
  }
  
  let chars;
  try {
    chars = JSON.parse(fs.readFileSync(charsPath, 'utf8'));
  } catch (error) {
    console.error('❌ chars.json 格式错误:', error.message);
    return;
  }
  
  if (!Array.isArray(chars)) {
    console.error('❌ chars.json 必须是数组格式');
    return;
  }
  
  console.log(`📊 找到 ${chars.length} 个字符`);
  
  let errors = 0;
  let warnings = 0;
  
  chars.forEach((char, index) => {
    console.log(`\n验证字符 ${index + 1}: ${char.char || '未知'}`);
    
    // 验证必需字段
    const requiredFields = [
      'char', 'pinyin', 'strokes', 'components', 
      'wordCards', 'quiz', 'srs'
    ];
    
    requiredFields.forEach(field => {
      if (!char[field]) {
        console.error(`  ❌ 缺少必需字段: ${field}`);
        errors++;
      }
    });
    
    // 验证数据类型
    if (char.strokes && typeof char.strokes !== 'number') {
      console.error('  ❌ strokes 必须是数字');
      errors++;
    }
    
    if (char.components && !Array.isArray(char.components)) {
      console.error('  ❌ components 必须是数组');
      errors++;
    }
    
    if (char.wordCards && !Array.isArray(char.wordCards)) {
      console.error('  ❌ wordCards 必须是数组');
      errors++;
    }
    
    // 验证图片文件
    if (char.evolution) {
      char.evolution.forEach((imgPath, imgIndex) => {
        const fullPath = path.join(__dirname, '../public', imgPath);
        if (!fs.existsSync(fullPath)) {
          console.warn(`  ⚠️  演变图片不存在: ${imgPath}`);
          warnings++;
        }
      });
    }
    
    if (char.wordCards) {
      char.wordCards.forEach((card, cardIndex) => {
        if (card.img) {
          const fullPath = path.join(__dirname, '../public', card.img);
          if (!fs.existsSync(fullPath)) {
            console.warn(`  ⚠️  组词图片不存在: ${card.img}`);
            warnings++;
          }
        }
        
        if (!card.word || !card.hint) {
          console.error(`  ❌ 组词卡片 ${cardIndex} 缺少 word 或 hint`);
          errors++;
        }
      });
    }
    
    // 验证音频链接
    if (char.audio) {
      if (!char.audio.startsWith('http')) {
        console.warn(`  ⚠️  音频链接可能无效: ${char.audio}`);
        warnings++;
      }
    } else {
      console.warn('  ⚠️  缺少音频链接');
      warnings++;
    }
    
    // 验证相似字符
    if (char.quiz && char.quiz.similarChars) {
      if (!Array.isArray(char.quiz.similarChars) || char.quiz.similarChars.length < 2) {
        console.error('  ❌ similarChars 至少需要2个相似字符');
        errors++;
      }
    }
  });
  
  console.log('\n📋 验证结果:');
  console.log(`✅ 验证通过: ${chars.length - errors} 个字符`);
  
  if (errors > 0) {
    console.log(`❌ 错误: ${errors} 个`);
  }
  
  if (warnings > 0) {
    console.log(`⚠️  警告: ${warnings} 个`);
  }
  
  if (errors === 0 && warnings === 0) {
    console.log('🎉 所有数据验证通过!');
  } else if (errors === 0) {
    console.log('✅ 核心数据正常，存在一些可选资源缺失');
  } else {
    console.log('❌ 存在数据错误，请修复后重新验证');
    process.exit(1);
  }
}

/**
 * 生成字符统计信息
 */
function generateStats() {
  const charsPath = path.join(__dirname, '../public/data/chars.json');
  const chars = JSON.parse(fs.readFileSync(charsPath, 'utf8'));
  
  console.log('\n📊 数据统计:');
  console.log(`总字符数: ${chars.length}`);
  
  const strokeCounts = {};
  const pinyinCounts = {};
  
  chars.forEach(char => {
    // 笔画统计
    if (char.strokes) {
      strokeCounts[char.strokes] = (strokeCounts[char.strokes] || 0) + 1;
    }
    
    // 拼音统计
    if (char.pinyin) {
      const initial = char.pinyin.charAt(0);
      pinyinCounts[initial] = (pinyinCounts[initial] || 0) + 1;
    }
  });
  
  console.log('\n笔画分布:');
  Object.keys(strokeCounts)
    .sort((a, b) => Number(a) - Number(b))
    .forEach(strokes => {
      console.log(`  ${strokes}画: ${strokeCounts[strokes]}字`);
    });
  
  console.log('\n拼音首字母分布:');
  Object.keys(pinyinCounts)
    .sort()
    .forEach(initial => {
      console.log(`  ${initial}: ${pinyinCounts[initial]}字`);
    });
}

// 执行验证
validateChars();
generateStats();
