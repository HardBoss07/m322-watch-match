import React from 'react';
import { Movie } from '../../types';
import { Button } from '../../components/ui/button';
import { Pill } from '../../components/ui/Pill';

interface SwipeCardProps {
  movie: Movie;
  dragOffset: { x: number; y: number };
  rotation: number;
  matchOpacity: number;
  passOpacity: number;
  isDragging: boolean;
  isNudging: boolean;
  onDragStart: (clientX: number, clientY: number) => void;
  onDragMove: (clientX: number, clientY: number) => void;
  onDragEnd: () => void;
  onOpenDetails: (movie: Movie) => void;
  onOpenReview?: (movie: Movie) => void;
  onCancelNudge?: () => void;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  movie,
  dragOffset,
  rotation,
  matchOpacity,
  passOpacity,
  isDragging,
  isNudging,
  onDragStart,
  onDragMove,
  onDragEnd,
  onOpenDetails,
  onOpenReview,
  onCancelNudge,
}) => {
  return (
    <div
      onAnimationEnd={onCancelNudge}
      onMouseEnter={onCancelNudge}
      onMouseDown={(e) => {
        if (onCancelNudge) onCancelNudge();
        onDragStart(e.clientX, e.clientY);
      }}
      onMouseMove={(e) => onDragMove(e.clientX, e.clientY)}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
      onTouchStart={(e) => {
        if (onCancelNudge) onCancelNudge();
        onDragStart(e.touches[0].clientX, e.touches[0].clientY);
      }}
      onTouchMove={(e) => onDragMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={onDragEnd}
      style={{
        transform: isNudging
          ? undefined
          : `translateX(${dragOffset.x}px) translateY(${dragOffset.y * 0.2}px) rotate(${rotation}deg)`,
        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      className={`absolute inset-0 bg-[#1a1a1a] border border-[#3a3a3a] rounded-2xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.85)] flex flex-col justify-end cursor-grab active:cursor-grabbing will-change-transform touch-none select-none ${
        isNudging ? 'animate-swipe-nudge ring-2 ring-[#ffd405]/50' : ''
      }`}
    >
      {/* Poster Art with Cinematic Gradient Scrim */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url(${movie.posterUrl})` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/85 via-50% to-transparent pointer-events-none"></div>

      {/* Gesture Feedback Stamps */}
      <div
        style={{ opacity: matchOpacity }}
        className="absolute top-4 right-4 px-3 py-1 bg-[#d80b69] text-white rounded-xl font-bold text-sm rotate-12 pointer-events-none transition-opacity shadow-lg flex items-center gap-1.5 border-2 border-white/50 z-20"
      >
        <span className="material-symbols-outlined text-[16px] icon-filled">favorite</span>
        MATCH
      </div>

      <div
        style={{ opacity: passOpacity }}
        className="absolute top-4 left-4 px-3 py-1 bg-[#2a2a2a] text-[#e5e2e1] rounded-xl font-bold text-sm -rotate-12 pointer-events-none transition-opacity shadow-lg flex items-center gap-1.5 border-2 border-[#555555] z-20"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
        PASS
      </div>

      {/* Card Content Dock */}
      <div className="relative z-10 p-3.5 flex flex-col gap-1.5">
        {/* Badges Row */}
        <div className="flex items-center flex-wrap gap-1.5">
          {movie.providers.map((p) => {
            const dotColor =
              p.id === 'netflix'
                ? '#e50914'
                : p.id === 'prime'
                ? '#00a8e1'
                : p.id === 'crunchyroll'
                ? '#f47521'
                : '#ffd405';
            return (
              <Pill key={p.id} dotColor={dotColor}>
                {p.name}
              </Pill>
            );
          })}
          {movie.hasDeAudio && (
            <Pill
              variant="audio"
              icon={<span className="material-symbols-outlined text-[12px]">record_voice_over</span>}
            >
              Audio: DE
            </Pill>
          )}
          <Pill variant="quality">
            {movie.providers[0]?.quality || 'UHD 4K'}
          </Pill>
        </div>

        {/* Title & Rating */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <h2 className="text-lg font-extrabold text-white tracking-tight truncate leading-tight">
              {movie.title}
            </h2>
            <span className="text-[10px] text-[#a3a3a3] mt-0.5 truncate">
              {movie.type === 'series' ? 'Serie' : 'Film'} • {movie.year} • {movie.duration || `${movie.episodes} Episoden`} • {movie.genres.slice(0, 2).join(' / ')}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-[#201f1f] border border-[#3a3a3a] px-2 py-0.5 rounded-full shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[14px] text-[#ffd405] icon-filled">star</span>
            <span className="text-xs text-[#ffd405] font-bold">{movie.rating}</span>
          </div>
        </div>

        {/* Teaser Description */}
        <p className="text-[11px] text-[#d4d4d4] line-clamp-2 leading-relaxed">
          {movie.synopsis}
        </p>

        {/* Dual Actions: Trailer & Details + Quick Review CTA */}
        <div className="flex items-center justify-between pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(movie);
            }}
            rightIcon={
              <span className="material-symbols-outlined text-[14px] transform group-hover:translate-x-1 transition-transform text-[#ffd405]">
                arrow_forward
              </span>
            }
            className="p-0 h-auto text-[11px] font-bold text-white hover:text-[#d80b69] hover:bg-transparent group"
          >
            Trailer & Details
          </Button>

          {onOpenReview && (
            <Button
              variant="secondary"
              size="sm"
              radius="full"
              onClick={(e) => {
                e.stopPropagation();
                onOpenReview(movie);
              }}
              leftIcon={<span className="material-symbols-outlined text-[13px] text-[#ffd405]">star</span>}
              className="h-6.5 text-[10px] px-2.5 py-0 bg-[#262626] border-[#3a3a3a] text-white hover:border-[#ffd405]/60 hover:bg-[#333333] font-semibold"
            >
              Bewerten
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
