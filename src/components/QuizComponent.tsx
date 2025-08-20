import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import type { Character } from '../types';

interface QuizComponentProps {
  character: Character;
  onComplete: (success: boolean) => void;
  className?: string;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({
  character,
  onComplete,
  className = ''
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  
  // 生成选项
  useEffect(() => {
    const correctAnswer = character.char;
    const similarChars = character.quiz.similarChars;
    
    // 打乱选项顺序
    const allOptions = [correctAnswer, ...similarChars].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  }, [character]);
  
  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === character.char;
    setIsCorrect(correct);
    setShowResult(true);
    
    // 2秒后自动完成
    setTimeout(() => {
      onComplete(correct);
    }, 2000);
  };
  
  const resetQuiz = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  };
  
  return (
    <div className={`max-w-lg mx-auto ${className}`}>
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* 题目头部 */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold mb-4">请选择正确的汉字</h3>
          
          {/* 问题提示 */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-lg text-gray-700 mb-2">
              读音为 <span className="font-semibold text-blue-600">{character.pinyin}</span> 的汉字是？
            </p>
            <p className="text-sm text-gray-600">
              含义：{character.meaning}
            </p>
          </div>
        </div>
        
        {/* 选项区域 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {options.map((option, index) => {
            let buttonClass = 'h-20 text-3xl font-bold transition-all duration-200 ';
            
            if (showResult) {
              if (option === character.char) {
                buttonClass += 'bg-green-100 border-green-500 text-green-700';
              } else if (option === selectedAnswer && option !== character.char) {
                buttonClass += 'bg-red-100 border-red-500 text-red-700';
              } else {
                buttonClass += 'bg-gray-100 border-gray-300 text-gray-500';
              }
            } else {
              buttonClass += 'bg-white border-gray-300 hover:bg-blue-50 hover:border-blue-300';
            }
            
            return (
              <button
                key={index}
                onClick={() => !showResult && handleAnswer(option)}
                disabled={showResult}
                className={`
                  border-2 rounded-lg ${buttonClass}
                  disabled:cursor-not-allowed
                `}
              >
                {option}
              </button>
            );
          })}
        </div>
        
        {/* 结果显示 */}
        {showResult && (
          <div className="text-center mb-6">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
              isCorrect 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {isCorrect ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">回答正确！</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5" />
                  <span className="font-semibold">再加油哦！</span>
                </>
              )}
            </div>
            
            {!isCorrect && (
              <p className="text-sm text-gray-600 mt-2">
                正确答案是：<span className="font-semibold">{character.char}</span>
              </p>
            )}
          </div>
        )}
        
        {/* 重新开始按钮 */}
        {showResult && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={resetQuiz}
              className="flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              重新答题
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
