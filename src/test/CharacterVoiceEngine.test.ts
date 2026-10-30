import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CharacterVoiceEngine } from '../engine/CharacterVoiceEngine';
import { DialogueCue } from '../types/story';

describe('CharacterVoiceEngine - Spoken Character Audio', () => {
  let voiceEngine: CharacterVoiceEngine;

  beforeEach(() => {
    vi.clearAllMocks();
    voiceEngine = new CharacterVoiceEngine();
  });

  it('initializes with speech enabled and full volume', () => {
    expect(voiceEngine.getIsVoiceEnabled()).toBe(true);
    expect(voiceEngine.getCurrentSpeakingId()).toBeNull();
  });

  it('speaks dialogue cue and triggers window.speechSynthesis.speak', () => {
    const cue: DialogueCue = {
      id: 'dia-1',
      perspectiveId: 'witness',
      speaker: 'Marcus Ward',
      text: '11:41 PM. I saw him back her right up against the edge.',
      startTime: 4,
      endTime: 12,
      emotionalTone: 'anxious',
    };

    voiceEngine.speakDialogue(cue);

    expect(window.speechSynthesis.speak).toHaveBeenCalled();
    expect(voiceEngine.getCurrentSpeakingId()).toBe('dia-1');
  });

  it('stops dialogue and cancels speech when stop() is called', () => {
    const cue: DialogueCue = {
      id: 'dia-2',
      perspectiveId: 'suspect',
      speaker: 'Julian Mercer',
      text: 'Elena, step back from the ledge!',
      startTime: 4,
      endTime: 13,
      emotionalTone: 'panicked',
    };

    voiceEngine.speakDialogue(cue);
    voiceEngine.stop();

    expect(window.speechSynthesis.cancel).toHaveBeenCalled();
    expect(voiceEngine.getCurrentSpeakingId()).toBeNull();
  });

  it('does not speak when voice is disabled or muted', () => {
    voiceEngine.setMuted(true);

    const cue: DialogueCue = {
      id: 'dia-3',
      perspectiveId: 'victim',
      speaker: 'Elena Vance',
      text: 'He thought I was bluffing.',
      startTime: 4,
      endTime: 14,
      emotionalTone: 'calculating',
    };

    voiceEngine.speakDialogue(cue);
    expect(voiceEngine.getCurrentSpeakingId()).toBeNull();
  });
});
