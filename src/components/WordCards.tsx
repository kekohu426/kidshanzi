import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer';
import type { Character } from '../types';

interface WordCardsProps {
  words: Character['wordCards'];
  onComplete: () => void;
  className?: string;
}

export const WordCards: React.FC<WordCardsProps> = ({
  words,
  onComplete,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedCards, setViewedCards] = useState<Set<number>>(new Set());

  const currentWord = words[currentIndex];
  
  const nextCard = () => {
    const newIndex = (currentIndex + 1) % words.length;
    setCurrentIndex(newIndex);
    setViewedCards(prev => new Set([...prev, currentIndex]));
    
    // 如果所有卡片都查看过，完成此步骤
    if (viewedCards.size + 1 >= words.length) {
      setTimeout(onComplete, 1000);
    }
  };
  
  const prevCard = () => {
    setCurrentIndex((currentIndex - 1 + words.length) % words.length);
  };
  
  // 构造TTS音频URL
  const getTTSUrl = (word: string) => {
    // 简化版本：直接返回一个模拟的URL
    return `https://commons.wikimedia.org/wiki/Special:FilePath/Zh-${encodeURIComponent(word)}.ogg`;
  };

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* 词汇卡片头部 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">词汇学习</h3>
            <span className="text-sm opacity-90">
              {currentIndex + 1} / {words.length}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">{currentWord.word}</span>
            <AudioPlayer 
              src={getTTSUrl(currentWord.word)}
              className="text-white"
            />
          </div>
        </div>
        
        {/* 图片区域 */}
        <div className="p-6">
          <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
            <img 
              src={currentWord.img} 
              alt={currentWord.word}
              className="w-full h-full object-cover"
              onError={(e) => {
                // 图片加载失败时的备选方案
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center text-gray-400">
                    <div class="text-center">
                      <div class="text-4xl mb-2">📚</div>
                      <div class="text-sm">${currentWord.word}</div>
                    </div>
                  </div>
                `;
              }}
            />
          </div>
          
          {/* 提示文字 */}
          <div className="text-center text-gray-600 mb-6">
            <p className="text-lg">{currentWord.hint}</p>
          </div>
          
          {/* 进度指示 */}
          <div className="flex gap-2 justify-center mb-4">
            {words.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex 
                    ? 'bg-blue-500' 
                    : viewedCards.has(index) 
                    ? 'bg-green-400' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* 控制按钮 */}
        <div className="flex justify-between items-center p-4 bg-gray-50">
          <Button
            variant="outline"
            onClick={prevCard}
            disabled={words.length <= 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            上一个
          </Button>
          
          <div className="text-sm text-gray-500">
            已学习 {viewedCards.size + 1} / {words.length}
          </div>
          
          <Button
            onClick={nextCard}
            className="flex items-center gap-2"
          >
            下一个
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
