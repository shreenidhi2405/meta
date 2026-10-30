import storyData from './the-last-witness.json';
import { StoryConfig } from '../types/story';

export const canonicalStory: StoryConfig = storyData as unknown as StoryConfig;

export interface CaseArchiveItem {
  id: string;
  title: string;
  tagline: string;
  genre: string;
  status: 'available' | 'locked' | 'coming-soon';
  runtime: string;
  perspectivesCount: number;
  cluesCount: number;
  difficulty: 'Beginner' | 'Investigator' | 'Master Sleuth';
  summary: string;
  releaseYear: string;
  posterBg: string;
  accentColor: string;
  rating: string;
}

export const CASE_ARCHIVES: CaseArchiveItem[] = [
  {
    id: 'the-last-witness',
    title: 'The Last Witness',
    tagline: 'Every perspective tells a different truth.',
    genre: 'Psychological Thriller / Noir',
    status: 'available',
    runtime: '01:30 (Continuous Multi-Track)',
    perspectivesCount: 3,
    cluesCount: 5,
    difficulty: 'Investigator',
    summary: 'A woman falls fourteen floors from a rain-lashed Manhattan penthouse. A telephoto watcher swears he saw a shove; the accused husband insists he reached to save her; the deceased auditor left behind a secret tape that shatters both claims.',
    releaseYear: '2026',
    posterBg: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #030712 100%)',
    accentColor: '#F59E0B',
    rating: 'TV-MA (Psychological Tension)'
  },
  {
    id: 'the-crimson-ledger',
    title: 'The Crimson Ledger',
    tagline: 'In the vault of mirrors, balance is blood.',
    genre: 'Financial Conspiracy / Neo-Noir',
    status: 'coming-soon',
    runtime: '02:15 (Multi-Track)',
    perspectivesCount: 4,
    cluesCount: 8,
    difficulty: 'Master Sleuth',
    summary: 'Inside an underground Zurich bullion repository, a security breach leaves the head archivist poisoned and an impenetrable vault emptied from the inside. Viewpoints include the Senior Auditor, the Safe Technician, and the Vault Guardian.',
    releaseYear: 'Q3 2026',
    posterBg: 'linear-gradient(135deg, #450a0a 0%, #1c1917 60%, #09090b 100%)',
    accentColor: '#EF4444',
    rating: 'TV-MA'
  },
  {
    id: 'echoes-at-midnight',
    title: 'Echoes at Midnight',
    tagline: 'Silence is just noise you haven’t tuned into.',
    genre: 'Subsea Espionage / Sound Thriller',
    status: 'coming-soon',
    runtime: '02:00 (Multi-Track)',
    perspectivesCount: 3,
    cluesCount: 6,
    difficulty: 'Master Sleuth',
    summary: 'An acoustic sensor array detects a submarine hull collision 400 fathoms below the Arctic pack ice. The sonar operator, the commander, and an unlogged passenger describe three completely different sound profiles of the impact.',
    releaseYear: 'Q4 2026',
    posterBg: 'linear-gradient(135deg, #082f49 0%, #0c4a6e 50%, #020617 100%)',
    accentColor: '#06B6D4',
    rating: 'TV-MA'
  }
];

