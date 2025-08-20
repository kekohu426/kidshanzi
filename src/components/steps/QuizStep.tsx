import React from 'react';
import { QuizComponent } from '../QuizComponent';
import type { Character } from '../../types';

interface QuizStepProps {
  character: Character;
  onComplete: (success: boolean) => void;
}

export const QuizStep: React.FC<QuizStepProps> = ({ character, onComplete }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* 标题 */}
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-4">
          现在来测试一下学习效果吧！
        </h3>
        <p className="text-gray-600">
          根据提示信息，选择正确的汉字
        </p>
      </div>
      
      {/* 测验提示 */}
      <div className="bg-orange-50 rounded-lg p-6">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <span>🤔</span>
          测验说明
        </h4>
        <div className="grid gap-2 text-sm text-gray-700">
          <div>• 仔细阅读题目中的提示信息</div>
          <div>• 从三个选项中选择正确答案</div>
          <div>• 不用担心答错，这是学习的过程</div>
        </div>
      </div>
      
      {/* 测验组件 */}
      <div className="flex justify-center">
        <QuizComponent 
          character={character}
          onComplete={onComplete}
          className="w-full"
        />
      </div>
      
      {/* 鼓励信息 */}
      <div className="text-center text-gray-600">
        <p>加油！你已经学了很多了！</p>
      </div>
    </div>
  );
};
