import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

// 简化的Hanzi Writer替代实现
interface StrokePlayerProps {
  character: string;
  className?: string;
  onComplete?: () => void;
}

export const StrokePlayer: React.FC<StrokePlayerProps> = ({
  character,
  className = '',
  onComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStroke, setCurrentStroke] = useState(0);
  const animationRef = useRef<number>();

  // 简化的笔顺数据（实际项目中应使用Hanzi Writer）
  const strokeData = {
    '钱': [
      { path: 'M 20 20 L 80 20', delay: 0 },
      { path: 'M 20 40 L 80 40', delay: 500 },
      { path: 'M 20 60 L 80 60', delay: 1000 },
      { path: 'M 50 10 L 50 70', delay: 1500 },
    ],
    '忘': [
      { path: 'M 30 20 L 70 20', delay: 0 },
      { path: 'M 25 40 L 75 40', delay: 500 },
      { path: 'M 50 10 L 50 70', delay: 1000 },
    ]
  };

  const drawCharacter = (ctx: CanvasRenderingContext2D, strokes: number = -1) => {
    ctx.clearRect(0, 0, 120, 120);
    
    // 绘制米字格
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // 外框
    ctx.rect(10, 10, 100, 100);
    // 中线
    ctx.moveTo(60, 10);
    ctx.lineTo(60, 110);
    ctx.moveTo(10, 60);
    ctx.lineTo(110, 60);
    ctx.stroke();

    // 绘制汉字（简化版本）
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (character === '钱') {
      ctx.fillStyle = '#1f2937';
      ctx.font = '60px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('钱', 60, 60);
    } else if (character === '忘') {
      ctx.fillStyle = '#1f2937';
      ctx.font = '60px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('忘', 60, 60);
    }
  };

  const playAnimation = () => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    setIsPlaying(true);
    setCurrentStroke(0);
    
    // 简化的动画：直接显示完整字符
    drawCharacter(ctx);
    
    // 模拟笔顺动画完成
    setTimeout(() => {
      setIsPlaying(false);
      onComplete?.();
    }, 2000);
  };

  const resetAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsPlaying(false);
    setCurrentStroke(0);
    
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        drawCharacter(ctx, 0);
      }
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        drawCharacter(ctx, 0);
      }
    }
  }, [character]);

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={120}
          height={120}
          className="border border-gray-200 rounded-lg shadow-sm"
        />
        
        {isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-lg">
            <div className="text-sm text-gray-600">笔顺演示中...</div>
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button
          onClick={playAnimation}
          disabled={isPlaying}
          className="flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          播放笔顺
        </Button>
        
        <Button
          variant="outline"
          onClick={resetAnimation}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          重置
        </Button>
      </div>
    </div>
  );
};
