import React from "react";
import { Movie } from "../../types";
import { Button } from "../../components/ui/button";
import { Pill } from "../../components/ui/Pill";

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
      onTouchMove={(e) =>
        onDragMove(e.touches[0].clientX, e.touches[0].clientY)
      }
      onTouchEnd={onDragEnd}
      style={{
        transform: isNudging
          ? undefined
          : `translateX(${dragOffset.x}px) translateY(${dragOffset.y * 0.2}px) rotate(${rotation}deg)`,
        transition: isDragging
          ? "none"
          : "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
      className={`absolute inset-0 bg-surface-100 border border-surface-300 rounded-2xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.85)] flex flex-col justify-end cursor-grab active:cursor-grabbing will-change-transform touch-none select-none ${
        isNudging ? "animate-swipe-nudge ring-2 ring-secondary/50" : ""
      }`}
    >
      {/* Poster Art with Cinematic Gradient Scrim */}
      <img
        src={movie.posterUrl}
        alt={`Poster von ${movie.title}`}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-surface via-surface/85 via-50% to-transparent pointer-events-none"
      ></div>

      {/* Gesture Feedback Stamps */}
      <div
        aria-hidden="true"
        style={{ opacity: matchOpacity }}
        className="absolute top-4 right-4 px-3 py-1 bg-primary-container text-white rounded-xl font-bold text-sm rotate-12 pointer-events-none transition-opacity shadow-lg flex items-center gap-1.5 border-2 border-white/50 z-20"
      >
        <span className="material-symbols-outlined text-[16px] icon-filled">
          favorite
        </span>
        MATCH
      </div>

      <div
        aria-hidden="true"
        style={{ opacity: passOpacity }}
        className="absolute top-4 left-4 px-3 py-1 bg-surface-container-high text-on-surface rounded-xl font-bold text-sm -rotate-12 pointer-events-none transition-opacity shadow-lg flex items-center gap-1.5 border-2 border-surface-bright z-20"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
        PASS
      </div>

      {/* Card Content Dock */}
      <div className="relative z-10 p-4 flex flex-col gap-2">
        {/* Badges Row */}
        <div className="flex items-center flex-wrap gap-2">
          {movie.providers.map((p) => {
            const dotColor =
              p.id === "netflix"
                ? "#e50914"
                : p.id === "prime"
                  ? "#00a8e1"
                  : p.id === "crunchyroll"
                    ? "#f47521"
                    : "var(--color-secondary, #ffd405)";
            return (
              <Pill key={p.id} dotColor={dotColor}>
                {p.name}
              </Pill>
            );
          })}
          {movie.hasDeAudio && (
            <Pill
              variant="audio"
              icon={
                <span
                  className="material-symbols-outlined text-[13px]"
                  aria-hidden="true"
                >
                  record_voice_over
                </span>
              }
            >
              Audio: DE
            </Pill>
          )}
          <Pill variant="quality">
            {movie.providers[0]?.quality || "UHD 4K"}
          </Pill>
        </div>

        {/* Title & Rating */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <h2 className="text-xl font-extrabold text-white tracking-tight line-clamp-2 leading-tight">
              {movie.title}
            </h2>
            <span className="text-[11px] text-[#d6d4d3] mt-0.5 truncate">
              {movie.type === "series" ? "Serie" : "Film"} • {movie.year} •{" "}
              {movie.duration || `${movie.episodes} Episoden`} •{" "}
              {movie.genres.slice(0, 2).join(" / ")}
            </span>
          </div>

          <div
            aria-label={`Bewertung: ${movie.rating} von 10 Sternen`}
            className="flex items-center gap-1 bg-surface-container border border-surface-300 px-2.5 py-1 rounded-full shrink-0 shadow-sm"
          >
            <span
              className="material-symbols-outlined text-[15px] text-secondary icon-filled"
              aria-hidden="true"
            >
              star
            </span>
            <span className="text-xs text-secondary font-bold">
              {movie.rating}
            </span>
          </div>
        </div>

        {/* Teaser Description */}
        <p className="text-xs text-[#e5e2e1] line-clamp-2 leading-relaxed">
          {movie.synopsis}
        </p>

        {/* Dual Actions: Trailer & Details + Quick Review CTA */}
        <div className="flex items-center justify-between pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onOpenDetails(movie);
            }}
            rightIcon={
              <span
                className="material-symbols-outlined text-[15px] transform group-hover:translate-x-1 transition-transform text-secondary"
                aria-hidden="true"
              >
                arrow_forward
              </span>
            }
            className="px-2 py-2 min-h-[44px] text-xs font-bold text-white hover:text-primary-container hover:bg-white/5 rounded-lg group"
          >
            Trailer & Details
          </Button>

          {onOpenReview && (
            <Button
              variant="secondary"
              size="sm"
              radius="full"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onOpenReview(movie);
              }}
              leftIcon={
                <span
                  className="material-symbols-outlined text-[14px] text-secondary"
                  aria-hidden="true"
                >
                  star
                </span>
              }
              className="min-h-[44px] text-xs px-3.5 bg-surface-container-high border-surface-300 text-white hover:border-secondary/60 hover:bg-surface-container-highest font-bold"
            >
              Bewerten
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
