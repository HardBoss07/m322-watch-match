import React from "react";
import { Movie, FilterSettings } from "../../types";
import { Button, IconButton, ButtonIcon } from "../../components/ui/button";
import { useMatchDeck } from "./useMatchDeck";
import { useSwipeGesture } from "./useSwipeGesture";
import { SwipeCard } from "./SwipeCard";
import { MatchOverlay } from "./MatchOverlay";

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

  const activeProvidersCount = Object.values(filters.providers).filter(
    Boolean,
  ).length;
  const activeProvidersSummary =
    activeProvidersCount > 0
      ? Object.entries(filters.providers)
          .filter(([, v]) => v)
          .map(([k]) =>
            k === "netflix"
              ? "Netflix"
              : k === "disney"
                ? "Disney+"
                : k === "prime"
                  ? "Prime"
                  : k === "crunchyroll"
                    ? "Crunchyroll"
                    : k,
          )
          .slice(0, 2)
          .join(", ") +
        (activeProvidersCount > 2 ? ` +${activeProvidersCount - 2}` : "")
      : "Keine Abos gewählt";

  return (
    <div
      onMouseMove={resetIdleTimer}
      onTouchStart={resetIdleTimer}
      className="flex flex-col w-full h-full justify-between relative px-3 sm:px-4 gap-2 select-none pb-2 max-w-lg mx-auto flex-1 min-h-0"
    >
      {/* Interactive Filters Header & Surprise Toggle */}
      <div className="flex items-center justify-between gap-2 mt-1 shrink-0">
        <Button
          variant="secondary"
          size="sm"
          radius="full"
          onClick={() => {
            resetIdleTimer();
            onOpenFilters();
          }}
          aria-label="Aktive Filter anpassen"
          className="h-auto min-h-[38px] py-1 px-3 bg-surface-container hover:bg-surface-container-high border-surface-300 justify-between text-left shadow-none group font-normal flex-1 max-w-[260px]"
        >
          <div className="flex items-center gap-2 min-w-0">
            <ButtonIcon position="left" size="sm">
              <span className="material-symbols-outlined text-[17px] text-secondary">
                tune
              </span>
            </ButtonIcon>
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="text-[11px] font-semibold text-white truncate">
                {activeProvidersSummary}
              </span>
              <span className="text-[10px] text-tertiary truncate">
                {filters.audioLanguages && filters.audioLanguages.length > 0
                  ? `Synchro: ${filters.audioLanguages.join(", ")}`
                  : filters.onlyDeAudio
                    ? "Audio: Deutsch"
                    : "Audio: Alle"}
              </span>
            </div>
          </div>
        </Button>

        {/* Surprise Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-surface-container border border-surface-300 px-2.5 py-1.5 rounded-full shrink-0">
          <span className="material-symbols-outlined text-[17px] text-primary-container">
            shuffle
          </span>
          <span className="text-[11px] font-semibold text-white hidden xs:inline">
            Zufall
          </span>
          <button
            role="switch"
            aria-checked={surpriseMode}
            onClick={() => {
              resetIdleTimer();
              toggleSurpriseMode();
            }}
            className={`w-8 h-4.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
              surpriseMode
                ? "bg-primary-container justify-end"
                : "bg-surface-container-highest justify-start"
            }`}
          >
            <span className="w-3.5 h-3.5 rounded-full bg-white shadow-sm block transition-transform"></span>
          </button>
        </div>
      </div>

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
      <div className="flex items-center justify-center gap-3 py-1 shrink-0">
        <IconButton
          onClick={() => {
            resetIdleTimer();
            triggerPass();
          }}
          onMouseEnter={resetIdleTimer}
          aria-label="Diesen Titel ablehnen"
          variant="secondary"
          size="lg"
          radius="full"
          className="w-12 h-12 min-w-[48px] min-h-[48px] border-surface-300 text-tertiary hover:text-white hover:bg-surface-container-high"
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </IconButton>

        <IconButton
          onClick={() => {
            resetIdleTimer();
            if (currentMovie) onOpenDetails(currentMovie);
          }}
          onMouseEnter={resetIdleTimer}
          aria-label="Filmdetails anzeigen"
          variant="secondary"
          size="md"
          radius="full"
          className="w-10 h-10 min-w-[40px] min-h-[40px] border-surface-300 text-white hover:bg-surface-container-high"
        >
          <span className="material-symbols-outlined text-[18px]">info</span>
        </IconButton>

        <IconButton
          onClick={() => {
            resetIdleTimer();
            triggerSuperlike();
          }}
          onMouseEnter={resetIdleTimer}
          aria-label="Als Favorit markieren"
          variant="secondary"
          size="md"
          radius="full"
          className="w-10 h-10 min-w-[40px] min-h-[40px] border-surface-300 text-secondary hover:bg-surface-container-high"
        >
          <span className="material-symbols-outlined text-[18px] icon-filled">
            star
          </span>
        </IconButton>

        <IconButton
          onClick={() => {
            resetIdleTimer();
            triggerLike();
          }}
          onMouseEnter={resetIdleTimer}
          aria-label="Gefällt mir und zur Watchlist hinzufügen"
          variant="primary"
          size="xl"
          radius="full"
          className="w-14 h-14 min-w-[56px] min-h-[56px] shadow-lg shadow-black/50"
        >
          <span className="material-symbols-outlined text-[26px] icon-filled">
            favorite
          </span>
        </IconButton>
      </div>

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
