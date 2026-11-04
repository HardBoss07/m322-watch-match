import React, { useState, useRef, useEffect } from 'react';
import { Movie, FilterSettings } from '../types';
import { Button, IconButton, ButtonIcon } from './ui/button';
import { Pill } from './ui/Pill';
import { getNextDeckIndex } from '../utils/matching';
import { useMobileFrame } from './MobileFrame';

interface MatchDeckProps {
  movies: Movie[];
  filters: FilterSettings;
  onOpenFilters: () => void;
  onOpenDetails: (movie: Movie) => void;
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
  onMatch,
  onPass,
  onSuperlike,
  onDeckWrapped,
}) => {
  const [deck, setDeck] = useState<Movie[]>(movies);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [surpriseMode, setSurpriseMode] = useState(true);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [matchNotification, setMatchNotification] = useState<{
    movie: Movie;
    friendName: string;
    matchPercent: number;
  } | null>(null);
  const [wrapNotice, setWrapNotice] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const wrapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevMovieIdsRef = useRef<string>(movies.map((m) => m.id).join(','));

  useEffect(() => {
    const currentIds = movies.map((m) => m.id).join(',');
    // Only reset index when movie set actually changes (e.g. filter changes)
    if (currentIds !== prevMovieIdsRef.current) {
      prevMovieIdsRef.current = currentIds;
      setDeck(movies);
      setCurrentIndex(0);
      setDragOffset({ x: 0, y: 0 });
    } else {
      setDeck(movies);
    }
  }, [movies]);

  useEffect(() => {
    return () => {
      if (wrapTimeoutRef.current) clearTimeout(wrapTimeoutRef.current);
    };
  }, []);

  const deckLength = deck.length;
  const safeIndex = deckLength > 0 ? currentIndex % deckLength : 0;
  const currentMovie = deck[safeIndex];
  const nextMovie = deckLength > 1 ? deck[(safeIndex + 1) % deckLength] : null;

  const triggerWrapNotification = () => {
    const msg = 'Du hast alle aktuellen Empfehlungen gesehen! Die Liste wurde neu gestartet.';
    setWrapNotice(msg);
    if (wrapTimeoutRef.current) clearTimeout(wrapTimeoutRef.current);
    wrapTimeoutRef.current = setTimeout(() => {
      setWrapNotice(null);
    }, 3500);

    onDeckWrapped?.(msg);
  };

  const advanceToNextCard = () => {
    if (deckLength === 0) return;
    const { nextIndex, didWrap } = getNextDeckIndex(safeIndex, deckLength);

    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
    setCurrentIndex(nextIndex);

    if (didWrap) {
      triggerWrapNotification();
    }
  };

  const { scale: frameScale } = useMobileFrame();

  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    startPosRef.current = { x: clientX, y: clientY };
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const currentScale = frameScale > 0 ? frameScale : 1;
    const deltaX = (clientX - startPosRef.current.x) / currentScale;
    const deltaY = (clientY - startPosRef.current.y) / currentScale;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset.x > 90) {
      triggerLike();
    } else if (dragOffset.x < -90) {
      triggerPass();
    } else if (dragOffset.y < -120) {
      triggerSuperlike();
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const triggerLike = () => {
    if (!currentMovie) return;
    const movieToMatch = currentMovie;
    setDragOffset({ x: 450, y: 20 });
    onMatch(movieToMatch);

    // If movie has high match score with Dario, trigger friendship match modal
    if (movieToMatch.matchScore && movieToMatch.matchScore >= 90) {
      setMatchNotification({
        movie: movieToMatch,
        friendName: 'Dario M.',
        matchPercent: movieToMatch.matchScore || 92,
      });
    }

    // Advance to next card in underlying stack
    setTimeout(() => {
      advanceToNextCard();
    }, 240);
  };

  const triggerPass = () => {
    if (!currentMovie) return;
    setDragOffset({ x: -450, y: 20 });
    onPass(currentMovie);
    setTimeout(() => {
      advanceToNextCard();
    }, 240);
  };

  const triggerSuperlike = () => {
    if (!currentMovie) return;
    setDragOffset({ x: 0, y: -400 });
    onSuperlike(currentMovie);
    setTimeout(() => {
      advanceToNextCard();
    }, 240);
  };

  const handleDismissMatchModal = () => {
    const matchedMovieId = matchNotification?.movie.id;
    setMatchNotification(null);
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);

    // If the deck is somehow still pointing to the matched movie, advance immediately
    if (matchedMovieId && deck[currentIndex % deckLength]?.id === matchedMovieId) {
      advanceToNextCard();
    }
  };

  const toggleSurpriseMode = () => {
    const nextMode = !surpriseMode;
    setSurpriseMode(nextMode);
    if (nextMode && deckLength > 1) {
      const shuffled = [...deck].sort(() => Math.random() - 0.5);
      setDeck(shuffled);
      setCurrentIndex(0);
      setDragOffset({ x: 0, y: 0 });
      onDeckWrapped?.('Zufallsmodus aktiviert — Deck neu gemischt! 🎲');
    }
  };

  // Rotation and stamp calculations
  const rotation = dragOffset.x * 0.07;
  const matchOpacity = Math.min(Math.max((dragOffset.x - 20) / 70, 0), 1);
  const passOpacity = Math.min(Math.max((-dragOffset.x - 20) / 70, 0), 1);

  // Active providers label string
  const activeProvidersCount = Object.values(filters.providers).filter(Boolean).length;
  const activeProvidersSummary = activeProvidersCount > 0
    ? Object.entries(filters.providers)
        .filter(([, v]) => v)
        .map(([k]) => k === 'netflix' ? 'Netflix' : k === 'disney' ? 'Disney+' : k === 'prime' ? 'Prime' : k === 'crunchyroll' ? 'Crunchyroll' : k)
        .slice(0, 2)
        .join(', ') + (activeProvidersCount > 2 ? ` +${activeProvidersCount - 2}` : '')
    : 'Keine Abos gewählt';

  return (
    <div className="flex flex-col w-full h-full justify-between relative px-3 sm:px-4 gap-2 select-none pb-2 max-w-lg mx-auto flex-1 min-h-0">
      {/* Interactive Filters Header & Surprise Toggle */}
      <div className="flex items-center justify-between gap-2 mt-1 shrink-0">
        {/* Active Filters Pill Button */}
        <Button
          variant="secondary"
          size="sm"
          radius="full"
          onClick={onOpenFilters}
          aria-label="Aktive Filter anpassen"
          className="h-auto min-h-[38px] py-1 px-3 bg-[#201f1f] hover:bg-[#2a2a2a] border-[#333333] justify-between text-left shadow-none group font-normal flex-1 max-w-[260px]"
        >
          <div className="flex items-center gap-2 min-w-0">
            <ButtonIcon position="left" size="sm">
              <span className="material-symbols-outlined text-[17px] text-[#ffd405]">tune</span>
            </ButtonIcon>
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="text-[11px] font-semibold text-white truncate">
                {activeProvidersSummary}
              </span>
              <span className="text-[10px] text-[#a3a3a3] truncate">
                Audio: {filters.onlyDeAudio ? 'Deutsch' : 'Alle'}
              </span>
            </div>
          </div>
        </Button>

        {/* Surprise Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-[#201f1f] border border-[#333333] px-2.5 py-1.5 rounded-full shrink-0">
          <span className="material-symbols-outlined text-[17px] text-[#ffb1c3]">shuffle</span>
          <span className="text-[11px] font-semibold text-white hidden xs:inline">Zufall</span>
          <button
            role="switch"
            aria-checked={surpriseMode}
            onClick={toggleSurpriseMode}
            className={`w-8 h-4.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
              surpriseMode ? 'bg-[#d80b69] justify-end' : 'bg-[#353534] justify-start'
            }`}
          >
            <span className="w-3.5 h-3.5 rounded-full bg-white shadow-sm block transition-transform"></span>
          </button>
        </div>
      </div>

      {/* Non-intrusive Wrap Notification Banner */}
      {wrapNotice && (
        <div className="absolute top-12 inset-x-3 sm:inset-x-4 z-40 bg-[#201f1f]/95 border border-[#ffd405] text-white px-3.5 py-2 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.85)] flex items-center gap-2.5 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="material-symbols-outlined text-[18px] text-[#ffd405] shrink-0">
            sync
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-[#ffd405]">Deck neu gestartet</p>
            <p className="text-[10px] text-[#e5e2e1] leading-tight">
              {wrapNotice}
            </p>
          </div>
          <button
            onClick={() => setWrapNotice(null)}
            className="text-[#a3a3a3] hover:text-white p-1"
            aria-label="Hinweis schließen"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </div>
      )}

      {/* Deck Stack Container */}
      <div className="relative w-full flex-1 min-h-[250px] max-h-[380px] flex items-center justify-center my-auto">
        {/* Background Ghost Card (Stack depth tier 2) */}
        <div className="absolute inset-x-4 top-2 bottom-0 bg-[#0e0e0e] border border-[#262626] rounded-2xl shadow-xl transform scale-90 translate-y-3 opacity-40 pointer-events-none"></div>

        {/* Next Card Preview (Stack depth tier 1) */}
        {nextMovie && (
          <div className="absolute inset-x-2 top-1 bottom-0 bg-[#1c1b1b] border border-[#333333] rounded-2xl shadow-2xl transform scale-95 translate-y-1.5 opacity-80 pointer-events-none overflow-hidden flex flex-col justify-end p-3">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40"
              style={{ backgroundImage: `url(${nextMovie.posterUrl})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/50 to-transparent"></div>
            <div className="relative z-10 flex flex-col gap-0.5">
              <span className="text-[10px] text-[#ffd405] uppercase tracking-wider font-bold">
                Als Nächstes
              </span>
              <h3 className="text-base font-bold text-white truncate">{nextMovie.title}</h3>
            </div>
          </div>
        )}

        {/* Foreground Interactive Swipe Card */}
        {currentMovie ? (
          <div
            ref={cardRef}
            onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
            onMouseMove={(e) => handleDragMove(e.clientX, e.clientY)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={handleDragEnd}
            style={{
              transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y * 0.2}px) rotate(${rotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            className="absolute inset-0 bg-[#1a1a1a] border border-[#3a3a3a] rounded-2xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.85)] flex flex-col justify-end cursor-grab active:cursor-grabbing will-change-transform touch-none"
          >
            {/* Poster Art with Cinematic Gradient Scrim */}
            <div
              className="absolute inset-0 bg-cover bg-center pointer-events-none"
              style={{ backgroundImage: `url(${currentMovie.posterUrl})` }}
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
            <div className="relative z-10 p-3 flex flex-col gap-1">
              {/* Badges Row with Standardized Uniform Pills */}
              <div className="flex items-center flex-wrap gap-1.5">
                {currentMovie.providers.map((p) => {
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
                {currentMovie.hasDeAudio && (
                  <Pill
                    variant="audio"
                    icon={<span className="material-symbols-outlined text-[12px]">record_voice_over</span>}
                  >
                    Audio: DE
                  </Pill>
                )}
                <Pill variant="quality">
                  {currentMovie.providers[0]?.quality || 'UHD 4K'}
                </Pill>
              </div>

              {/* Title & Rating */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col min-w-0">
                  <h2 className="text-lg font-extrabold text-white tracking-tight truncate leading-tight">
                    {currentMovie.title}
                  </h2>
                  <span className="text-[10px] text-[#a3a3a3] mt-0.5 truncate">
                    {currentMovie.type === 'series' ? 'Serie' : 'Film'} • {currentMovie.year} • {currentMovie.duration || `${currentMovie.episodes} Episoden`} • {currentMovie.genres.slice(0, 2).join(' / ')}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-[#201f1f] border border-[#3a3a3a] px-2 py-0.5 rounded-full shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[14px] text-[#ffd405] icon-filled">star</span>
                  <span className="text-xs text-[#ffd405] font-bold">{currentMovie.rating}</span>
                </div>
              </div>

              {/* Teaser Description */}
              <p className="text-[11px] text-[#d4d4d4] line-clamp-2 leading-relaxed">
                {currentMovie.synopsis}
              </p>

              {/* Trailer & Details Button */}
              <div className="flex items-center justify-between pt-0.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDetails(currentMovie);
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
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-3">
            <span className="material-symbols-outlined text-4xl text-[#ffd405]">movie_filter</span>
            <h3 className="text-lg font-bold text-white">Keine passenden Titel</h3>
            <p className="text-xs text-[#a3a3a3]">Passe deine Streaming-Abos an oder setze Filter zurück.</p>
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
        {/* Pass Button */}
        <IconButton
          onClick={triggerPass}
          aria-label="Diesen Titel ablehnen"
          variant="secondary"
          size="lg"
          radius="full"
          className="w-12 h-12 min-w-[48px] min-h-[48px] border-[#3a3a3a] text-[#a3a3a3] hover:text-white hover:bg-[#333333]"
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </IconButton>

        {/* Info Button */}
        <IconButton
          onClick={() => currentMovie && onOpenDetails(currentMovie)}
          aria-label="Filmdetails anzeigen"
          variant="secondary"
          size="md"
          radius="full"
          className="w-10 h-10 min-w-[40px] min-h-[40px] border-[#3a3a3a] text-white hover:bg-[#333333]"
        >
          <span className="material-symbols-outlined text-[18px]">info</span>
        </IconButton>

        {/* Superlike Button */}
        <IconButton
          onClick={triggerSuperlike}
          aria-label="Als Favorit markieren"
          variant="secondary"
          size="md"
          radius="full"
          className="w-10 h-10 min-w-[40px] min-h-[40px] border-[#3a3a3a] text-[#ffd405] hover:bg-[#333333]"
        >
          <span className="material-symbols-outlined text-[18px] icon-filled">star</span>
        </IconButton>

        {/* Like / Match Button */}
        <IconButton
          onClick={triggerLike}
          aria-label="Gefällt mir und zur Watchlist hinzufügen"
          variant="primary"
          size="xl"
          radius="full"
          className="w-14 h-14 min-w-[56px] min-h-[56px] shadow-lg shadow-black/50"
        >
          <span className="material-symbols-outlined text-[26px] icon-filled">favorite</span>
        </IconButton>
      </div>

      {/* Friend Match Celebration Modal */}
      {matchNotification && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#1a1a1a] border border-[#333333] rounded-2xl p-5 max-w-xs w-full text-center flex flex-col items-center gap-3 shadow-2xl relative overflow-hidden">
            <button
              onClick={handleDismissMatchModal}
              aria-label="Schließen"
              className="absolute top-3 right-3 text-[#a3a3a3] hover:text-white p-1"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            <div className="relative my-1">
              <img
                src="/watchmatch-icon.svg"
                alt="WatchMatch"
                className="w-14 h-14 relative z-10 animate-bounce"
              />
            </div>

            <div>
              <span className="text-xs uppercase font-extrabold text-[#ffd405] tracking-widest block">
                It's a Match!
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Du & {matchNotification.friendName}
              </h3>
              <p className="text-xs text-[#a3a3a3] mt-1">
                Ihr beide wollt <strong className="text-white">{matchNotification.movie.title}</strong> sehen!
              </p>
            </div>

            <div className="px-3 py-1.5 rounded-full bg-[#201f1f] border border-[#333333] text-xs font-bold text-[#ffd405] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] icon-filled">bolt</span>
              {matchNotification.matchPercent}% Übereinstimmung
            </div>

            <div className="flex flex-col gap-2 w-full mt-2">
              <Button
                variant="primary"
                size="md"
                radius="md"
                fullWidth
                onClick={handleDismissMatchModal}
              >
                Super, weiter matchen!
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
