import { 
  StoryConfig, 
  StoryEngineState, 
  StoryEngineEvent, 
  StoryEngineListener, 
  PerspectiveId, 
  VerdictType, 
  EngineSettings, 
  StoryChapter 
} from '../types/story';
import { TimelineManager } from './TimelineManager';
import { AudioSynthesizer } from './AudioSynthesizer';

const STORAGE_KEY_PREFIX = 'directors_cut_v1_';

export class StoryEngine {
  private config: StoryConfig;
  private timeline: TimelineManager;
  private audio: AudioSynthesizer;
  private listeners: Set<StoryEngineListener> = new Set();
  
  private state: StoryEngineState;

  constructor(config: StoryConfig) {
    this.config = config;
    this.timeline = new TimelineManager(config.duration, 0);
    this.audio = new AudioSynthesizer();

    const savedState = this.loadSavedState();

    this.state = {
      currentTime: 0,
      duration: config.duration,
      isPlaying: false,
      activePerspective: savedState?.activePerspective || 'witness',
      discoveredClueIds: savedState?.discoveredClueIds || [],
      inspectingClueId: null,
      selectedVerdict: savedState?.selectedVerdict || null,
      settings: savedState?.settings || {
        volume: 0.8,
        isMuted: false,
        subtitlesEnabled: true,
        filmGrainEnabled: true,
        cinematicBars: true,
        playbackRate: 1.0,
        audioMode: 'immersive',
      },
      activeChapter: this.resolveChapter(0),
      isCompleted: savedState?.selectedVerdict !== null,
      activeDialogue: null,
      visibleClues: [],
    };

    this.setupTimelineListeners();
    this.updateDerivedStates(0);
  }

  // --- Persistence ---

  private getStorageKey(): string {
    return `${STORAGE_KEY_PREFIX}${this.config.id}`;
  }

  private loadSavedState(): Partial<StoryEngineState> | null {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    try {
      const data = localStorage.getItem(this.getStorageKey());
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to load saved state from localStorage', e);
    }
    return null;
  }

