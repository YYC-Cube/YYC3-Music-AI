import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { PlayMode, localAudioService } from '../services/localAudioService';
import { Song } from '../types/Song';

interface PlayerProps {
  audioPath: string;
  posterPath?: string;
  songs: Song[];
  currentIndex: number;
  onPlayingChange?: (isPlaying: boolean) => void;
  onSongChange?: (song: Song, index: number) => void;
}

export function Player({ audioPath, songs, currentIndex, onPlayingChange, onSongChange }: PlayerProps) {
  const { isMobile, playBtnSize, ctrlBtnSize, iconSize, modeIconSize, gap } = useResponsive();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [autoPlayBlocked, setAutoPlayBlocked] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playMode, setPlayMode] = useState<PlayMode>('sequential');
  const [showVolume, setShowVolume] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const unsubStateRef = useRef<(() => void) | null>(null);
  const unsubEndRef = useRef<(() => void) | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const draggingRef = useRef(false);

  const clearAll = useCallback(() => {
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
    if (unsubStateRef.current) { unsubStateRef.current(); unsubStateRef.current = null; }
    if (unsubEndRef.current) { unsubEndRef.current(); unsubEndRef.current = null; }
  }, []);

  const getNextIndex = useCallback((mode?: PlayMode): number => {
    const m = mode || playMode;
    if (songs.length === 0) return -1;
    switch (m) {
      case 'repeat-one': return currentIndex;
      case 'repeat-all': return (currentIndex + 1) % songs.length;
      case 'shuffle': {
        if (songs.length <= 1) return 0;
        let n = currentIndex;
        while (n === currentIndex) n = Math.floor(Math.random() * songs.length);
        return n;
      }
      default: return currentIndex < songs.length - 1 ? currentIndex + 1 : -1;
    }
  }, [playMode, currentIndex, songs.length]);

  useEffect(() => {
    clearAll();
    setIsReady(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError(null);
    setAutoPlayBlocked(false);

    let dead = false;

    const run = async () => {
      try {
        await localAudioService.loadAudio(audioPath);
        if (dead) return;

        const d = localAudioService.getDuration();
        if (d > 0 && isFinite(d)) setDuration(d);

        tickRef.current = setInterval(() => {
          if (draggingRef.current) return;
          const t = localAudioService.getCurrentTime();
          const d2 = localAudioService.getDuration();
          if (isFinite(t)) setCurrentTime(t);
          if (d2 > 0 && isFinite(d2)) setDuration(d2);
        }, 250);

        unsubStateRef.current = localAudioService.onStateChange((p) => {
          setIsPlaying(p);
          onPlayingChange?.(p);
        });

        unsubEndRef.current = localAudioService.onSongEnd(() => {
          const ni = getNextIndex();
          if (ni >= 0 && songs[ni]) onSongChange?.(songs[ni], ni);
        });

        setIsReady(true);
        setError(null);

        try {
          await localAudioService.play();
          setIsPlaying(true);
          onPlayingChange?.(true);
        } catch {
          setAutoPlayBlocked(true);
          setIsReady(true);
          setError(null);
        }
      } catch (e: any) {
        if (dead) return;
        console.error('加载出错:', e.message);
        setError(e.message || '音频加载失败');
        setIsReady(true);
      }
    };

    run();
    return () => { dead = true; clearAll(); };
  }, [audioPath]);

  const doPlay = async () => {
    if (!isReady) return;
    try {
      const p = await localAudioService.togglePlay();
      setIsPlaying(p);
      onPlayingChange?.(p);
      setError(null);
      setAutoPlayBlocked(false);
    } catch { setError('播放失败'); }
  };

  const doPrev = () => {
    if (currentTime > 3) { localAudioService.seek(0); setCurrentTime(0); return; }
    const i = currentIndex > 0 ? currentIndex - 1 : songs.length - 1;
    if (songs[i]) onSongChange?.(songs[i], i);
  };

  const doNext = () => {
    const i = getNextIndex();
    if (i >= 0 && songs[i]) onSongChange?.(songs[i], i);
  };

  const clickProgress = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration || !progressRef.current) return;
    const r = progressRef.current.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    localAudioService.seek(p * duration);
    setCurrentTime(p * duration);
  };

  const dragStart = (_e: React.MouseEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    const move = (me: MouseEvent) => {
      if (!duration || !progressRef.current) return;
      const r = progressRef.current.getBoundingClientRect();
      setCurrentTime(Math.max(0, Math.min(1, (me.clientX - r.left) / r.width)) * duration);
    };
    const up = (ue: MouseEvent) => {
      draggingRef.current = false;
      if (duration && progressRef.current) {
        const r = progressRef.current.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (ue.clientX - r.left) / r.width));
        localAudioService.seek(p * duration);
        setCurrentTime(p * duration);
      }
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };

  const changeVol = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    localAudioService.setVolume(v);
    if (v > 0 && isMuted) { setIsMuted(false); localAudioService.toggleMute(); }
  };

  const toggleMute = () => { setIsMuted(localAudioService.toggleMute()); };

  const cycleMode = () => { setPlayMode(localAudioService.cyclePlayMode()); };

  const fmt = (t: number) => {
    if (!isFinite(t)) return '0:00';
    return `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
  };

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  const modeIcon = () => {
    switch (playMode) {
      case 'repeat-all': return <RepeatIcon label="A" />;
      case 'repeat-one': return <RepeatIcon label="1" />;
      case 'shuffle': return <ShuffleIcon />;
      default: return <SequentialIcon />;
    }
  };

  const modeLabel = () => {
    const m: Record<PlayMode, string> = { 'repeat-all': '列表循环', 'repeat-one': '单曲循环', shuffle: '随机播放', sequential: '顺序播放' };
    return m[playMode];
  };

  return (
    <div className="flex flex-col items-center gap-3 relative" style={{ zIndex: 100 }}>
      <div className={`w-full ${isMobile ? 'max-w-xs' : 'max-w-sm'} px-4`}>
        <div ref={progressRef} className={`w-full bg-white/10 rounded-full cursor-pointer group relative`} style={{ height: `${isMobile ? 6 : 4}px` }} onClick={clickProgress} onMouseDown={dragStart}>
          <div className="h-full bg-white/70 rounded-full relative transition-[width] duration-100" style={{ width: `${pct}%` }}>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1.5">
          <span>{fmt(currentTime)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-center" style={{ gap: `${gap}px` }}>
        <button onClick={cycleMode} className="flex items-center justify-center text-white/50 hover:text-white/90 transition-all active:scale-90" style={{ width: `${ctrlBtnSize}px`, height: `${ctrlBtnSize}px` }} title={modeLabel()}>
          {modeIcon()}
        </button>

        <button onClick={doPrev} className="flex items-center justify-center text-white/70 hover:text-white transition-all active:scale-90" style={{ width: `${ctrlBtnSize + 4}px`, height: `${ctrlBtnSize + 4}px` }}>
          <PrevIcon s={iconSize} />
        </button>

        <button onClick={doPlay} disabled={!isReady}
          className={`flex items-center justify-center rounded-full bg-white/95 shadow-2xl transition-all hover:bg-white hover:scale-105 active:scale-95 ${!isReady ? 'opacity-40 cursor-not-allowed' : ''}`}
          style={{ width: `${playBtnSize}px`, height: `${playBtnSize}px`, boxShadow: '0 8px 32px rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.3)' }}>
          {!isReady ? <SpinnerIcon s={iconSize} /> : error ? <ErrorIcon s={iconSize} /> : !isPlaying ? <PlayIcon s={iconSize} /> : <PauseIcon s={iconSize} />}
        </button>

        <button onClick={doNext} className="flex items-center justify-center text-white/70 hover:text-white transition-all active:scale-90" style={{ width: `${ctrlBtnSize + 4}px`, height: `${ctrlBtnSize + 4}px` }}>
          <NextIcon s={iconSize} />
        </button>

        <div className="relative">
          <button onClick={() => setShowVolume(!showVolume)} className="flex items-center justify-center text-white/50 hover:text-white/90 transition-all active:scale-90" style={{ width: `${ctrlBtnSize}px`, height: `${ctrlBtnSize}px` }}>
            <VolumeIcon muted={isMuted} vol={volume} s={modeIconSize} />
          </button>
          {showVolume && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md rounded-xl p-3 shadow-2xl border border-white/10">
              <div className="flex flex-col items-center gap-2 h-32">
                <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={changeVol}
                  style={{ writingMode: 'vertical-lr' as any, direction: 'rtl', width: '28px', height: '100px', appearance: 'none', background: `linear-gradient(to top, rgba(255,255,255,0.7) ${volume * 100}%, rgba(255,255,255,0.15) ${volume * 100}%)`, borderRadius: '14px', outline: 'none', cursor: 'pointer' }} />
                <button onClick={toggleMute} className="text-xs text-gray-400 hover:text-white transition-colors">{isMuted ? '取消静音' : '静音'}</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-500 font-light tracking-wide">
        {error ? error : autoPlayBlocked ? '点击播放按钮开始' : !isReady ? '加载中...' : isPlaying ? `${modeLabel()} · 正在播放` : '已暂停'}
      </p>
    </div>
  );
}

const PlayIcon = ({ s = 28 }: { s?: number }) => <svg style={{ width: s, height: s }} className="text-black ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>;
const PauseIcon = ({ s = 28 }: { s?: number }) => <svg style={{ width: s, height: s }} className="text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>;
const PrevIcon = ({ s = 28 }: { s?: number }) => <svg style={{ width: s, height: s }} fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>;
const NextIcon = ({ s = 28 }: { s?: number }) => <svg style={{ width: s, height: s }} fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>;
const SpinnerIcon = ({ s = 28 }: { s?: number }) => <svg style={{ width: s, height: s }} className="text-black animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>;
const ErrorIcon = ({ s = 28 }: { s?: number }) => <svg style={{ width: s, height: s }} className="text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>;

const RepeatIcon = ({ label }: { label: string }) => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M4.5 12c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662" />
    <text x="12" y="15" textAnchor="middle" fontSize="7" fill="currentColor" stroke="none" fontWeight="bold">{label}</text>
  </svg>
);

const ShuffleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
  </svg>
);

const SequentialIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l6-4v16l-6-4v-8zm9 0l6-4v16l-6-4v-8z" />
  </svg>
);

const VolumeIcon = ({ muted, vol, s = 20 }: { muted: boolean; vol: number; s?: number }) => {
  if (muted || vol === 0) return <svg style={{ width: s, height: s }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>;
  return <svg style={{ width: s, height: s }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>;
};
