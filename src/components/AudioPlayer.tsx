import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  autoPlay?: boolean;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  src, 
  autoPlay = false, 
  className = '' 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 支持TTS备选方案
  const playTTS = async (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
        setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
      }
    } catch (error) {
      console.error('TTS playback failed:', error);
    }
  };

  const handlePlay = async () => {
    if (!audioRef.current) return;
    
    setIsLoading(true);
    setHasError(false);
    
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Audio playback failed:', error);
      setHasError(true);
      // 如果音频播放失败，尝试TTS
      const match = src.match(/Zh-(.+)\.ogg/);
      if (match) {
        const pinyin = decodeURIComponent(match[1]);
        await playTTS(pinyin);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (autoPlay && !hasError) {
      handlePlay();
    }
  }, [src, autoPlay]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <audio ref={audioRef} src={src} preload="metadata" />
      
      <button
        onClick={isPlaying ? handlePause : handlePlay}
        disabled={isLoading}
        className="
          inline-flex items-center justify-center w-10 h-10 
          bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400
          text-white rounded-full transition-colors
        "
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4 ml-0.5" />
        )}
      </button>
      
      {hasError && (
        <span className="text-sm text-amber-600 flex items-center gap-1">
          <Volume2 className="w-4 h-4" />
          <span>TTS发音</span>
        </span>
      )}
    </div>
  );
};