  private persistState(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const toSave = {
        activePerspective: this.state.activePerspective,
        discoveredClueIds: this.state.discoveredClueIds,
        selectedVerdict: this.state.selectedVerdict,
        settings: this.state.settings,
      };
      localStorage.setItem(this.getStorageKey(), JSON.stringify(toSave));
    } catch (e) {
      console.warn('Failed to persist state to localStorage', e);
    }
  }

  // --- Setup & Internal Loops ---

  private setupTimelineListeners(): void {
    this.timeline.subscribeTick((currentTime) => {
      this.state.currentTime = currentTime;
      this.updateDerivedStates(currentTime);
      this.notifyListeners({ type: 'TIME_UPDATE', time: currentTime });
    });

    this.timeline.subscribeCompletion(() => {
      this.state.isPlaying = false;
      this.state.isCompleted = true;
      this.notifyListeners({ type: 'PAUSE' });
    });
  }

  private updateDerivedStates(currentTime: number): void {
    // 1. Chapter update
    const currentChapter = this.resolveChapter(currentTime);
    if (currentChapter?.id !== this.state.activeChapter?.id) {
      this.state.activeChapter = currentChapter;
      if (currentChapter) {
        this.notifyListeners({ type: 'CHAPTER_CHANGE', chapter: currentChapter });
      }
    }

    // 2. Active dialogue for current perspective
    const activeDialogue = this.config.dialogues.find(
      (dia) =>
        dia.perspectiveId === this.state.activePerspective &&
        currentTime >= dia.startTime &&
        currentTime <= dia.endTime
    ) || null;
    this.state.activeDialogue = activeDialogue;

    // 3. Visible clues at this moment for active perspective
    const visibleClues = this.config.clues.filter(
      (clue) =>
        clue.perspectiveId === this.state.activePerspective &&
        currentTime >= clue.appearsAt &&
        currentTime <= clue.disappearsAt
    );
    this.state.visibleClues = visibleClues;

    // Check for heartbeats during intense acts
    if (this.state.isPlaying && currentTime >= 35 && currentTime <= 55) {
      if (Math.floor(currentTime * 2) % 2 === 0 && Math.abs(currentTime % 1) < 0.08) {
        this.audio.playHeartbeatThump(Math.min(1.0, (currentTime - 30) / 20));
      }
    }
  }

  private resolveChapter(time: number): StoryChapter | null {
    return this.config.chapters.find((ch) => time >= ch.startTime && time < ch.endTime) ||
      this.config.chapters[this.config.chapters.length - 1] ||
      null;
  }

  // --- Public Story Engine Controls ---

  public play(): void {
    this.audio.resumeContext();
    this.timeline.play();
    this.state.isPlaying = true;
    this.notifyListeners({ type: 'PLAY' });
  }

  public pause(): void {
    this.timeline.pause();
    this.state.isPlaying = false;
    this.notifyListeners({ type: 'PAUSE' });
  }

  public togglePlay(): boolean {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.state.isPlaying;
  }

  public seek(time: number): void {
    this.timeline.seek(time);
    this.state.currentTime = this.timeline.getCurrentTime();
    this.updateDerivedStates(this.state.currentTime);
    this.notifyListeners({ type: 'SEEK', time: this.state.currentTime });
  }

  /**
   * Switches perspective while strictly preserving story position
   * and smoothly crossfading/updating audio without duplicate media.
   */
  public switchPerspective(newPerspective: PerspectiveId): void {
    if (this.state.activePerspective === newPerspective) return;

    this.state.activePerspective = newPerspective;
    this.audio.updatePerspective(newPerspective);
    this.updateDerivedStates(this.state.currentTime);
    this.persistState();

    this.notifyListeners({ type: 'PERSPECTIVE_CHANGE', perspective: newPerspective });
  }

  /**
   * Discovers a clue, automatically pauses the cinematic timeline,
   * adds to collected evidence, triggers audio chime, and opens inspect modal.
   */
  public discoverClue(clueId: string): void {
    const clue = this.config.clues.find((c) => c.id === clueId);
    if (!clue) return;

    // Pause playback on discovery
    this.pause();

    if (!this.state.discoveredClueIds.includes(clueId)) {
      this.state.discoveredClueIds = [...this.state.discoveredClueIds, clueId];
      this.audio.playClueDiscoveryChime();
    }

    this.state.inspectingClueId = clueId;
    this.persistState();

    this.notifyListeners({ type: 'CLUE_DISCOVERED', clueId });
    this.notifyListeners({ type: 'CLUE_INSPECT', clueId });
  }

  public inspectClue(clueId: string | null): void {
    this.state.inspectingClueId = clueId;
    if (clueId) {
      this.pause();
    }
    this.notifyListeners({ type: 'CLUE_INSPECT', clueId });
  }

  public selectVerdict(verdict: VerdictType): void {
    this.pause();
    this.state.selectedVerdict = verdict;
    this.state.isCompleted = true;
    this.persistState();
    this.notifyListeners({ type: 'VERDICT_SELECT', verdict });
  }

  public updateSettings(settingsPatch: Partial<EngineSettings>): void {
    this.state.settings = { ...this.state.settings, ...settingsPatch };

    if (settingsPatch.volume !== undefined) {
      this.audio.setVolume(settingsPatch.volume);
    }
    if (settingsPatch.isMuted !== undefined) {
      this.audio.setMuted(settingsPatch.isMuted);
    }
    if (settingsPatch.playbackRate !== undefined) {
      this.timeline.setPlaybackRate(settingsPatch.playbackRate);
    }

    this.persistState();
    this.notifyListeners({ type: 'SETTINGS_UPDATE', settings: settingsPatch });
  }

  public restartExperience(preserveClues: boolean = true): void {
    this.pause();
    this.seek(0);
    this.state.inspectingClueId = null;
    this.state.selectedVerdict = null;
    this.state.isCompleted = false;

    if (!preserveClues) {
      this.state.discoveredClueIds = [];
    }

    this.persistState();
    this.notifyListeners({ type: 'RESET_EXPERIENCE' });
  }

  // --- Subscriptions & State Query ---

  public getState(): StoryEngineState {
    return { ...this.state };
  }

  public getConfig(): StoryConfig {
    return this.config;
  }

  public getAudioSynthesizer(): AudioSynthesizer {
    return this.audio;
  }

  public subscribe(listener: StoryEngineListener): () => void {
    this.listeners.add(listener);
    // Provide initial state snapshot
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(event: StoryEngineEvent): void {
    const currentState = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(currentState, event);
      } catch (err) {
        console.error('Error executing StoryEngine listener:', err);
      }
    });
  }

  public destroy(): void {
    this.timeline.destroy();
    this.audio.destroy();
    this.listeners.clear();
  }
}
