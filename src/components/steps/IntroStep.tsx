import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Lightbulb } from 'lucide-react';
import { AudioPlayer } from '../AudioPlayer';
import type { Character } from '../../types';

interface IntroStepProps {
  character: Character;
  onComplete: () => void;
}

export const IntroStep: React.FC<IntroStepProps> = ({ character, onComplete }) => {
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const [showStory, setShowStory] = useState(false);
  
  const handleAudioPlay = () => {
    setHasPlayedAudio(true);
  };
  
  const handleComplete = () => {
    onComplete();
  };
  
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* 汉字展示 */}
      <div className="text-center">
        <div className="inline-block bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl p-8 mb-6">
          <div className="text-8xl font-bold mb-4">{character.char}</div>
          <div className="text-2xl font-medium">{character.pinyin}</div>
        </div>
        
        {/* 发音播放 */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="text-lg text-gray-600">听一听发音：</span>
          <AudioPlayer 
            src={character.audio}
            autoPlay={true}
            className=""
          />
        </div>
      </div>
      
      {/* 字符含义 */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span>📚</span>
          字符含义
        </h3>
        <p className="text-gray-700 text-lg leading-relaxed">
          {character.meaning}
        </p>
      </div>
      
      {/* 记忆小技巧 */}
      <div className="bg-yellow-50 rounded-lg p-6">
        <button
          onClick={() => setShowStory(!showStory)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            记忆小技巧
          </h3>
          <span className="text-gray-400">
            {showStory ? '收起' : '展开'}
          </span>
        </button>
        
        {showStory && (
          <div className="mt-4 text-gray-700 leading-relaxed">
            {character.story}
          </div>
        )}
      </div>
      
      {/* 演变历史 */}
      <div className="bg-green-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>📜</span>
          字体演变
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          {character.evolution.map((imgPath, index) => {
            const stages = ['古代', '中期', '现代'];
            return (
              <div key={index} className="text-center">
                <div className="bg-white rounded-lg p-4 mb-2 border">
                  <img
                    src={imgPath}
                    alt={`${character.char}的${stages[index]}字体`}
                    className="w-full h-20 object-contain"
                    onError={(e) => {
                      // 图片加载失败时的备选
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `
                        <div class="w-full h-20 flex items-center justify-center text-gray-400 text-3xl">
                          ${character.char}
                        </div>
                      `;
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600">{stages[index]}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* 完成按钮 */}
      <div className="text-center pt-6">
        <Button
          onClick={handleComplete}
          size="lg"
          className="px-8 py-3 text-lg"
        >
          我已了解，继续学习 →
        </Button>
      </div>
    </div>
  );
};
