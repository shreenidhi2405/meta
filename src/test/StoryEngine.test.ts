import { describe, it, expect, beforeEach } from 'vitest';
import { StoryEngine } from '../engine/StoryEngine';
import { canonicalStory } from '../data/caseArchives';

describe('StoryEngine - Decoupled Storytelling State Machine', () => {
  let engine: StoryEngine;

  beforeEach(() => {
    localStorage.clear();
    engine = new StoryEngine(canonicalStory);
  });

  it('initializes with canonical story configuration', () => {
    const state = engine.getState();
    expect(state.duration).toBe(90);
    expect(state.currentTime).toBe(0);
    expect(state.isPlaying).toBe(false);
    expect(state.activePerspective).toBe('witness');
    expect(state.discoveredClueIds).toEqual([]);
    expect(state.selectedVerdict).toBeNull();
  });

  it('switches perspective while preserving exact current story timestamp', () => {
    engine.seek(38.4);
    expect(engine.getState().currentTime).toBe(38.4);

    // Switch to suspect
    engine.switchPerspective('suspect');
    expect(engine.getState().activePerspective).toBe('suspect');
    expect(engine.getState().currentTime).toBe(38.4); // PRESERVED EXACTLY

    // Switch to victim
    engine.switchPerspective('victim');
    expect(engine.getState().activePerspective).toBe('victim');
    expect(engine.getState().currentTime).toBe(38.4); // PRESERVED EXACTLY
  });

  it('correctly resolves active dialogue cue based on perspective and timestamp', () => {
    // At t=8s in witness perspective:
    engine.switchPerspective('witness');
    engine.seek(8);
    expect(engine.getState().activeDialogue?.speaker).toBe('Marcus Ward');

    // At t=8s in suspect perspective:
    engine.switchPerspective('suspect');
    expect(engine.getState().activeDialogue?.speaker).toBe('Julian Mercer');

    // At t=8s in victim perspective:
    engine.switchPerspective('victim');
    expect(engine.getState().activeDialogue?.speaker).toBe('Elena Vance');
  });

  it('shows clue hotspot when timestamp aligns with clue active window', () => {
    // 'clue-tether' appears at 10s to 26s in suspect perspective
    engine.switchPerspective('suspect');
    engine.seek(15);
    const visibleClues = engine.getState().visibleClues;
    expect(visibleClues.some((c) => c.id === 'clue-tether')).toBe(true);

    // Seeking outside active window hides it
    engine.seek(40);
    expect(engine.getState().visibleClues.some((c) => c.id === 'clue-tether')).toBe(false);
  });

  it('discovering a clue automatically pauses playback and stores clue in state', () => {
    engine.play();
    expect(engine.getState().isPlaying).toBe(true);

    engine.discoverClue('clue-tether');

    // Playback must be paused upon clue click
    expect(engine.getState().isPlaying).toBe(false);
    expect(engine.getState().discoveredClueIds).toContain('clue-tether');
    expect(engine.getState().inspectingClueId).toBe('clue-tether');
  });

  it('persists discovered clues and active perspective to LocalStorage', () => {
    engine.switchPerspective('victim');
    engine.discoverClue('clue-recorder');

    // Create a new engine instance simulating reload
    const reloadedEngine = new StoryEngine(canonicalStory);
    const loadedState = reloadedEngine.getState();

    expect(loadedState.activePerspective).toBe('victim');
    expect(loadedState.discoveredClueIds).toContain('clue-recorder');
  });

  it('supports selecting all three final verdicts', () => {
    // 1. Accident
    engine.selectVerdict('accident');
    expect(engine.getState().selectedVerdict).toBe('accident');
    expect(engine.getState().isCompleted).toBe(true);

    // 2. Murder
    engine.selectVerdict('murder');
    expect(engine.getState().selectedVerdict).toBe('murder');

    // 3. Deliberate Manipulation
    engine.selectVerdict('manipulation');
    expect(engine.getState().selectedVerdict).toBe('manipulation');
  });

  it('restarts experience while preserving or resetting discovered evidence', () => {
    engine.discoverClue('clue-tether');
    engine.discoverClue('clue-recorder');
    engine.selectVerdict('accident');

    // Restart preserving clues
    engine.restartExperience(true);
    expect(engine.getState().currentTime).toBe(0);
    expect(engine.getState().selectedVerdict).toBeNull();
    expect(engine.getState().discoveredClueIds.length).toBe(2);

    // Full reset wiping clues
    engine.restartExperience(false);
    expect(engine.getState().discoveredClueIds.length).toBe(0);
  });
});

