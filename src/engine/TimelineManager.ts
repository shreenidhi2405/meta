export type TickCallback = (currentTime: number, deltaTime: number) => void;
export type CompletionCallback = () => void;

export class TimelineManager {
  private currentTime: number = 0;
  private duration: number;
  private isPlaying: boolean = false;
  private playbackRate: number = 1.0;
  private lastTimestamp: number = 0;
  private rafId: number | null = null;
  private tickCallbacks: Set<TickCallback> = new Set();
  private completionCallbacks: Set<CompletionCallback> = new Set();

  constructor(duration: number, initialTime: number = 0) {
    this.duration = Math.max(1, duration);
    this.currentTime = Math.min(Math.max(0, initialTime), this.duration);
  }

  public subscribeTick(cb: TickCallback): () => void {
    this.tickCallbacks.add(cb);
    return () => this.tickCallbacks.delete(cb);
  }

  public subscribeCompletion(cb: CompletionCallback): () => void {
    this.completionCallbacks.add(cb);
    return () => this.completionCallbacks.delete(cb);
  }

  public play(): void {
    if (this.isPlaying) return;
    
    // If at or past end, loop or restart to beginning
    if (this.currentTime >= this.duration) {
      this.currentTime = 0;
    }
    
    this.isPlaying = true;
    this.lastTimestamp = (typeof performance !== 'undefined') ? performance.now() : Date.now();
    this.loop();
  }

  public pause(): void {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.rafId !== null) {
      if (typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(this.rafId);
      } else {
        clearTimeout(this.rafId);
      }
      this.rafId = null;
    }
  }

  public togglePlay(): boolean {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  public seek(time: number): number {
    const clamped = Math.min(Math.max(0, time), this.duration);
    const delta = clamped - this.currentTime;
    this.currentTime = clamped;
    this.lastTimestamp = (typeof performance !== 'undefined') ? performance.now() : Date.now();
    
    // Notify listeners of seek position
    this.notifyTick(delta);
    
    if (this.currentTime >= this.duration) {
      this.pause();
      this.notifyCompletion();
    }
    
    return this.currentTime;
  }

  public setPlaybackRate(rate: number): void {
    this.playbackRate = Math.max(0.25, Math.min(4.0, rate));
  }

  public getPlaybackRate(): number {
    return this.playbackRate;
  }

  public getCurrentTime(): number {
    return this.currentTime;
  }

  public getDuration(): number {
    return this.duration;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private loop = (): void => {
    if (!this.isPlaying) return;

    const now = (typeof performance !== 'undefined') ? performance.now() : Date.now();
    const elapsedMs = Math.min(100, Math.max(0, now - this.lastTimestamp)); // cap delta to 100ms to avoid tab switch jumps
    this.lastTimestamp = now;

    const elapsedSeconds = (elapsedMs / 1000) * this.playbackRate;
    this.currentTime += elapsedSeconds;

    if (this.currentTime >= this.duration) {
      this.currentTime = this.duration;
      this.notifyTick(elapsedSeconds);
      this.pause();
      this.notifyCompletion();
      return;
    }

    this.notifyTick(elapsedSeconds);

    if (typeof requestAnimationFrame !== 'undefined') {
      this.rafId = requestAnimationFrame(this.loop);
    } else {
      this.rafId = setTimeout(this.loop, 16) as unknown as number;
    }
  };

  private notifyTick(deltaTime: number): void {
    this.tickCallbacks.forEach(cb => {
      try {
        cb(this.currentTime, deltaTime);
      } catch (err) {
        console.error('Error in timeline tick callback', err);
      }
    });
  }

  private notifyCompletion(): void {
    this.completionCallbacks.forEach(cb => {
      try {
        cb();
      } catch (err) {
        console.error('Error in timeline completion callback', err);
      }
    });
  }

  public destroy(): void {
    this.pause();
    this.tickCallbacks.clear();
    this.completionCallbacks.clear();
  }
}
