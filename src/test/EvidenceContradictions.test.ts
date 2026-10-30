import { describe, it, expect } from 'vitest';
import { canonicalStory } from '../data/caseArchives';

describe('Case Data & Contradiction Matrix Integrity', () => {
  it('contains the canonical story "The Last Witness" with 3 distinct perspectives', () => {
    expect(canonicalStory.title).toBe('The Last Witness');
    expect(canonicalStory.duration).toBe(90);
    expect(Object.keys(canonicalStory.perspectives)).toEqual(['witness', 'suspect', 'victim']);
  });

  it('verifies every clue contains contradictory statements for all 3 characters', () => {
    expect(canonicalStory.clues.length).toBeGreaterThanOrEqual(3);

    canonicalStory.clues.forEach((clue) => {
      expect(clue.contradictions).toBeDefined();
      expect(clue.contradictions.witness.length).toBeGreaterThan(10);
      expect(clue.contradictions.suspect.length).toBeGreaterThan(10);
      expect(clue.contradictions.victim.length).toBeGreaterThan(10);

      // Verify clue timing is valid
      expect(clue.appearsAt).toBeGreaterThanOrEqual(0);
      expect(clue.disappearsAt).toBeGreaterThan(clue.appearsAt);
      expect(clue.disappearsAt).toBeLessThanOrEqual(canonicalStory.duration);

      // Hotspot coordinates must be in percentage bounds [0, 100]
      expect(clue.hotspot.x).toBeGreaterThanOrEqual(0);
      expect(clue.hotspot.x).toBeLessThanOrEqual(100);
      expect(clue.hotspot.y).toBeGreaterThanOrEqual(0);
      expect(clue.hotspot.y).toBeLessThanOrEqual(100);
    });
  });

  it('validates that all three verdict options have full epilogues and corroborating clues', () => {
    const verdictKeys = ['accident', 'murder', 'manipulation'] as const;

    verdictKeys.forEach((key) => {
      const v = canonicalStory.verdicts[key];
      expect(v).toBeDefined();
      expect(v.title).toBeTruthy();
      expect(v.cinematicResolutionTitle).toBeTruthy();
      expect(v.cinematicResolutionText.length).toBeGreaterThan(50);
      expect(v.keyCorroboratingClues.length).toBeGreaterThan(0);

      // Verify each corroborating clue exists in case clues
      v.keyCorroboratingClues.forEach((clueId) => {
        const found = canonicalStory.clues.some((c) => c.id === clueId);
        expect(found).toBe(true);
      });

      // Epilogues must cover all 3 characters
      expect(v.epilogue.witness).toBeTruthy();
      expect(v.epilogue.suspect).toBeTruthy();
      expect(v.epilogue.victimAftermath).toBeTruthy();
    });
  });

  it('verifies chapters span continuous timeline coverage', () => {
    const chapters = canonicalStory.chapters;
    expect(chapters.length).toBeGreaterThanOrEqual(3);

    expect(chapters[0].startTime).toBe(0);
    expect(chapters[chapters.length - 1].endTime).toBe(canonicalStory.duration);

    for (let i = 0; i < chapters.length - 1; i++) {
      expect(chapters[i].endTime).toBe(chapters[i + 1].startTime);
    }
  });
});

