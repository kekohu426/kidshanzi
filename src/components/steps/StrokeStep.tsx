import React from 'react';
import { StrokePlayer } from '../StrokePlayer';
import type { Character } from '../../types';

interface StrokeStepProps {
  character: Character;
  onComplete: () => void;
}

export const StrokeStep: React.FC<StrokeStepProps> = ({ character, onComplete }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* 标题 */}
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-4">
          学习 "{character.char}" 的笔顺
        </h3>
        <p className="text-gray-600">
          正确的笔顺能帮助你写出更美丽的汉字
        </p>
      </div>
      
      {/* 笔顺信息 */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{character.strokes}</div>
            <div className="text-sm text-gray-600">总笔画数</div>
          </div>
          <div>
            <div className="text-lg text-gray-700">{character.strokeOrder}</div>
            <div className="text-sm text-gray-600">笔顺说明</div>
          </div>
        </div>
      </div>
      
      {/* 笔顺动画 */}
      <div className="flex justify-center">
        <StrokePlayer 
          character={character.char}
          onComplete={onComplete}
          className=""
        />
      </div>
      
      {/* 笔顺技巧 */}
      <div className="bg-yellow-50 rounded-lg p-6">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <span>✍️</span>
          书写技巧
        </h4>
        <div className="grid gap-3 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <span className="font-medium text-blue-600">1.</span>
            <span>从上到下，从左到右</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-blue-600">2.</span>
            <span>先横后竖，先撇后捺</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-blue-600">3.</span>
            <span>先中间后两边，先里头后封口</span>
          </div>
        </div>
      </div>
    </div>
  );
};
