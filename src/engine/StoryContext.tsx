import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { StoryEngine } from './StoryEngine';
import { canonicalStory } from '../data/caseArchives';
import { StoryEngineState, StoryConfig, PerspectiveId, VerdictType, EngineSettings } from '../types/story';

export type AppPage = 'landing' | 'stories' | 'player' | 'evidence' | 'decision' | 'ending';

interface StoryContextValue {
  engine: StoryEngine;
  state: StoryEngineState;
  config: StoryConfig;
  currentPage: AppPage;
  setCurrentPage: (page: AppPage) => void;
  // Controls
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  switchPerspective: (perspective: PerspectiveId) => void;
  discoverClue: (clueId: string) => void;
  inspectClue: (clueId: string | null) => void;
  selectVerdict: (verdict: VerdictType) => void;
  updateSettings: (settings: Partial<EngineSettings>) => void;
  restartExperience: (preserveClues?: boolean) => void;
  // Modal states
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isCreditsOpen: boolean;
  setIsCreditsOpen: (open: boolean) => void;
}

const StoryContext = createContext<StoryContextValue | null>(null);

export const StoryProvider: React.FC<{ children: React.ReactNode; initialConfig?: StoryConfig }> = ({
  children,
  initialConfig = canonicalStory,
}) => {
  const engine = useMemo(() => new StoryEngine(initialConfig), [initialConfig]);
  const [state, setState] = useState<StoryEngineState>(() => engine.getState());
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = engine.subscribe((newState) => {
      setState(newState);
    });

    return () => {
      unsubscribe();
      engine.destroy();
    };
  }, [engine]);

  // Keyboard shortcut listener for cinema commands:
  // Space: play/pause, 1: witness, 2: suspect, 3: victim, E: evidence board, Escape: close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space' && currentPage === 'player') {
        e.preventDefault();
        engine.togglePlay();
      } else if (e.key === '1' && currentPage === 'player') {
        e.preventDefault();
        engine.switchPerspective('witness');
      } else if (e.key === '2' && currentPage === 'player') {
        e.preventDefault();
        engine.switchPerspective('suspect');
      } else if (e.key === '3' && currentPage === 'player') {
        e.preventDefault();
        engine.switchPerspective('victim');
      } else if ((e.key === 'e' || e.key === 'E') && (currentPage === 'player' || currentPage === 'evidence')) {
        e.preventDefault();
        setCurrentPage(currentPage === 'player' ? 'evidence' : 'player');
      } else if (e.key === 'Escape') {
        if (state.inspectingClueId) {
          engine.inspectClue(null);
        } else if (isSettingsOpen) {
          setIsSettingsOpen(false);
        } else if (isCreditsOpen) {
          setIsCreditsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [engine, currentPage, state.inspectingClueId, isSettingsOpen, isCreditsOpen]);

  const play = useCallback(() => engine.play(), [engine]);
  const pause = useCallback(() => engine.pause(), [engine]);
  const togglePlay = useCallback(() => engine.togglePlay(), [engine]);
  const seek = useCallback((time: number) => engine.seek(time), [engine]);
  const switchPerspective = useCallback((p: PerspectiveId) => engine.switchPerspective(p), [engine]);
  const discoverClue = useCallback((id: string) => engine.discoverClue(id), [engine]);
  const inspectClue = useCallback((id: string | null) => engine.inspectClue(id), [engine]);
  const selectVerdict = useCallback((v: VerdictType) => {
    engine.selectVerdict(v);
    setCurrentPage('ending');
  }, [engine]);
  const updateSettings = useCallback((s: Partial<EngineSettings>) => engine.updateSettings(s), [engine]);
  const restartExperience = useCallback((preserve = true) => {
    engine.restartExperience(preserve);
    setCurrentPage('player');
  }, [engine]);

  const value = useMemo<StoryContextValue>(
    () => ({
      engine,
      state,
      config: engine.getConfig(),
      currentPage,
      setCurrentPage,
      play,
      pause,
      togglePlay,
      seek,
      switchPerspective,
      discoverClue,
      inspectClue,
      selectVerdict,
      updateSettings,
      restartExperience,
      isSettingsOpen,
      setIsSettingsOpen,
      isCreditsOpen,
      setIsCreditsOpen,
    }),
    [
      engine,
      state,
      currentPage,
      play,
      pause,
      togglePlay,
      seek,
      switchPerspective,
      discoverClue,
      inspectClue,
      selectVerdict,
      updateSettings,
      restartExperience,
      isSettingsOpen,
      isCreditsOpen,
    ]
  );

  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
};

export const useStory = (): StoryContextValue => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};
