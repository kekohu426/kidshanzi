import React from 'react';
import type { Character } from '../types';

interface ComponentViewProps {
  components: Character['components'];
  className?: string;
}

export const ComponentView: React.FC<ComponentViewProps> = ({
  components,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-center mb-6">汉字的组成部分</h3>
      
      <div className="grid gap-4">
        {components.map((component, index) => (
          <div 
            key={index}
            className="
              bg-white rounded-lg p-4 border border-gray-200 
              hover:shadow-md transition-shadow
            "
          >
            <div className="flex items-center gap-4">
              {/* 部件字符 */}
              <div className="
                w-16 h-16 bg-blue-50 rounded-lg 
                flex items-center justify-center
                text-2xl font-bold text-blue-600
              ">
                {component.part}
              </div>
              
              {/* 部件说明 */}
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">部件含义</div>
                <div className="text-gray-700">{component.meaning}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* 组合说明 */}
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <div className="text-sm text-yellow-700">
          <span className="font-semibold">组合解释：</span>
          这些部件组合在一起，形成了这个汉字的意思和发音。
        </div>
      </div>
    </div>
  );
};
