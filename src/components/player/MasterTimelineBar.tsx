import React, { useRef } from 'react';
import { StoryChapter, Clue, EngineSettings } from '../../types/story';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Subtitles,
  Maximize2,
  Minimize2,
  Sparkles,
  Layers,
} from 'lucide-react';

interface MasterTimelineBarProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  chapters: StoryChapter[];
  clues: Clue[];
  discoveredClueIds: string[];
  settings: EngineSettings;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onRestart: () => void;
  onUpdateSettings: (settings: Partial<EngineSettings>) => void;
  onOpenEvidence: () => void;
  onInspectClue: (clueId: string) => void;
}

export const MasterTimelineBar: React.FC<MasterTimelineBarProps> = ({
  currentTime,
  duration,
  isPlaying,
  chapters,
  clues,
  discoveredClueIds,
  settings,
  onTogglePlay,
  onSeek,
  onRestart,
  onUpdateSettings,
  onOpenEvidence,
  onInspectClue,
}) => {
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * duration);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-cinema-surface/95 border-t border-cinema-border/90 px-4 md:px-6 py-3.5 backdrop-blur-xl shadow-2xl flex flex-col gap-2.5 z-30">
      {/* 1. Timeline Progress Bar Track */}
      <div
        ref={progressBarRef}
        onClick={handleSeekClick}
        data-testid="timeline-progress-bar"
        className="relative w-full h-3 bg-slate-900/90 rounded-full cursor-pointer group hover:h-4 transition-all duration-200 border border-cinema-border overflow-visible"
      >
        {/* Chapter Division Marks */}
        {chapters.map((ch) => {
          const leftPercent = (ch.startTime / duration) * 100;
          return (
            <div
              key={ch.id}
              style={{ left: `${leftPercent}%` }}
              className="absolute top-0 bottom-0 w-px bg-slate-700/60 z-10 pointer-events-none"
              title={`${ch.title} (${formatTime(ch.startTime)})`}
            />
          );
        })}

        {/* Elapsed Progress Fill */}
        <div
          style={{ width: `${progressPercent}%` }}
          className="h-full bg-gradient-to-r from-gold-dark via-gold to-gold-light rounded-full relative shadow-[0_0_12px_rgba(245,158,11,0.5)]"
        >
          {/* Scrubber Playhead Handle */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-gold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-1/2" />
        </div>

        {/* Clue Hotspot Timeline Pins */}
        {clues.map((clue) => {
          const clueLeft = (clue.appearsAt / duration) * 100;
          const isDiscovered = discoveredClueIds.includes(clue.id);

          return (
            <button
              key={clue.id}
              style={{ left: `${clueLeft}%` }}
              onClick={(e) => {
                e.stopPropagation();
                onSeek(clue.appearsAt);
                onInspectClue(clue.id);
              }}
              data-testid={`timeline-clue-marker-${clue.id}`}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 group/clue focus:outline-none"
              title={`Clue: ${clue.title} (${isDiscovered ? 'Discovered' : 'Undiscovered'})`}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full border transition-transform duration-200 group-hover/clue:scale-150 ${
                  isDiscovered
                    ? 'bg-cyan-400 border-white shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                    : 'bg-gold border-amber-950 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                }`}
              />

              {/* Pin Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/clue:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                <div className="bg-slate-900 border border-gold/40 text-[10px] font-mono text-slate-200 px-2 py-1 rounded shadow-xl">
                  <span className={isDiscovered ? 'text-cyan-400' : 'text-gold'}>
                    ● {clue.title}
                  </span>
                  <span className="text-slate-400 ml-1.5">[{formatTime(clue.appearsAt)}]</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. Controls Toolbar */}
      <div className="flex items-center justify-between text-slate-300">
        {/* Left: Playback Controls & Timecode */}
        <div className="flex items-center gap-3">
          <button
            onClick={onTogglePlay}
            data-testid="play-pause-btn"
            className="w-10 h-10 rounded-lg bg-gold/10 hover:bg-gold/20 text-gold-light border border-gold/40 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={onRestart}
            data-testid="restart-timeline-btn"
            className="w-9 h-9 rounded-lg bg-cinema-panel hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-cinema-border flex items-center justify-center transition-colors"
            title="Restart Timeline"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Timecode display */}
          <div className="flex items-center gap-1.5 font-mono text-xs md:text-sm bg-black/40 px-3 py-1.5 rounded border border-cinema-border">
            <span className="text-gold-light font-bold">{formatTime(currentTime)}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{formatTime(duration)}</span>
          </div>

          {/* Chapter indicator */}
          <div className="hidden xl:flex items-center gap-2 text-xs text-slate-400 font-sans pl-2 border-l border-cinema-border">
            {chapters.find((ch) => currentTime >= ch.startTime && currentTime <= ch.endTime)?.title || 'Master Timeline'}
          </div>
        </div>

        {/* Center: Clue Progress Pill & Evidence Board Quick Link */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenEvidence}
            data-testid="nav-evidence-board-btn"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cinema-panel hover:bg-slate-800 border border-cinema-border hover:border-gold/50 text-xs font-mono transition-all text-slate-200 group"
          >
            <Layers className="w-4 h-4 text-gold group-hover:rotate-12 transition-transform" />
            <span>Evidence Board</span>
            <span className="px-1.5 py-0.2 bg-gold/20 text-gold-light text-[10px] rounded font-bold">
              {discoveredClueIds.length}/{clues.length}
            </span>
          </button>
        </div>

        {/* Right: Audio, Subtitles, Screen options */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mute toggle */}
          <button
            onClick={() => onUpdateSettings({ isMuted: !settings.isMuted })}
            className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-colors ${
              settings.isMuted
                ? 'bg-rose-950/40 border-rose-800 text-rose-300'
                : 'bg-cinema-panel hover:bg-slate-800 border-cinema-border text-slate-300'
            }`}
            title={settings.isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {settings.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Subtitles toggle */}
          <button
            onClick={() => onUpdateSettings({ subtitlesEnabled: !settings.subtitlesEnabled })}
            className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-colors ${
              settings.subtitlesEnabled
                ? 'bg-gold/20 border-gold/50 text-gold-light'
                : 'bg-cinema-panel hover:bg-slate-800 border-cinema-border text-slate-500'
            }`}
            title="Toggle Subtitles"
          >
            <Subtitles className="w-4 h-4" />
          </button>

          {/* Film Grain toggle */}
          <button
            onClick={() => onUpdateSettings({ filmGrainEnabled: !settings.filmGrainEnabled })}
            className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-colors ${
              settings.filmGrainEnabled
                ? 'bg-sky-950/40 border-sky-600 text-sky-300'
                : 'bg-cinema-panel hover:bg-slate-800 border-cinema-border text-slate-500'
            }`}
            title="Toggle 35mm Film Grain Simulation"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Letterbox Bars toggle */}
          <button
            onClick={() => onUpdateSettings({ cinematicBars: !settings.cinematicBars })}
            className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-colors ${
              settings.cinematicBars
                ? 'bg-gold/20 border-gold/50 text-gold-light'
                : 'bg-cinema-panel hover:bg-slate-800 border-cinema-border text-slate-500'
            }`}
            title="Toggle 2.39:1 Anamorphic Letterbox Bars"
          >
            {settings.cinematicBars ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

