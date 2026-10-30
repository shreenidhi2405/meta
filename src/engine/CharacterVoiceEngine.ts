import { DialogueCue, PerspectiveId } from '../types/story';

export class CharacterVoiceEngine {
  private voices: SpeechSynthesisVoice[] = [];
  private currentSpeakingId: string | null = null;
  private isUnlocked: boolean = false;
  private volume: number = 1.0;
  private isMuted: boolean = false;
  private isVoiceEnabled: boolean = true;

  constructor() {
    this.initVoices();
  }

  private initVoices(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const populate = () => {
      this.voices = window.speechSynthesis.getVoices();
    };

    populate();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = populate;
    }
  }

  public unlock(): void {
    if (this.isUnlocked || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.isUnlocked = true;

    try {
      // Resume in case speech was paused by browser policy
      window.speechSynthesis.resume();

      // Silent wake utterance
      const wakeUtterance = new SpeechSynthesisUtterance('');
      wakeUtterance.volume = 0.01;
      wakeUtterance.rate = 2.0;
      window.speechSynthesis.speak(wakeUtterance);
    } catch {
      // Ignore initial touch errors
    }
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  public setVoiceEnabled(enabled: boolean): void {
    this.isVoiceEnabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  public getIsVoiceEnabled(): boolean {
    return this.isVoiceEnabled;
  }

  public stop(): void {
    this.currentSpeakingId = null;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Fallback
      }
    }
  }

  public speakDialogue(dialogue: DialogueCue, force: boolean = false): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (!this.isVoiceEnabled || this.isMuted || this.volume <= 0) return;

    // Avoid duplicate triggers unless forced
    if (this.currentSpeakingId === dialogue.id && !force) return;

    this.unlock();
    this.stop(); // Stop any currently speaking line

    this.currentSpeakingId = dialogue.id;

    // Pick suitable character voice and settings
    const config = this.getVoiceConfigForPerspective(dialogue.perspectiveId);

    const utterance = new SpeechSynthesisUtterance(dialogue.text);
    utterance.volume = this.volume;
    utterance.rate = config.rate;
    utterance.pitch = config.pitch;

    if (config.voice) {
      utterance.voice = config.voice;
    }

    utterance.onend = () => {
      if (this.currentSpeakingId === dialogue.id) {
        this.currentSpeakingId = null;
      }
    };

    utterance.onerror = () => {
      this.currentSpeakingId = null;
    };

    try {
      window.speechSynthesis.speak(utterance);
      // Chrome workaround: resume to ensure speech starts immediately
      window.speechSynthesis.resume();
    } catch (err) {
      console.warn('Speech synthesis playback error:', err);
      this.currentSpeakingId = null;
    }
  }

  public getCurrentSpeakingId(): string | null {
    return this.currentSpeakingId;
  }

  private getVoiceConfigForPerspective(perspectiveId: PerspectiveId): {
    voice: SpeechSynthesisVoice | null;
    pitch: number;
    rate: number;
  } {
    const allVoices = this.voices.length > 0 ? this.voices : (typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : []);
    const englishVoices = allVoices.filter(v => v.lang.startsWith('en'));
    const pool = englishVoices.length > 0 ? englishVoices : allVoices;

    if (perspectiveId === 'witness') {
      // Marcus Ward: deep, mature male voice, tense
      const maleVoice = pool.find(v => 
        /david|mark|guy|james|george|male|daniel/i.test(v.name)
      ) || pool.find(v => !/female|zira|samantha|victoria|jenny/i.test(v.name)) || null;

      return {
        voice: maleVoice,
        pitch: 0.88,
        rate: 1.0,
      };
    } else if (perspectiveId === 'suspect') {
      // Julian Mercer: urgent, breathless male voice, slightly higher pitch for adrenaline
      const alternateMaleVoice = pool.find(v => 
        /george|daniel|richard|james|male/i.test(v.name)
      ) || pool[0] || null;

      return {
        voice: alternateMaleVoice,
        pitch: 1.15,
        rate: 1.08,
      };
    } else {
      // Elena Vance: poised, cold, calculated female voice
      const femaleVoice = pool.find(v => 
        /zira|samantha|victoria|jenny|female|karen/i.test(v.name)
      ) || pool.find(v => /female/i.test(v.name)) || pool[0] || null;

      return {
        voice: femaleVoice,
        pitch: 0.96,
        rate: 0.95,
      };
    }
  }
}
