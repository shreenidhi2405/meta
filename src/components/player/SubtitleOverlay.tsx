import React from 'react';
import { DialogueCue, PerspectiveId } from '../../types/story';

interface SubtitleOverlayProps {
  dialogue: DialogueCue | null;
  enabled: boolean;
  activePerspective: PerspectiveId;
}

export const SubtitleOverlay: React.FC<SubtitleOverlayProps> = ({
  dialogue,
  enabled,
  activePerspective,
}) => {
  if (!enabled || !dialogue) return null;

  const speakerColors: Record<PerspectiveId, string> = {
    witness: 'text-sky-400',
    suspect: 'text-rose-400',
    victim: 'text-amber-400',
  };

  return (
    <div className="absolute bottom-16 left-0 right-0 z-20 pointer-events-none flex justify-center px-8 text-center transition-all duration-300">
      <div className="max-w-3xl bg-black/75 backdrop-blur-md px-6 py-3 rounded-lg border border-slate-800/80 shadow-2xl">
        <div className="text-xs uppercase tracking-widest font-mono mb-1 font-semibold">
          <span className={speakerColors[activePerspective] || 'text-gold'}>
            {dialogue.speaker}
          </span>
          {dialogue.subtext && (
            <span className="text-slate-400 font-normal ml-2 italic lowercase font-sans">
              [{dialogue.subtext}]
            </span>
          )}
        </div>
        <p className="text-base md:text-lg text-slate-100 font-medium tracking-wide drop-shadow-md">
          "{dialogue.text}"
        </p>
      </div>
    </div>
  );
};
