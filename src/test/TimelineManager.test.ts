import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TimelineManager } from '../engine/TimelineManager';

describe('TimelineManager', () => {
  let timeline: TimelineManager;

  beforeEach(() => {
    timeline = new TimelineManager(90, 0);
  });

  it('initializes with default duration and position', () => {
    expect(timeline.getDuration()).toBe(90);
    expect(timeline.getCurrentTime()).toBe(0);
    expect(timeline.getIsPlaying()).toBe(false);
  });

  it('clamps seeking within bounds [0, duration]', () => {
    timeline.seek(45.5);
    expect(timeline.getCurrentTime()).toBe(45.5);

    timeline.seek(-10);
    expect(timeline.getCurrentTime()).toBe(0);

    timeline.seek(200);
    expect(timeline.getCurrentTime()).toBe(90);
  });

  it('plays and pauses state accurately', () => {
    timeline.play();
    expect(timeline.getIsPlaying()).toBe(true);

    timeline.pause();
    expect(timeline.getIsPlaying()).toBe(false);
  });

  it('notifies subscribers on tick', () => {
    const tickSpy = vi.fn();
    const unsub = timeline.subscribeTick(tickSpy);

    timeline.seek(22);
    expect(tickSpy).toHaveBeenCalledWith(22, 22);

    unsub();
  });

  it('adjusts playback rate within safe limits', () => {
    timeline.setPlaybackRate(1.5);
    expect(timeline.getPlaybackRate()).toBe(1.5);

    // Max clamp 4.0
    timeline.setPlaybackRate(10);
    expect(timeline.getPlaybackRate()).toBe(4.0);

    // Min clamp 0.25
    timeline.setPlaybackRate(0.01);
    expect(timeline.getPlaybackRate()).toBe(0.25);
  });
});

