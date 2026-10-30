import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Robust LocalStorage Mock
const storageStore: Record<string, string> = {};
const localStorageMock: Storage = {
  getItem: vi.fn((key: string) => storageStore[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    storageStore[key] = value.toString();
  }),
  removeItem: vi.fn((key: string) => {
    delete storageStore[key];
  }),
  clear: vi.fn(() => {
    for (const key in storageStore) {
      delete storageStore[key];
    }
  }),
  key: vi.fn((idx: number) => Object.keys(storageStore)[idx] || null),
  get length() {
    return Object.keys(storageStore).length;
  },
};

Object.defineProperty(window, 'localStorage', {
  writable: true,
  value: localStorageMock,
});

if (typeof globalThis !== 'undefined') {
  Object.defineProperty(globalThis, 'localStorage', {
    writable: true,
    value: localStorageMock,
  });
}

// Mock SpeechSynthesis API
class SpeechSynthesisUtteranceMock {
  public text: string = '';
  public voice: SpeechSynthesisVoice | null = null;
  public volume: number = 1;
  public rate: number = 1;
  public pitch: number = 1;
  public onend: (() => void) | null = null;
  public onerror: (() => void) | null = null;

  constructor(text: string = '') {
    this.text = text;
  }
}

const speechSynthesisMock = {
  speak: vi.fn(),
  cancel: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  getVoices: vi.fn().mockReturnValue([
    { name: 'Microsoft David Desktop - English (United States)', lang: 'en-US' },
    { name: 'Microsoft Zira Desktop - English (United States)', lang: 'en-US' },
    { name: 'Google UK English Male', lang: 'en-GB' },
  ]),
  onvoiceschanged: null,
};

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
  writable: true,
  value: SpeechSynthesisUtteranceMock,
});

Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: speechSynthesisMock,
});

if (typeof globalThis !== 'undefined') {
  Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', {
    writable: true,
    value: SpeechSynthesisUtteranceMock,
  });
  Object.defineProperty(globalThis, 'speechSynthesis', {
    writable: true,
    value: speechSynthesisMock,
  });
}

// Mock Web Audio API for tests
class AudioContextMock {
  public state = 'running';
  public currentTime = 0;
  public destination = {};
  public sampleRate = 44100;

  createGain() {
    return {
      gain: {
        value: 1,
        setValueAtTime: vi.fn(),
        setTargetAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    };
  }

  createOscillator() {
    return {
      type: 'sine',
      frequency: {
        value: 440,
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
  }

  createBiquadFilter() {
    return {
      type: 'lowpass',
      frequency: {
        value: 350,
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      Q: { setValueAtTime: vi.fn() },
      connect: vi.fn(),
    };
  }

  createBuffer() {
    return {
      getChannelData: () => new Float32Array(100),
    };
  }

  createBufferSource() {
    return {
      buffer: null,
      loop: false,
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
  }

  resume() {
    return Promise.resolve();
  }

  close() {
    return Promise.resolve();
  }
}

Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: AudioContextMock,
});

Object.defineProperty(window, 'webkitAudioContext', {
  writable: true,
  value: AudioContextMock,
});

// Mock HTMLCanvasElement.getContext
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  arc: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  fillText: vi.fn(),
  createLinearGradient: vi.fn().mockReturnValue({
    addColorStop: vi.fn(),
  }),
  createRadialGradient: vi.fn().mockReturnValue({
    addColorStop: vi.fn(),
  }),
});
