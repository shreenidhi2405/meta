import React from 'react';
import { useStory } from '../../engine/StoryContext';
import { X, Volume2, VolumeX, Subtitles, Sparkles, Maximize2, Gauge, Sliders, Mic, Play } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { engine, state, updateSettings, isSettingsOpen, setIsSettingsOpen } = useStory();
  const { settings } = state;

  if (!isSettingsOpen) return null;

  const testCharacterVoice = (perspectiveId: 'witness' | 'suspect' | 'victim') => {
    const voiceEngine = engine.getVoiceEngine();
    voiceEngine.unlock();

    let testText = '';
    let speaker = '';
    if (perspectiveId === 'witness') {
      speaker = 'Marcus Ward';
      testText = '11:41 PM. I saw him back her right up against the edge. She had nowhere left to run.';
    } else if (perspectiveId === 'suspect') {
      speaker = 'Julian Mercer';
      testText = 'Elena, step back from the ledge! Look at me—listen to me! The money is yours, just take your hands off the railing!';
    } else {
      speaker = 'Elena Vance';
      testText = 'He thought I was bluffing. But every word was going straight into the cloud.';
    }

    voiceEngine.speakDialogue(
      {
        id: `test-${perspectiveId}`,
        perspectiveId,
        speaker,
        text: testText,
        startTime: 0,
        endTime: 5,
        emotionalTone: 'calm',
      },
      true
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
      onClick={() => setIsSettingsOpen(false)}
      data-testid="settings-modal"
    >
      <div
        className="relative w-full max-w-lg bg-cinema-surface border border-cinema-border rounded-2xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cinema-border pb-4">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-gold" />
            <h2 className="text-lg font-cinematic font-bold text-slate-100">
              Audio & Cinematic Settings
            </h2>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            data-testid="close-settings-btn"
            className="w-8 h-8 rounded-lg bg-cinema-bg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-cinema-border"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sliders & Toggles */}
        <div className="space-y-4 text-xs font-mono">
          {/* Character Voice Acting & Spoken Dialogue */}
          <div className="bg-cinema-bg p-4 rounded-xl border border-gold/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-gold-light font-bold">
                <Mic className="w-4 h-4 text-gold" />
                <span>Character Voice Acting & Speech</span>
              </span>
              <button
                onClick={() => updateSettings({ voiceEnabled: !settings.voiceEnabled })}
                className={`px-2.5 py-1 rounded text-[10px] border transition-colors ${
                  settings.voiceEnabled
                    ? 'bg-gold/20 border-gold text-gold-light font-bold'
                    : 'bg-cinema-panel border-cinema-border text-slate-500'
                }`}
              >
                {settings.voiceEnabled ? 'VOICES ON' : 'MUTED'}
              </button>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span>Voice Volume</span>
              <span className="text-gold-light font-bold">
                {Math.round((settings.voiceVolume ?? 1) * 100)}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.voiceVolume ?? 1}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                updateSettings({ voiceVolume: val, voiceEnabled: true });
              }}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />

            {/* Test Voice Buttons */}
            <div className="pt-2 border-t border-cinema-border">
              <span className="text-[10px] text-slate-400 block mb-2">Test Character Voices:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => testCharacterVoice('witness')}
                  className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded bg-sky-950/60 hover:bg-sky-900/60 border border-sky-800 text-sky-300 text-[10px] transition-colors"
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Marcus</span>
                </button>
                <button
                  onClick={() => testCharacterVoice('suspect')}
                  className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800 text-rose-300 text-[10px] transition-colors"
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Julian</span>
                </button>
                <button
                  onClick={() => testCharacterVoice('victim')}
                  className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800 text-gold-light text-[10px] transition-colors"
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Elena</span>
                </button>
              </div>
            </div>
          </div>

          {/* Master Atmosphere Volume Control */}
          <div className="bg-cinema-bg p-4 rounded-xl border border-cinema-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-200">
                {settings.isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-gold" />}
                <span>Master Atmosphere & SFX</span>
              </span>
              <span className="text-gold-light font-bold">
                {settings.isMuted ? 'Muted' : `${Math.round(settings.volume * 100)}%`}
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.isMuted ? 0 : settings.volume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                updateSettings({ volume: val, isMuted: false });
              }}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
          </div>

          {/* Subtitles & Captions */}
          <div className="flex items-center justify-between bg-cinema-bg p-4 rounded-xl border border-cinema-border">
            <div className="flex items-center gap-2 text-slate-200">
              <Subtitles className="w-4 h-4 text-gold" />
              <div>
                <span className="block font-semibold">Cinematic Subtitles</span>
                <span className="text-[10px] text-slate-400 font-sans">
                  Show dialogue transcript with character color coding
                </span>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ subtitlesEnabled: !settings.subtitlesEnabled })}
              className={`px-3 py-1.5 rounded-lg border text-[11px] transition-colors ${
                settings.subtitlesEnabled
                  ? 'bg-gold/20 border-gold text-gold-light font-bold'
                  : 'bg-cinema-panel border-cinema-border text-slate-500'
              }`}
            >
              {settings.subtitlesEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* 35mm Film Grain */}
          <div className="flex items-center justify-between bg-cinema-bg p-4 rounded-xl border border-cinema-border">
            <div className="flex items-center gap-2 text-slate-200">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <div>
                <span className="block font-semibold">35mm Film Grain</span>
                <span className="text-[10px] text-slate-400 font-sans">
                  Simulate analog photographic celluloid texture
                </span>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ filmGrainEnabled: !settings.filmGrainEnabled })}
              className={`px-3 py-1.5 rounded-lg border text-[11px] transition-colors ${
                settings.filmGrainEnabled
                  ? 'bg-sky-950/50 border-sky-500 text-sky-300 font-bold'
                  : 'bg-cinema-panel border-cinema-border text-slate-500'
              }`}
            >
              {settings.filmGrainEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* Anamorphic Bars */}
          <div className="flex items-center justify-between bg-cinema-bg p-4 rounded-xl border border-cinema-border">
            <div className="flex items-center gap-2 text-slate-200">
              <Maximize2 className="w-4 h-4 text-rose-400" />
              <div>
                <span className="block font-semibold">2.39:1 Cinemascope Framing</span>
                <span className="text-[10px] text-slate-400 font-sans">
                  Apply widescreen anamorphic letterbox framing
                </span>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ cinematicBars: !settings.cinematicBars })}
              className={`px-3 py-1.5 rounded-lg border text-[11px] transition-colors ${
                settings.cinematicBars
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300 font-bold'
                  : 'bg-cinema-panel border-cinema-border text-slate-500'
              }`}
            >
              {settings.cinematicBars ? 'LETTERBOX' : 'FULLSCREEN'}
            </button>
          </div>

          {/* Playback Rate */}
          <div className="bg-cinema-bg p-4 rounded-xl border border-cinema-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-200">
                <Gauge className="w-4 h-4 text-gold" />
                <span>Playback Speed</span>
              </span>
              <span className="text-gold-light">{settings.playbackRate}x</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0.5, 1.0, 1.25, 1.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => updateSettings({ playbackRate: rate })}
                  className={`py-1.5 rounded border text-center transition-colors ${
                    settings.playbackRate === rate
                      ? 'bg-gold/20 border-gold text-gold-light font-bold'
                      : 'bg-cinema-panel border-cinema-border text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="px-5 py-2 bg-gold hover:bg-gold-light text-cinema-bg font-mono font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
