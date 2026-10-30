import { PerspectiveId } from '../types/story';

export class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private rainGain: GainNode | null = null;
  private heartbeatTimer: number | null = null;
  private rainNoiseNode: AudioNode | null = null;
  private isInitialized: boolean = false;
  private currentPerspective: PerspectiveId = 'witness';

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  public init(): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;

      this.ctx = new AudioCtxClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.setupDrone();
      this.setupRain();
      this.isInitialized = true;
    } catch (err) {
      console.warn('AudioContext failed to initialize:', err);
    }
  }

  public resumeContext(): void {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setVolume(volume: number): void {
    if (this.masterGain && this.ctx) {
      const clamped = Math.max(0, Math.min(1, volume));
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : clamped, this.ctx.currentTime, 0.05);
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.7, this.ctx.currentTime, 0.05);
    }
  }

  public updatePerspective(perspective: PerspectiveId): void {
    this.currentPerspective = perspective;
    if (!this.ctx || !this.droneGain || !this.rainGain) return;

    const t = this.ctx.currentTime;
    if (perspective === 'witness') {
      // High rain emphasis, colder tonal drone
      this.rainGain.gain.setTargetAtTime(0.35, t, 0.2);
      this.droneGain.gain.setTargetAtTime(0.2, t, 0.2);
    } else if (perspective === 'suspect') {
      // Intense, heavy drone, muffled rain
      this.rainGain.gain.setTargetAtTime(0.2, t, 0.2);
      this.droneGain.gain.setTargetAtTime(0.4, t, 0.2);
    } else {
      // Victim: surreal ethereal calm, lower rain, resonant drone
      this.rainGain.gain.setTargetAtTime(0.15, t, 0.2);
      this.droneGain.gain.setTargetAtTime(0.3, t, 0.2);
    }

    this.playPerspectiveSwitchSwoosh();
  }

  public playPerspectiveSwitchSwoosh(): void {
    if (!this.ctx || this.isMuted) return;
    this.resumeContext();

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(45, t + 0.35);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, t);
      filter.frequency.exponentialRampToValueAtTime(80, t + 0.35);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.45, t + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(t);
      osc.stop(t + 0.4);
    } catch {
      // Web Audio fallback
    }
  }

  public playClueDiscoveryChime(): void {
    if (!this.ctx || this.isMuted) return;
    this.resumeContext();

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 mystery chord
      const t = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.08);

        gain.gain.setValueAtTime(0.001, t + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, t + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(t + idx * 0.08);
        osc.stop(t + idx * 0.08 + 1.3);
      });
    } catch {
      // Audio fallback
    }
  }

  public playHeartbeatThump(intensity: number = 0.5): void {
    if (!this.ctx || this.isMuted) return;
    this.resumeContext();

    try {
      const t = this.ctx.currentTime;
      // Lub
      this.createThump(t, 65, 0.25 * intensity);
      // Dub
      this.createThump(t + 0.16, 50, 0.35 * intensity);
    } catch {
      // Audio fallback
    }
  }

  private createThump(time: number, freq: number, volume: number): void {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(25, time + 0.12);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(volume, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.14);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(time);
    osc.stop(time + 0.15);
  }

  public triggerThunderClap(): void {
    if (!this.ctx || this.isMuted) return;
    this.resumeContext();

    try {
      const t = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 2.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.7));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, t);
      filter.frequency.linearRampToValueAtTime(60, t + 2.0);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.6, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 2.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      noise.start(t);
      noise.stop(t + 2.5);
    } catch {
      // Audio fallback
    }
  }

  private setupDrone(): void {
    if (!this.ctx || !this.masterGain) return;

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    // Minor triad tension drone (C2 = 65.41Hz, Eb2 = 77.78Hz, G2 = 98Hz)
    const freqs = [65.41, 77.78, 98.0];
    freqs.forEach(freq => {
      const osc = this.ctx!.createOscillator();
      const filter = this.ctx!.createBiquadFilter();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, this.ctx!.currentTime);

      osc.connect(filter);
      filter.connect(this.droneGain!);
      osc.start();
    });

    this.droneGain.connect(this.masterGain);
  }

  private setupRain(): void {
    if (!this.ctx || !this.masterGain) return;

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    // Procedural pinkish noise for continuous rain sound
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
      b6 = white * 0.115926;
    }

    const rainSource = this.ctx.createBufferSource();
    rainSource.buffer = buffer;
    rainSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.6, this.ctx.currentTime);

    rainSource.connect(filter);
    filter.connect(this.rainGain);
    this.rainGain.connect(this.masterGain);

    rainSource.start();
    this.rainNoiseNode = rainSource;
  }

  public getCurrentPerspective(): PerspectiveId {
    return this.currentPerspective;
  }

  public destroy(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.rainNoiseNode) {
      try {
        (this.rainNoiseNode as AudioBufferSourceNode).stop();
      } catch {
        // already stopped
      }
      this.rainNoiseNode = null;
    }
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
    this.isInitialized = false;
  }
}
