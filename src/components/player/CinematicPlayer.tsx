import React from 'react';
import { useStory } from '../../engine/StoryContext';
import { CinematicCanvasRenderer } from './CinematicCanvasRenderer';
import { PerspectiveSwitcher } from './PerspectiveSwitcher';
import { MasterTimelineBar } from './MasterTimelineBar';
import { ClueHotspotOverlay } from './ClueHotspotOverlay';
import { SubtitleOverlay } from './SubtitleOverlay';
import { ClueDetailModal } from '../evidence/ClueDetailModal';
import { Settings, Info, Film, ArrowLeft } from 'lucide-react';

export const CinematicPlayer: React.FC = () => {
  const {
    config,
    state,
    play,
    togglePlay,
    seek,
    switchPerspective,
    discoverClue,
    inspectClue,
    updateSettings,
    restartExperience,
    setCurrentPage,
    setIsSettingsOpen,
    setIsCreditsOpen,
  } = useStory();

  const {
    currentTime,
    duration,
    isPlaying,
    activePerspective,
    discoveredClueIds,
    inspectingClueId,
    settings,
    activeDialogue,
    visibleClues,
  } = state;

  const currentClue = config.clues.find((c) => c.id === inspectingClueId) || null;

  return (
    <div className="relative w-screen h-screen bg-cinema-bg text-slate-100 flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* 1. Cinematic Top Navigation Bar */}
      <header className="relative z-30 bg-cinema-surface/85 border-b border-cinema-border/90 px-4 md:px-6 py-2.5 backdrop-blur-md flex items-center justify-between gap-4 shadow-xl">
        {/* Left: Branding & Case Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('stories')}
            data-testid="player-back-to-stories-btn"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cinema-panel hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-colors border border-cinema-border"
            title="Return to Story Archives"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cases</span>
          </button>

          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-gold" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold bg-amber-950/40 border border-gold/30 px-1.5 py-0.2 rounded">
                  Director's Cut
                </span>
                <span className="text-xs font-cinematic font-bold text-slate-200 tracking-wide">
                  {config.title}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Perspective Switcher Dock */}
        <div className="flex-1 flex justify-center max-w-2xl">
          <PerspectiveSwitcher
            perspectives={config.perspectives}
            activePerspective={activePerspective}
            onSelectPerspective={switchPerspective}
          />
        </div>

        {/* Right: Settings & Info Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            data-testid="open-settings-btn"
            className="w-9 h-9 rounded-lg bg-cinema-panel hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-cinema-border flex items-center justify-center transition-colors"
            title="Settings & Audio Sliders"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsCreditsOpen(true)}
            data-testid="open-credits-btn"
            className="w-9 h-9 rounded-lg bg-cinema-panel hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-cinema-border flex items-center justify-center transition-colors"
            title="Film Credits & Director Statement"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Main Immersive Cinema Viewport */}
      <main
        className="relative flex-1 bg-black overflow-hidden flex items-center justify-center cursor-pointer"
        onClick={() => togglePlay()}
        data-testid="cinematic-viewport"
      >
        {/* Anamorphic 2.39:1 Letterbox Bars */}
        {settings.cinematicBars && (
          <>
            <div className="absolute top-0 left-0 right-0 h-10 md:h-14 bg-black z-20 pointer-events-none border-b border-white/5 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 right-0 h-10 md:h-14 bg-black z-20 pointer-events-none border-t border-white/5 transition-all duration-500" />
          </>
        )}

        {/* Procedural Canvas / Video Scene Renderer */}
        <div className="relative w-full h-full flex items-center justify-center">
          <CinematicCanvasRenderer
            perspectiveId={activePerspective}
            currentTime={currentTime}
            duration={duration}
            isPlaying={isPlaying}
            filmGrainEnabled={settings.filmGrainEnabled}
          />

          {/* Interactive Clue Hotspot Radar Overlay */}
          <ClueHotspotOverlay
            visibleClues={visibleClues}
            discoveredClueIds={discoveredClueIds}
            onClueClick={(clueId) => discoverClue(clueId)}
          />

          {/* Cinematic Subtitles */}
          <SubtitleOverlay
            dialogue={activeDialogue}
            enabled={settings.subtitlesEnabled}
            activePerspective={activePerspective}
          />
        </div>
      </main>

      {/* 3. Bottom Master Timeline Controls */}
      <MasterTimelineBar
        currentTime={currentTime}
        duration={duration}
        isPlaying={isPlaying}
        chapters={config.chapters}
        clues={config.clues}
        discoveredClueIds={discoveredClueIds}
        settings={settings}
        onTogglePlay={togglePlay}
        onSeek={seek}
        onRestart={() => restartExperience(true)}
        onUpdateSettings={updateSettings}
        onOpenEvidence={() => setCurrentPage('evidence')}
        onInspectClue={(clueId) => inspectClue(clueId)}
      />

      {/* 4. Clue Inspection Modal */}
      {inspectingClueId && (
        <ClueDetailModal
          clue={currentClue}
          onClose={() => inspectClue(null)}
          onResume={() => {
            inspectClue(null);
            play();
          }}
          onJumpToTimestamp={(ts) => seek(ts)}
        />
      )}
    </div>
  );
};
