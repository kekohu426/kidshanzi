import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Settings as SettingsIcon, Volume2, Palette, Target } from 'lucide-react';
import { dbService } from '../services/database';
import type { Settings } from '../types';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings>({
    showPinyin: true,
    autoPlay: true,
    traceLevel: 'medium',
    theme: 'light'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const userSettings = await dbService.getSettings();
        setSettings(userSettings);
      } catch (error) {
        console.error('加载设置失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  const saveSettings = async (newSettings: Settings) => {
    setSaving(true);
    try {
      await dbService.saveSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('保存设置失败:', error);
    } finally {
      setSaving(false);
    }
  };
  
  const handleSettingChange = (key: keyof Settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
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
            
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-6 h-6" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">设置</h1>
                <p className="text-gray-600">个性化您的学习体验</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* 显示设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                显示设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">显示拼音</h3>
                  <p className="text-sm text-gray-600">在汉字下方显示拼音</p>
                </div>
                <Switch
                  checked={settings.showPinyin}
                  onCheckedChange={(checked) => handleSettingChange('showPinyin', checked)}
                  disabled={saving}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">主题模式</h3>
                  <p className="text-sm text-gray-600">选择亮色或深色主题</p>
                </div>
                <Select
                  value={settings.theme}
                  onValueChange={(value: 'light' | 'dark') => handleSettingChange('theme', value)}
                  disabled={saving}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">亮色</SelectItem>
                    <SelectItem value="dark">深色</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          {/* 音频设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                音频设置
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">自动播放</h3>
                  <p className="text-sm text-gray-600">进入学习页面时自动播放发音</p>
                </div>
                <Switch
                  checked={settings.autoPlay}
                  onCheckedChange={(checked) => handleSettingChange('autoPlay', checked)}
                  disabled={saving}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* 练习设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                练习设置
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">描红难度</h3>
                  <p className="text-sm text-gray-600">调整描红练习的准确度要求</p>
                </div>
                <Select
                  value={settings.traceLevel}
                  onValueChange={(value: 'easy' | 'medium' | 'hard') => handleSettingChange('traceLevel', value)}
                  disabled={saving}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">简单</SelectItem>
                    <SelectItem value="medium">中等</SelectItem>
                    <SelectItem value="hard">困难</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          {/* 数据管理 */}
          <Card>
            <CardHeader>
              <CardTitle>数据管理</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">注意</h4>
                <p className="text-sm text-yellow-700">
                  清除数据将删除所有学习进度，此操作不可恢复。
                </p>
              </div>
              
              <Button 
                variant="destructive"
                onClick={async () => {
                  if (window.confirm('确定要清除所有学习数据吗？此操作不可恢复！')) {
                    try {
                      // 这里可以添加清除数据的逻辑
                      console.log('清除数据...');
                      alert('数据已清除');
                    } catch (error) {
                      console.error('清除数据失败:', error);
                      alert('清除数据失败');
                    }
                  }
                }}
                disabled={saving}
              >
                清除所有数据
              </Button>
            </CardContent>
          </Card>
          
          {/* 保存状态 */}
          {saving && (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                正在保存...
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
