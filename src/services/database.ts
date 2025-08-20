import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Character, Progress, Settings } from '../types';

interface HanziDB extends DBSchema {
  characters: {
    key: string;
    value: Character;
  };
  progress: {
    key: string;
    value: Progress;
    indexes: {
      status: string;
      due: string;
    };
  };
  settings: {
    key: string;
    value: Settings & { key: string };
  };
}

class DatabaseService {
  private db: IDBPDatabase<HanziDB> | null = null;

  async init(): Promise<void> {
    this.db = await openDB<HanziDB>('hanzi-kids-db', 1, {
      upgrade(db) {
        // 字符表
        if (!db.objectStoreNames.contains('characters')) {
          db.createObjectStore('characters', { keyPath: 'char' });
        }
        
        // 进度表
        if (!db.objectStoreNames.contains('progress')) {
          const progressStore = db.createObjectStore('progress', { keyPath: 'char' });
          progressStore.createIndex('status', 'status');
          progressStore.createIndex('due', 'due');
        }
        
        // 设置表
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      }
    });
  }

  // 字符相关操作
  async loadCharacters(): Promise<Character[]> {
    if (!this.db) await this.init();
    return await this.db!.getAll('characters');
  }

  async saveCharacters(characters: Character[]): Promise<void> {
    if (!this.db) await this.init();
    const tx = this.db!.transaction('characters', 'readwrite');
    await Promise.all(characters.map(char => tx.store.put(char)));
    await tx.done;
  }

  async getCharacter(char: string): Promise<Character | undefined> {
    if (!this.db) await this.init();
    return await this.db!.get('characters', char);
  }

  // 进度相关操作
  async getProgress(char: string): Promise<Progress | undefined> {
    if (!this.db) await this.init();
    return await this.db!.get('progress', char);
  }

  async saveProgress(progress: Progress): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.put('progress', progress);
  }

  async getTodayReviews(): Promise<Progress[]> {
    if (!this.db) await this.init();
    const today = new Date().toISOString().split('T')[0];
    const allProgress = await this.db!.getAll('progress');
    return allProgress.filter(p => p.due <= today && p.status !== 'mastered');
  }

  async getAllProgress(): Promise<Progress[]> {
    if (!this.db) await this.init();
    return await this.db!.getAll('progress');
  }

  // 设置相关操作
  async getSettings(): Promise<Settings> {
    if (!this.db) await this.init();
    const settings = await this.db!.get('settings', 'user-preferences');
    return settings || {
      showPinyin: true,
      autoPlay: true,
      traceLevel: 'medium',
      theme: 'light'
    };
  }

  async saveSettings(settings: Settings): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.put('settings', { key: 'user-preferences', ...settings });
  }

  // 数据初始化
  async initializeData(): Promise<void> {
    try {
      const existingChars = await this.loadCharacters();
      if (existingChars.length === 0) {
        // 从public/data/chars.json加载数据
        const response = await fetch('/data/chars.json');
        const characters: Character[] = await response.json();
        await this.saveCharacters(characters);
        
        // 初始化进度数据
        const today = new Date().toISOString().split('T')[0];
        const progressData: Progress[] = characters.map(char => ({
          char: char.char,
          status: 'new',
          due: today,
          ease: 2.5,
          interval: 1,
          lastAt: '',
          step: 0
        }));
        
        const tx = this.db!.transaction('progress', 'readwrite');
        await Promise.all(progressData.map(progress => tx.store.put(progress)));
        await tx.done;
      }
    } catch (error) {
      console.error('Failed to initialize data:', error);
    }
  }
}

export const dbService = new DatabaseService();
