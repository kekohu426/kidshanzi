import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, CheckCircle } from 'lucide-react';
import { dbService } from '../services/database';
import { srsService } from '../services/srs';
import type { Character, Progress } from '../types';

export const ReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [reviewQueue, setReviewQueue] = useState<Progress[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewCount, setReviewCount] = useState(0);
  
  useEffect(() => {
    const loadReviewData = async () => {
      try {
        const [allProgress, allChars] = await Promise.all([
          dbService.getAllProgress(),
          dbService.loadCharacters()
        ]);
        
        // 获取需要复习的字符
        const today = new Date().toISOString().split('T')[0];
        const needReview = allProgress.filter(p => 
          p.due <= today && p.status !== 'new'
        );
        
        setReviewQueue(needReview);
        setCharacters(allChars);
        setReviewCount(needReview.length);
      } catch (error) {
        console.error('加载复习数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadReviewData();
  }, []);
  
  const startReview = () => {
    if (reviewQueue.length > 0) {
      const firstChar = reviewQueue[0].char;
      navigate(`/learn/${firstChar}`);
    }
  };
  
  const markAsReviewed = async (char: string, isCorrect: boolean) => {
    try {
      const progress = reviewQueue.find(p => p.char === char);
      if (!progress) return;
      
      const updatedProgress = srsService.calculateNextReview(progress, isCorrect);
      await dbService.saveProgress(updatedProgress);
      
      // 从队列中移除
      setReviewQueue(prev => prev.filter(p => p.char !== char));
      setReviewCount(prev => prev - 1);
    } catch (error) {
      console.error('更新复习进度失败:', error);
    }
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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              返回首页
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-800">复习中心</h1>
              <p className="text-gray-600">巩固已学知识，加深记忆</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {reviewQueue.length === 0 ? (
          /* 没有复习任务 */
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">太棒了！</h2>
            <p className="text-gray-600 mb-6">今天没有需要复习的字符</p>
            <Button onClick={() => navigate('/')}>返回首页</Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 复习统计 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>今日复习任务</span>
                  <span className="text-blue-600">{reviewCount} 个字符</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">
                    通过间隔复习，加深对汉字的记忆
                  </p>
                  <Button 
                    onClick={startReview}
                    className="flex items-center gap-2"
                    size="lg"
                  >
                    <Play className="w-4 h-4" />
                    开始复习
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* 复习列表 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">待复习字符</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {reviewQueue.map((progress) => {
                  const char = characters.find(c => c.char === progress.char);
                  if (!char) return null;
                  
                  let statusColor = 'bg-blue-100 text-blue-600';
                  let statusText = '复习';
                  
                  if (progress.status === 'reviewing') {
                    statusColor = 'bg-yellow-100 text-yellow-600';
                    statusText = '强化';
                  }
                  
                  return (
                    <Card 
                      key={char.char} 
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/learn/${char.char}`)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold mb-2">{char.char}</div>
                        <div className="text-sm text-gray-600 mb-2">{char.pinyin}</div>
                        <div className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
                          {statusText}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          间隔: {progress.interval}天
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
