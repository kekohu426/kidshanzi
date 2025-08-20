import React from 'react';
import { TraceCanvas } from '../TraceCanvas';
import type { Character } from '../../types';

interface TraceStepProps {
  character: Character;
  onComplete: () => void;
}

export const TraceStep: React.FC<TraceStepProps> = ({ character, onComplete }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* 标题 */}
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-4">
          临摹练习 "{character.char}"
        </h3>
        <p className="text-gray-600">
          跟着米字格里的模板，用鼠标或手指描写汉字
        </p>
      </div>
      
      {/* 练习指导 */}
      <div className="bg-green-50 rounded-lg p-6">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <span>📝</span>
          练习指导
        </h4>
        <div className="grid gap-2 text-sm text-gray-700">
          <div>• 按照正确的笔顺描写</div>
          <div>• 尽量跟着米字格的线条走</div>
          <div>• 最少尝试两次，可以通过</div>
        </div>
      </div>
      
      {/* 描红练习区 */}
      <div className="flex justify-center">
        <TraceCanvas 
          character={character.char}
          onComplete={onComplete}
          difficulty="medium"
          className=""
        />
      </div>
      
      {/* 鼓励信息 */}
      <div className="text-center text-gray-600">
        <p>别着急，慢慢来，熟能生巧！</p>
      </div>
    </div>
  );
};
