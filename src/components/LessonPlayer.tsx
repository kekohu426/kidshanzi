import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';

// 学习步骤组件
import { IntroStep } from './steps/IntroStep';
import { DecomposeStep } from './steps/DecomposeStep';
import { StrokeStep } from './steps/StrokeStep';
import { TraceStep } from './steps/TraceStep';
import { WordsStep } from './steps/WordsStep';
import { QuizStep } from './steps/QuizStep';

import { dbService } from '../services/database';
import { srsService } from '../services/srs';
import type { Character, LessonStepId } from '../types';
import { LESSON_STEPS } from '../types';

export const LessonPlayer: React.FC = () => {
  const { char } = useParams<{ char: string }>();
  const navigate = useNavigate();
  
  const [character, setCharacter] = useState<Character | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadCharacter = async () => {
      if (!char) return;
      
      try {
        const charData = await dbService.getCharacter(char);
        if (charData) {
          setCharacter(charData);
          
          // 加载进度
          const progress = await dbService.getProgress(char);
          if (progress) {
            setCurrentStep(progress.step);
            const completed = new Set<number>();
            for (let i = 0; i < progress.step; i++) {
              completed.add(i);
            }
            setCompletedSteps(completed);
          }
        } else {
          console.error('未找到字符数据:', char);
        }
      } catch (error) {
        console.error('加载字符数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCharacter();
  }, [char]);
  
  const handleStepComplete = async () => {
    if (!character) return;
    
    // 标记当前步骤为完成
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    
    // 更新进度
    try {
      const progress = await dbService.getProgress(character.char) || {
        char: character.char,
        status: 'new' as const,
        due: new Date().toISOString().split('T')[0],
        ease: 2.5,
        interval: 1,
        lastAt: '',
        step: 0
      };
      
      const updatedProgress = srsService.completeStep(progress, currentStep);
      await dbService.saveProgress(updatedProgress);
      
      // 自动跳转到下一步
      if (currentStep < LESSON_STEPS.length - 1) {
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
        }, 1000);
      } else {
        // 完成所有步骤，返回首页
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('保存进度失败:', error);
    }
  };
  
  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < LESSON_STEPS.length) {
      setCurrentStep(stepIndex);
    }
  };
  
  const goHome = () => {
    navigate('/');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }
  
  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">未找到字符数据</p>
          <Button onClick={goHome}>返回首页</Button>
        </div>
      </div>
    );
  }
  
  const currentStepData = LESSON_STEPS[currentStep];
  const progressValue = ((completedSteps.size) / LESSON_STEPS.length) * 100;
  
  const renderCurrentStep = () => {
    const stepProps = {
      character,
      onComplete: handleStepComplete
    };
    
    switch (currentStepData.id as LessonStepId) {
      case 'intro':
        return <IntroStep {...stepProps} />;
      case 'decompose':
        return <DecomposeStep {...stepProps} />;
      case 'stroke':
        return <StrokeStep {...stepProps} />;
      case 'trace':
        return <TraceStep {...stepProps} />;
      case 'words':
        return <WordsStep {...stepProps} />;
      case 'quiz':
        return <QuizStep {...stepProps} />;
      default:
        return <div>未知步骤</div>;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={goHome}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              首页
            </Button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">
                学习 "{character.char}"
              </h1>
              <p className="text-sm text-gray-600">{character.pinyin}</p>
            </div>
            
            <div className="w-16" /> {/* 占位符，保持布局平衡 */}
          </div>
          
          {/* 进度条 */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                步骤 {currentStep + 1} / {LESSON_STEPS.length}
              </span>
              <span className="text-sm text-gray-600">
                {Math.round(progressValue)}% 完成
              </span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>
          
          {/* 步骤导航 */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {LESSON_STEPS.map((step, index) => (
              <button
                key={step.id}
                onClick={() => goToStep(index)}
                className={`
                  flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    index === currentStep
                      ? 'bg-blue-500 text-white'
                      : completedSteps.has(index)
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {step.name}
              </button>
            ))}
          </div>
        </div>
      </header>
      
      {/* 主内容区域 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-2">{currentStepData.title}</h2>
            <p className="text-gray-600">{currentStepData.description}</p>
          </div>
          
          {renderCurrentStep()}
        </div>
        
        {/* 底部导航按钮 */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => goToStep(currentStep - 1)}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            上一步
          </Button>
          
          <Button
            onClick={() => goToStep(currentStep + 1)}
            disabled={currentStep === LESSON_STEPS.length - 1}
            className="flex items-center gap-2"
          >
            下一步
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </main>
    </div>
  );
};
