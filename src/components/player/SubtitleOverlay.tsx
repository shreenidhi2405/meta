import React from 'react';
import { DialogueCue, PerspectiveId } from '../../types/story';
import { Volume2, RotateCcw } from 'lucide-react';

interface SubtitleOverlayProps {
  dialogue: DialogueCue | null;
  enabled: boolean;
  activePerspective: PerspectiveId;
  isSpeaking?: boolean;
  onReplayVoice?: () => void;
}

export const SubtitleOverlay: React.FC<SubtitleOverlayProps> = ({
  dialogue,
  enabled,
  activePerspective,
  isSpeaking = false,
  onReplayVoice,
}) => {
  if (!enabled || !dialogue) return null;

  const speakerColors: Record<PerspectiveId, string> = {
    witness: 'text-sky-400',
    suspect: 'text-rose-400',
    victim: 'text-amber-400',
  };

  return (
    <div className="absolute bottom-16 left-0 right-0 z-30 pointer-events-none flex justify-center px-4 md:px-8 text-center transition-all duration-300">
      <div className="max-w-3xl bg-black/85 backdrop-blur-md px-6 py-3.5 rounded-xl border border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.8)] pointer-events-auto">
        {/* Header: Speaker & Voice Activity Status */}
        <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-widest font-mono mb-1.5 font-semibold">
          <div className="flex items-center gap-2">
            <span className={speakerColors[activePerspective] || 'text-gold'}>
              {dialogue.speaker}
            </span>
            {dialogue.subtext && (
              <span className="text-slate-400 font-normal italic lowercase font-sans hidden sm:inline">
                [{dialogue.subtext}]
              </span>
            )}
          </div>

          {/* Voice status & Replay button */}
          <div className="flex items-center gap-2">
            {isSpeaking ? (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-950/60 border border-gold/40 text-gold-light text-[10px]">
                <Volume2 className="w-3 h-3 text-gold animate-pulse" />
                <span className="flex gap-0.5 items-end h-2.5">
                  <span className="w-0.5 h-1.5 bg-gold animate-bounce" />
                  <span className="w-0.5 h-2.5 bg-gold animate-bounce [animation-delay:0.15s]" />
                  <span className="w-0.5 h-2 bg-gold animate-bounce [animation-delay:0.3s]" />
                </span>
                <span>Speaking</span>
              </div>
            ) : (
              <span className="text-[10px] text-slate-500 font-normal">Voice Synced</span>
            )}

            {onReplayVoice && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReplayVoice();
                }}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-cinema-border text-[10px] transition-colors"
                title="Replay Voice Dialogue"
              >
                <RotateCcw className="w-2.5 h-2.5 text-gold" />
                <span>Replay Voice</span>
              </button>
            )}
          </div>
        </div>

        {/* Spoken Text */}
        <p className="text-base md:text-lg text-slate-100 font-medium tracking-wide drop-shadow-md leading-snug">
          "{dialogue.text}"
        </p>
      </div>
    </div>
  );
};
