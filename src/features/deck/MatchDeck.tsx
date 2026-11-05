import React from "react";
import { Movie, FilterSettings } from "../../types";
import { Button } from "../../components/ui/button";
import { useMatchDeck } from "./useMatchDeck";
import { useSwipeGesture } from "./useSwipeGesture";
import { SwipeCard } from "./SwipeCard";
import { MatchOverlay } from "./MatchOverlay";
import { DeckHeader } from "./DeckHeader";
import { DeckControls } from "./DeckControls";

interface MatchDeckProps {
  movies: Movie[];
  filters: FilterSettings;
  onOpenFilters: () => void;
  onOpenDetails: (movie: Movie) => void;
  onOpenReview?: (movie: Movie) => void;
  onMatch: (movie: Movie) => void;
  onPass: (movie: Movie) => void;
  onSuperlike: (movie: Movie) => void;
  onDeckWrapped?: (message: string) => void;
}

export const MatchDeck: React.FC<MatchDeckProps> = ({
  movies,
  filters,
  onOpenFilters,
  onOpenDetails,
  onOpenReview,
  onMatch,
  onPass,
  onSuperlike,
  onDeckWrapped,
}) => {
  const {
    currentMovie,
    nextMovie,
    surpriseMode,
    toggleSurpriseMode,
    wrapNotice,
    setWrapNotice,
    matchNotification,
    triggerLike,
    triggerPass,
    triggerSuperlike,
    dismissMatchModal,
  } = useMatchDeck({
    movies,
    onMatch,
    onPass,
    onSuperlike,
    onDeckWrapped,
  });

  const {
    dragOffset,
    rotation,
    matchOpacity,
    passOpacity,
    isDragging,
    isNudging,
    resetIdleTimer,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  } = useSwipeGesture({
    onSwipeRight: triggerLike,
    onSwipeLeft: triggerPass,
    onSwipeUp: triggerSuperlike,
    idleTimeoutMs: 3500,
  });

  return (
    <div
      onMouseMove={resetIdleTimer}
      onTouchStart={resetIdleTimer}
      className="flex flex-col w-full h-full justify-between relative px-3 sm:px-4 gap-2 select-none pb-2 max-w-lg mx-auto flex-1 min-h-0"
    >
      {/* Decoupled Interactive Filters Header & Surprise Toggle */}
      <DeckHeader
        filters={filters}
        surpriseMode={surpriseMode}
        onOpenFilters={onOpenFilters}
        onToggleSurprise={toggleSurpriseMode}
        onInteractionReset={resetIdleTimer}
      />

      {/* Non-intrusive Wrap Notification Banner */}
      {wrapNotice && (
        <div className="absolute top-12 inset-x-3 sm:inset-x-4 z-40 bg-surface-container/95 border border-secondary text-white px-3.5 py-2 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.85)] flex items-center gap-2.5 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 animate-spin">
            sync
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-secondary">
              Deck neu gestartet
            </p>
            <p className="text-[10px] text-on-surface leading-tight">
              {wrapNotice}
            </p>
          </div>
          <button
            onClick={() => setWrapNotice(null)}
            className="text-tertiary hover:text-white p-1"
            aria-label="Hinweis schließen"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </div>
      )}

      {/* Deck Stack Container */}
      <div className="relative w-full flex-1 min-h-[250px] max-h-[380px] flex items-center justify-center my-auto">
        {/* Background Ghost Card */}
        <div className="absolute inset-x-4 top-2 bottom-0 bg-surface-container-lowest border border-surface-bright rounded-2xl shadow-xl transform scale-90 translate-y-3 opacity-40 pointer-events-none"></div>

        {/* Next Card Preview */}
        {nextMovie && (
          <div className="absolute inset-x-2 top-1 bottom-0 bg-surface-container-low border border-surface-300 rounded-2xl shadow-2xl transform scale-95 translate-y-1.5 opacity-80 pointer-events-none overflow-hidden flex flex-col justify-end p-3">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40"
              style={{ backgroundImage: `url(${nextMovie.posterUrl})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent"></div>
            <div className="relative z-10 flex flex-col gap-0.5">
              <span className="text-[10px] text-secondary uppercase tracking-wider font-bold">
                Als Nächstes
              </span>
              <h3 className="text-base font-bold text-white truncate">
                {nextMovie.title}
              </h3>
            </div>
          </div>
        )}

        {/* Foreground Interactive Swipe Card */}
        {currentMovie ? (
          <SwipeCard
            movie={currentMovie}
            dragOffset={dragOffset}
            rotation={rotation}
            matchOpacity={matchOpacity}
            passOpacity={passOpacity}
            isDragging={isDragging}
            isNudging={isNudging}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            onOpenDetails={onOpenDetails}
            onOpenReview={onOpenReview}
            onCancelNudge={resetIdleTimer}
          />
        ) : (
          <div className="bg-surface-100 border border-surface-300 rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-3">
            <span className="material-symbols-outlined text-4xl text-secondary">
              movie_filter
            </span>
            <h3 className="text-lg font-bold text-white">
              Keine passenden Titel
            </h3>
            <p className="text-xs text-tertiary">
              Passe deine Streaming-Abos oder Filter an.
            </p>
            <Button
              variant="primary"
              size="sm"
              radius="md"
              onClick={onOpenFilters}
            >
              Filter anpassen
            </Button>
          </div>
        )}
      </div>

      {/* Floating Cinematic Controls Dock */}
      <DeckControls
        onPass={triggerPass}
        onFriendsInfo={() => {
          if (currentMovie) onOpenDetails(currentMovie);
        }}
        onSuperlike={triggerSuperlike}
        onLike={triggerLike}
        friendsCount={3}
        onInteractionReset={resetIdleTimer}
      />

      {/* Friend Match Celebration Modal */}
      {matchNotification && (
        <MatchOverlay
          movie={matchNotification.movie}
          friendName={matchNotification.friendName}
          matchPercent={matchNotification.matchPercent}
          onDismiss={dismissMatchModal}
        />
      )}
    </div>
  );
};
