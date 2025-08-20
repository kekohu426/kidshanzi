export interface Character {
  char: string;
  pinyin: string;
  strokes: number;
  strokeOrder: string;
  evolution: string[];
  audio: string;
  components: Array<{
    part: string;
    meaning: string;
  }>;
  wordCards: Array<{
    word: string;
    img: string;
    hint: string;
  }>;
  quiz: {
    similarChars: string[];
  };
  srs: {
    ease: number;
    interval: number;
    due: string;
  };
  meaning: string;
  story: string;
}

export interface Progress {
  char: string;
  status: 'new' | 'learning' | 'reviewing' | 'mastered';
  due: string;
  ease: number;
  interval: number;
  lastAt: string;
  step: number; // 当前学习步骤 (0-5)
}

export interface Settings {
  showPinyin: boolean;
  autoPlay: boolean;
  traceLevel: 'easy' | 'medium' | 'hard';
  theme: 'light' | 'dark';
}

export interface LessonStep {
  id: string;
  name: string;
  title: string;
  description: string;
}

export const LESSON_STEPS: LessonStep[] = [
  { id: 'intro', name: '引入', title: '认识汉字', description: '了解汉字的含义和发音' },
  { id: 'decompose', name: '拆解', title: '结构分析', description: '学习汉字的组成部分' },
  { id: 'stroke', name: '笔顺', title: '笔画顺序', description: '观看正确的笔顺动画' },
  { id: 'trace', name: '描红', title: '临摹练习', description: '跟着笔迹描写汉字' },
  { id: 'words', name: '组词', title: '词汇学习', description: '学习相关词汇和用法' },
  { id: 'quiz', name: '小测', title: '知识检测', description: '测试学习效果' }
];

export type LessonStepId = 'intro' | 'decompose' | 'stroke' | 'trace' | 'words' | 'quiz';
