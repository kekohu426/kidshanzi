import React from 'react';
import { WordCards } from '../WordCards';
import type { Character } from '../../types';

interface WordsStepProps {
  character: Character;
  onComplete: () => void;
}

export const WordsStep: React.FC<WordsStepProps> = ({ character, onComplete }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* 标题 */}
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-4">
          学习包含 "{character.char}" 的词语
        </h3>
        <p className="text-gray-600">
          通过词语来加深对汉字的理解和记忆
        </p>
      </div>
      
      {/* 学习提示 */}
      <div className="bg-purple-50 rounded-lg p-6">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <span>📚</span>
          学习方法
        </h4>
        <div className="grid gap-2 text-sm text-gray-700">
          <div>• 仔细观察每个词语的图片</div>
          <div>• 认真阅读词语的含义提示</div>
          <div>• 点击音频按钮听发音</div>
          <div>• 尝试用这些词语造句</div>
        </div>
      </div>
      
      {/* 词语卡片 */}
      <div className="flex justify-center">
        <WordCards 
          words={character.wordCards}
          onComplete={onComplete}
          className="w-full"
        />
      </div>
    </div>
  );
};
