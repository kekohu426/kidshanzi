import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, CheckCircle } from 'lucide-react';

interface TraceCanvasProps {
  character: string;
  onComplete: (success: boolean) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
  className?: string;
}

export const TraceCanvas: React.FC<TraceCanvasProps> = ({
  character,
  onComplete,
  difficulty = 'medium',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [traces, setTraces] = useState<Array<{ x: number; y: number }[]>>([]);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string>('');

  const thresholds = {
    easy: { distance: 15, coverage: 0.6 },
    medium: { distance: 12, coverage: 0.7 },
    hard: { distance: 10, coverage: 0.8 }
  };

  const threshold = thresholds[difficulty];

  const drawTemplate = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, 300, 300);
    
    // 绘制米字格
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    // 外框
    ctx.strokeRect(50, 50, 200, 200);
    
    // 中线
    ctx.beginPath();
    ctx.moveTo(150, 50);
    ctx.lineTo(150, 250);
    ctx.moveTo(50, 150);
    ctx.lineTo(250, 150);
    ctx.stroke();
    
    ctx.setLineDash([]);
    
    // 绘制模板字（淡灰色）
    ctx.fillStyle = '#d1d5db';
    ctx.font = '120px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(character, 150, 150);
  };

  const getCanvasCoordinates = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const coords = getCanvasCoordinates(event);
    setTraces(prev => [...prev, [coords]]);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    const coords = getCanvasCoordinates(event);
    
    // 更新当前笔迹
    setTraces(prev => {
      const newTraces = [...prev];
      newTraces[newTraces.length - 1] = [...newTraces[newTraces.length - 1], coords];
      return newTraces;
    });
    
    // 绘制用户笔迹
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    const currentTrace = traces[traces.length - 1] || [];
    if (currentTrace.length > 0) {
      ctx.beginPath();
      ctx.moveTo(currentTrace[0].x, currentTrace[0].y);
      currentTrace.concat([coords]).forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    checkAccuracy();
  };

  const checkAccuracy = () => {
    // 简化的准确度检测：基于笔迹数量和覆盖范围
    const totalPoints = traces.reduce((sum, trace) => sum + trace.length, 0);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    if (totalPoints > 50 && traces.length >= 2) {
      setFeedback('写得很好！');
      setTimeout(() => onComplete(true), 1000);
    } else if (newAttempts >= 2) {
      setFeedback('继续加油！');
      setTimeout(() => onComplete(true), 1000); // 两次尝试后通过
    } else {
      setFeedback('再试一次吧！');
    }
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    setTraces([]);
    setAttempts(0);
    setFeedback('');
    drawTemplate(ctx);
  };

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        drawTemplate(ctx);
      }
    }
  }, [character]);

  // 重绘用户笔迹
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    drawTemplate(ctx);
    
    // 绘制所有笔迹
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    traces.forEach(trace => {
      if (trace.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trace[0].x, trace[0].y);
        trace.forEach(point => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      }
    });
  }, [traces, character]);

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="border border-gray-200 rounded-lg shadow-sm cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        
        {feedback && (
          <div className="absolute top-2 left-2 right-2 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border rounded-full shadow-sm text-sm">
              {feedback.includes('很好') && <CheckCircle className="w-4 h-4 text-green-500" />}
              {feedback}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex gap-2 items-center">
        <Button
          variant="outline"
          onClick={clearCanvas}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          重写
        </Button>
        
        <div className="text-sm text-gray-600">
          尝试次数: {attempts}/2
        </div>
      </div>
    </div>
  );
};
