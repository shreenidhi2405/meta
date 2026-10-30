import React from 'react';
import { Clue } from '../../types/story';
import { Search, CheckCircle2 } from 'lucide-react';

interface ClueHotspotOverlayProps {
  visibleClues: Clue[];
  discoveredClueIds: string[];
  onClueClick: (clueId: string) => void;
}

export const ClueHotspotOverlay: React.FC<ClueHotspotOverlayProps> = ({
  visibleClues,
  discoveredClueIds,
  onClueClick,
}) => {
  if (visibleClues.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {visibleClues.map((clue) => {
        const isDiscovered = discoveredClueIds.includes(clue.id);

        return (
          <div
            key={clue.id}
            style={{
              left: `${clue.hotspot.x}%`,
              top: `${clue.hotspot.y}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
            onClick={(e) => {
              e.stopPropagation();
              onClueClick(clue.id);
            }}
            data-testid={`clue-hotspot-${clue.id}`}
          >
            {/* Pulsing Radar Ring */}
            <div className={`absolute -inset-4 rounded-full border ${isDiscovered ? 'border-cyan-400/40 animate-pulse-subtle' : 'border-gold/70 animate-radar-ping'}`} />

            {/* Glowing Center Badge */}
            <div
              className={`relative flex items-center justify-center w-11 h-11 rounded-full border shadow-2xl transition-all duration-300 transform group-hover:scale-125 ${
                isDiscovered
                  ? 'bg-slate-900/90 border-cyan-400 text-cyan-300 shadow-cyan-950/80'
                  : 'bg-amber-950/90 border-gold text-gold-light shadow-gold/40 animate-bounce'
              }`}
            >
              {isDiscovered ? (
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              ) : (
                <Search className="w-5 h-5 text-gold animate-pulse" />
              )}
            </div>

            {/* Tooltip on Hover */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
              <div className="bg-cinema-surface/95 border border-gold/40 px-3.5 py-1.5 rounded text-xs text-slate-100 font-mono shadow-2xl backdrop-blur-md flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isDiscovered ? 'bg-cyan-400' : 'bg-gold animate-ping'}`} />
                <span className="font-semibold text-gold-light">{clue.title}</span>
                <span className="text-slate-400 text-[10px] uppercase tracking-wider">
                  [{isDiscovered ? 'Examined' : 'Click to Inspect'}]
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

