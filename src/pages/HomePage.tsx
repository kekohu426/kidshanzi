import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Calendar, Settings, Play, Target, TrendingUp } from 'lucide-react';
import { dbService } from '../services/database';
import type { Character, Progress } from '../types';

export const HomePage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [todayReviews, setTodayReviews] = useState<Progress[]>([]);
  const [allProgress, setAllProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // 初始化数据库
        await dbService.initializeData();
        
        // 加载数据
        const [charsData, reviewsData, progressData] = await Promise.all([
          dbService.loadCharacters(),
          dbService.getTodayReviews(),
          dbService.getAllProgress()
        ]);
        
        setCharacters(charsData);
        setTodayReviews(reviewsData);
        setAllProgress(progressData);
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const getProgressStats = () => {
    const total = characters.length;
    const learned = allProgress.filter(p => p.status !== 'new').length;
    const mastered = allProgress.filter(p => p.status === 'mastered').length;
    
    return { total, learned, mastered };
  };
  
  const stats = getProgressStats();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">初始化中...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">汉字小课堂</h1>
              <p className="text-gray-600 mt-1">轻松学汉字，快乐成长</p>
            </div>
            
            <Link to="/settings">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                设置
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">学习进度</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.learned}/{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                已学习 {Math.round((stats.learned / stats.total) * 100)}%
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">今日复习</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayReviews.length}</div>
              <p className="text-xs text-muted-foreground">
                待复习字符
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">掌握情况</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.mastered}</div>
              <p className="text-xs text-muted-foreground">
                已掌握字符
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* 今日任务 */}
        {todayReviews.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              今日复习 ({todayReviews.length})
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {todayReviews.map((progress) => {
                const char = characters.find(c => c.char === progress.char);
                if (!char) return null;
                
                return (
                  <Link key={char.char} to={`/learn/${char.char}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold mb-2">{char.char}</div>
                        <div className="text-sm text-gray-600">{char.pinyin}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {progress.status === 'learning' ? '学习中' : '复习'}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
        
        {/* 所有字符 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              所有字符
            </h2>
            
            <Link to="/review">
              <Button variant="outline" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                开始复习
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {characters.map((char) => {
              const progress = allProgress.find(p => p.char === char.char);
              const status = progress?.status || 'new';
              
              let statusColor = 'bg-gray-100 text-gray-600';
              let statusText = '新字';
              
              switch (status) {
                case 'learning':
                  statusColor = 'bg-blue-100 text-blue-600';
                  statusText = '学习中';
                  break;
                case 'reviewing':
                  statusColor = 'bg-yellow-100 text-yellow-600';
                  statusText = '复习中';
                  break;
                case 'mastered':
                  statusColor = 'bg-green-100 text-green-600';
                  statusText = '已掌握';
                  break;
              }
              
              return (
                <Link key={char.char} to={`/learn/${char.char}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold mb-2">{char.char}</div>
                      <div className="text-sm text-gray-600 mb-2">{char.pinyin}</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
                        {statusText}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
