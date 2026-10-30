import React from 'react';
import { PerspectiveId, Perspective } from '../../types/story';
import { Eye, ShieldAlert, User, Volume2 } from 'lucide-react';

interface PerspectiveSwitcherProps {
  perspectives: Record<PerspectiveId, Perspective>;
  activePerspective: PerspectiveId;
  onSelectPerspective: (id: PerspectiveId) => void;
}

export const PerspectiveSwitcher: React.FC<PerspectiveSwitcherProps> = ({
  perspectives,
  activePerspective,
  onSelectPerspective,
}) => {
  const perspectiveKeys: PerspectiveId[] = ['witness', 'suspect', 'victim'];

  const getIcon = (id: PerspectiveId) => {
    switch (id) {
      case 'witness':
        return <Eye className="w-4 h-4" />;
      case 'suspect':
        return <ShieldAlert className="w-4 h-4" />;
      case 'victim':
        return <User className="w-4 h-4" />;
    }
  };

  const getAccentBorder = (id: PerspectiveId, isActive: boolean) => {
    if (!isActive) return 'border-cinema-border hover:border-slate-600 bg-cinema-surface/70';
    switch (id) {
      case 'witness':
        return 'border-sky-400 bg-sky-950/40 text-sky-200 shadow-[0_0_20px_rgba(56,189,248,0.25)]';
      case 'suspect':
        return 'border-rose-500 bg-rose-950/40 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.25)]';
      case 'victim':
        return 'border-gold bg-amber-950/40 text-gold-light shadow-[0_0_20px_rgba(245,158,11,0.25)]';
    }
  };

  const getPillBadge = (id: PerspectiveId, isActive: boolean) => {
    if (!isActive) return 'bg-slate-800 text-slate-400';
    switch (id) {
      case 'witness':
        return 'bg-sky-500/20 text-sky-300 border border-sky-400/40';
      case 'suspect':
        return 'bg-rose-500/20 text-rose-300 border border-rose-400/40';
      case 'victim':
        return 'bg-amber-500/20 text-amber-300 border border-amber-400/40';
    }
  };

  return (
    <div className="flex items-center gap-2 md:gap-3 bg-cinema-bg/90 p-1.5 rounded-xl border border-cinema-border/80 backdrop-blur-md shadow-2xl">
      <div className="hidden lg:flex items-center gap-1.5 px-2.5 text-[11px] font-mono uppercase tracking-wider text-slate-400 border-r border-cinema-border">
        <span>Perspectives</span>
      </div>

      <div className="flex items-center gap-2">
        {perspectiveKeys.map((key, index) => {
          const item = perspectives[key];
          const isActive = activePerspective === key;
          const hotkeyNum = index + 1;

          return (
            <button
              key={key}
              onClick={() => onSelectPerspective(key)}
              data-testid={`perspective-btn-${key}`}
              className={`relative group flex items-center gap-2.5 px-3 py-2 rounded-lg border text-left transition-all duration-300 ${getAccentBorder(
                key,
                isActive
              )}`}
            >
              {/* Hotkey Tag */}
              <span className="w-5 h-5 rounded font-mono text-[10px] flex items-center justify-center bg-black/50 text-slate-300 border border-white/10 group-hover:border-gold/40">
                {hotkeyNum}
              </span>

              {/* Icon & Details */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className={isActive ? 'text-current' : 'text-slate-400'}>
                    {getIcon(key)}
                  </span>
                  <span className="text-xs font-semibold tracking-wide">
                    {item.name}
                  </span>
                  {isActive && (
                    <Volume2 className="w-3.5 h-3.5 ml-1 animate-pulse text-gold" />
                  )}
                </div>
                <span className="text-[10px] text-slate-400 line-clamp-1">
                  {item.role}
                </span>
              </div>

              {/* Status Indicator */}
              <span
                className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded ml-1 hidden sm:inline-block ${getPillBadge(
                  key,
                  isActive
                )}`}
              >
                {isActive ? 'LIVE' : 'SYNCED'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
