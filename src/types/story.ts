export type PerspectiveId = 'witness' | 'suspect' | 'victim';

export type VerdictType = 'accident' | 'murder' | 'manipulation';

export interface HotspotCoordinate {
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  radius?: number;
  label: string;
}

export interface ClueContradiction {
  witness: string;
  suspect: string;
  victim: string;
}

export interface Clue {
  id: string;
  title: string;
  perspectiveId: PerspectiveId;
  appearsAt: number; // seconds
  disappearsAt: number; // seconds
  hotspot: HotspotCoordinate;
  category: 'physical' | 'testimony' | 'digital' | 'forensic';
  description: string;
  detailedAnalysis: string;
  contradictions: ClueContradiction;
  significance: string;
  icon: string;
  thumbnailUrl?: string;
}

export interface DialogueCue {
  id: string;
  perspectiveId: PerspectiveId;
  speaker: string;
  text: string;
  subtext?: string;
  startTime: number;
  endTime: number;
  emotionalTone: 'calm' | 'anxious' | 'panicked' | 'calculating' | 'furious' | 'desperate';
}

export interface PerspectiveVisualTheme {
  primaryColor: string;
  accentColor: string;
  lightingMood: string;
  vignetteIntensity: number;
  gradingFilter: string;
}

export interface Perspective {
  id: PerspectiveId;
  name: string;
  role: string;
  actor: string;
  quote: string;
  cameraDescription: string;
  location: string;
  psychologicalState: string;
  videoSrc?: string;
  posterSrc?: string;
  visualTheme: PerspectiveVisualTheme;
}

export interface StoryChapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  description: string;
}

export interface EpilogueDetail {
  witness: string;
  suspect: string;
  victimAftermath: string;
}

export interface VerdictOption {
  id: VerdictType;
  title: string;
  tagline: string;
  summary: string;
  keyCorroboratingClues: string[];
  cinematicResolutionTitle: string;
  cinematicResolutionText: string;
  epilogue: EpilogueDetail;
  forensicAccuracy: number;
  verdictRationale: string;
}

export interface StoryConfig {
  id: string;
  title: string;
  tagline: string;
  genre: string;
  synopsis: string;
  duration: number; // in seconds (e.g. 90)
  date: string;
  location: string;
  caseNumber: string;
  perspectives: Record<PerspectiveId, Perspective>;
  dialogues: DialogueCue[];
  clues: Clue[];
  chapters: StoryChapter[];
  verdicts: Record<VerdictType, VerdictOption>;
}

export interface EngineSettings {
  volume: number; // 0 - 1
  voiceVolume: number; // 0 - 1
  voiceEnabled: boolean;
  isMuted: boolean;
  subtitlesEnabled: boolean;
  filmGrainEnabled: boolean;
  cinematicBars: boolean;
  playbackRate: number;
  audioMode: 'immersive' | 'dialogue-focus' | 'ambient';
}

export interface StoryEngineState {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  activePerspective: PerspectiveId;
  discoveredClueIds: string[];
  inspectingClueId: string | null;
  selectedVerdict: VerdictType | null;
  settings: EngineSettings;
  activeChapter: StoryChapter | null;
  isCompleted: boolean;
  activeDialogue: DialogueCue | null;
  visibleClues: Clue[];
  isSpeaking: boolean;
}

export type StoryEngineEvent =
  | { type: 'TIME_UPDATE'; time: number }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'SEEK'; time: number }
  | { type: 'PERSPECTIVE_CHANGE'; perspective: PerspectiveId }
  | { type: 'CLUE_DISCOVERED'; clueId: string }
  | { type: 'CLUE_INSPECT'; clueId: string | null }
  | { type: 'VERDICT_SELECT'; verdict: VerdictType }
  | { type: 'SETTINGS_UPDATE'; settings: Partial<EngineSettings> }
  | { type: 'RESET_EXPERIENCE' }
  | { type: 'CHAPTER_CHANGE'; chapter: StoryChapter };

export type StoryEngineListener = (state: StoryEngineState, event?: StoryEngineEvent) => void;

