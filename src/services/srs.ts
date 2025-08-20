// SRS (Spaced Repetition System) 算法实现
import type { Progress } from '../types';

class SRSService {
  // 计算下次复习时间
  calculateNextReview(progress: Progress, isCorrect: boolean): Progress {
    const now = new Date();
    let newInterval = progress.interval;
    let newEase = progress.ease;
    
    if (isCorrect) {
      // 答对了，增加间隔
      switch (progress.interval) {
        case 1:
          newInterval = 3;
          break;
        case 3:
          newInterval = 7;
          break;
        case 7:
          newInterval = 14;
          break;
        case 14:
          newInterval = 30;
          break;
        default:
          newInterval = Math.round(progress.interval * newEase);
          break;
      }
      
      // 提高熟练度
      newEase = Math.min(3.0, newEase + 0.1);
    } else {
      // 答错了，重置间隔
      newInterval = 1;
      newEase = Math.max(1.3, newEase - 0.2);
    }
    
    // 计算下次到期时间
    const nextDue = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);
    
    return {
      ...progress,
      interval: newInterval,
      ease: newEase,
      due: nextDue.toISOString().split('T')[0],
      lastAt: now.toISOString(),
      status: newInterval >= 30 ? 'mastered' : 'reviewing'
    };
  }
  
  // 完成学习步骤
  completeStep(progress: Progress, stepIndex: number): Progress {
    const newStep = Math.max(progress.step, stepIndex + 1);
    
    if (newStep >= 6 && progress.status === 'new') {
      // 完成所有步骤，开始复习周期
      return this.calculateNextReview({
        ...progress,
        step: newStep,
        status: 'learning'
      }, true);
    }
    
    return {
      ...progress,
      step: newStep,
      status: progress.status === 'new' ? 'learning' : progress.status
    };
  }
}

export const srsService = new SRSService();
