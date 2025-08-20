import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ComponentView } from '../ComponentView';
import type { Character } from '../../types';

interface DecomposeStepProps {
  character: Character;
  onComplete: () => void;
}

export const DecomposeStep: React.FC<DecomposeStepProps> = ({ character, onComplete }) => {
  const [currentComponent, setCurrentComponent] = useState(0);
  const [hasViewedAll, setHasViewedAll] = useState(false);
  
  const handleNext = () => {
    if (currentComponent < character.components.length - 1) {
      setCurrentComponent(currentComponent + 1);
    } else {
      setHasViewedAll(true);
    }
  };
  
  const handleComplete = () => {
    onComplete();
  };
  
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* 汉字展示 */}
      <div className="text-center">
        <div className="inline-block bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
          <div className="text-6xl font-bold text-gray-800 mb-2">{character.char}</div>
          <div className="text-lg text-gray-600">{character.pinyin}</div>
        </div>
      </div>
      
      {/* 部件分析 */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">
          让我们来看看这个字的组成部分
        </h3>
        
        {!hasViewedAll ? (
          /* 分步展示每个部件 */
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-sm text-gray-500">
                部件 {currentComponent + 1} / {character.components.length}
              </span>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center text-4xl font-bold text-blue-600 border-2 border-blue-200">
                  {character.components[currentComponent].part}
                </div>
                
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-2">
                    部件：{character.components[currentComponent].part}
                  </h4>
                  <p className="text-gray-700">
                    {character.components[currentComponent].meaning}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Button onClick={handleNext} size="lg">
                {currentComponent < character.components.length - 1 ? '下一个部件' : '查看全部'}
              </Button>
            </div>
          </div>
        ) : (
          /* 显示所有部件 */
          <div className="space-y-6">
            <ComponentView components={character.components} />
            
            {/* 组合说明 */}
            <div className="bg-purple-50 rounded-lg p-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span>🧩</span>
                组合记忆
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {character.story}
              </p>
            </div>
            
            <div className="text-center">
              <Button onClick={handleComplete} size="lg">
                我已理解结构，继续学习 →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
