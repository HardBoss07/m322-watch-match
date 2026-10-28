import React, { useState, useRef, useEffect } from 'react';
import { Movie, FilterSettings } from '../types';
import { Button, IconButton, ButtonIcon } from './ui/button';
import { Pill } from './ui/Pill';

interface MatchDeckProps {
  movies: Movie[];
  filters: FilterSettings;
  onOpenFilters: () => void;
  onOpenDetails: (movie: Movie) => void;
  onMatch: (movie: Movie) => void;
  onPass: (movie: Movie) => void;
  onSuperlike: (movie: Movie) => void;
}

export const MatchDeck: React.FC<MatchDeckProps> = ({
  movies,
  filters,
  onOpenFilters,
  onOpenDetails,
  onMatch,
  onPass,
  onSuperlike,
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

  const cardRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setDeck(movies);
    setCurrentIndex(0);
  }, [movies]);

  const currentMovie = deck[currentIndex];
  const nextMovie = deck[currentIndex + 1] || deck[0];

  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    startPosRef.current = { x: clientX, y: clientY };
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const deltaX = clientX - startPosRef.current.x;
    const deltaY = clientY - startPosRef.current.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset.x > 100) {
      triggerLike();
    } else if (dragOffset.x < -100) {
      triggerPass();
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const triggerLike = () => {
    if (!currentMovie) return;
    setDragOffset({ x: 450, y: 20 });
    onMatch(currentMovie);

    // If movie has high match score with Dario, trigger friendship match modal
    if (currentMovie.matchScore && currentMovie.matchScore >= 90) {
      setTimeout(() => {
        setMatchNotification({
          movie: currentMovie,
          friendName: 'Dario M.',
          matchPercent: currentMovie.matchScore || 92,
        });
      }, 300);
    }

    advanceCard();
  };

  const triggerPass = () => {
    if (!currentMovie) return;
    setDragOffset({ x: -450, y: 20 });
    onPass(currentMovie);
    advanceCard();
  };

  const triggerSuperlike = () => {
    if (!currentMovie) return;
    setDragOffset({ x: 0, y: -400 });
    onSuperlike(currentMovie);
    advanceCard();
  };

  const advanceCard = () => {
    setTimeout(() => {
      setDragOffset({ x: 0, y: 0 });
      setCurrentIndex((prev) => (prev + 1 < deck.length ? prev + 1 : 0));
    }, 280);
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
    <div className="flex flex-col w-full relative px-4 gap-2.5 select-none pb-3 max-w-lg mx-auto">
      {/* Interactive Filters Header & Surprise Toggle */}
      <div className="flex items-center justify-between gap-2.5 mt-1">
        {/* Active Filters Pill Button */}
        <Button
          variant="secondary"
          size="sm"
          radius="full"
          onClick={onOpenFilters}
          aria-label="Aktive Filter anpassen"
          className="h-auto min-h-[42px] py-1.5 px-3.5 bg-[#201f1f] hover:bg-[#2a2a2a] border-[#333333] justify-between text-left shadow-none group font-normal flex-1 max-w-[270px]"
        >
          <div className="flex items-center gap-2 min-w-0">
            <ButtonIcon position="left" size="sm">
              <span className="material-symbols-outlined text-[18px] text-[#ffd405]">tune</span>
            </ButtonIcon>
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="text-xs font-semibold text-white truncate">
                {activeProvidersSummary}
              </span>
              <span className="text-[10px] text-[#a3a3a3] truncate">
                Audio: {filters.onlyDeAudio ? 'Deutsch' : 'Alle'}
              </span>
            </div>
          </div>

        </Button>

        {/* Surprise Mode Toggle */}
        <div className="flex items-center gap-2 bg-[#201f1f] border border-[#333333] px-3 py-2 rounded-full shrink-0">
          <span className="material-symbols-outlined text-[18px] text-[#ffb1c3]">shuffle</span>
          <span className="text-xs font-semibold text-white hidden xs:inline">Zufall</span>
          <button
            role="switch"
            aria-checked={surpriseMode}
            onClick={() => setSurpriseMode(!surpriseMode)}
            className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
              surpriseMode ? 'bg-[#d80b69] justify-end' : 'bg-[#353534] justify-start'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white shadow-sm block transition-transform"></span>
          </button>
        </div>
      </div>

      {/* Deck Stack Container */}
      <div className="relative w-full h-[315px] flex items-center justify-center mt-0.5">
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
            className="absolute inset-0 bg-[#1a1a1a] border border-[#3a3a3a] rounded-2xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.85)] flex flex-col justify-end cursor-grab active:cursor-grabbing will-change-transform"
          >
            {/* Poster Art with Cinematic Gradient Scrim */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${currentMovie.posterUrl})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/85 via-50% to-transparent pointer-events-none"></div>

            {/* Gesture Feedback Stamps */}
            <div
              style={{ opacity: matchOpacity }}
              className="absolute top-5 right-5 px-3 py-1 bg-[#d80b69] text-white rounded-xl font-bold text-base rotate-12 pointer-events-none transition-opacity shadow-lg flex items-center gap-1.5 border-2 border-white/50"
            >
              <span className="material-symbols-outlined text-[18px] icon-filled">favorite</span>
              MATCH
            </div>

            <div
              style={{ opacity: passOpacity }}
              className="absolute top-5 left-5 px-3 py-1 bg-[#2a2a2a] text-[#e5e2e1] rounded-xl font-bold text-base -rotate-12 pointer-events-none transition-opacity shadow-lg flex items-center gap-1.5 border-2 border-[#555555]"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
              PASS
            </div>

            {/* Card Content Dock */}
            <div className="relative z-10 p-3.5 flex flex-col gap-1.5">
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
                    icon={<span className="material-symbols-outlined text-[13px]">record_voice_over</span>}
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
                  <h2 className="text-xl font-extrabold text-white tracking-tight truncate leading-tight">
                    {currentMovie.title}
                  </h2>
                  <span className="text-[11px] text-[#a3a3a3] mt-0.5 truncate">
                    {currentMovie.type === 'series' ? 'Serie' : 'Film'} • {currentMovie.year} • {currentMovie.duration || `${currentMovie.episodes} Episoden`} • {currentMovie.genres.slice(0, 2).join(' / ')}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-[#201f1f] border border-[#3a3a3a] px-2 py-0.5 rounded-full shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[15px] text-[#ffd405] icon-filled">star</span>
                  <span className="text-xs text-[#ffd405] font-bold">{currentMovie.rating}</span>
                  {currentMovie.ratingCount && (
                    <span className="text-[9px] text-[#a3a3a3]">({currentMovie.ratingCount})</span>
                  )}
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
                    <span className="material-symbols-outlined text-[15px] transform group-hover:translate-x-1 transition-transform text-[#ffd405]">
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
            <h3 className="text-lg font-bold text-white">Alle Titel durchgesehen!</h3>
            <p className="text-xs text-[#a3a3a3]">Passe deine Streaming-Abos an oder mische das Deck neu.</p>
            <Button
              variant="primary"
              size="sm"
              radius="md"
              onClick={() => {
                setDeck(movies);
                setCurrentIndex(0);
              }}
            >
              Deck neu laden
            </Button>
          </div>
        )}
      </div>

      {/* Floating Cinematic Controls Dock */}
      <div className="flex items-center justify-center gap-3 py-1">
        {/* Pass Button */}
        <IconButton
          onClick={triggerPass}
          aria-label="Diesen Titel ablehnen"
          variant="secondary"
          size="lg"
          radius="full"
          className="w-13 h-13 min-w-[52px] min-h-[52px] border-[#3a3a3a] text-[#a3a3a3] hover:text-white hover:bg-[#333333]"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </IconButton>

        {/* Info Button */}
        <IconButton
          onClick={() => currentMovie && onOpenDetails(currentMovie)}
          aria-label="Filmdetails anzeigen"
          variant="secondary"
          size="md"
          radius="full"
          className="w-11 h-11 min-w-[44px] min-h-[44px] border-[#3a3a3a] text-white hover:bg-[#333333]"
        >
          <span className="material-symbols-outlined text-[20px]">info</span>
        </IconButton>

        {/* Superlike Button */}
        <IconButton
          onClick={triggerSuperlike}
          aria-label="Als Favorit markieren"
          variant="secondary"
          size="md"
          radius="full"
          className="w-11 h-11 min-w-[44px] min-h-[44px] border-[#3a3a3a] text-[#ffd405] hover:bg-[#333333]"
        >
          <span className="material-symbols-outlined text-[20px] icon-filled">star</span>
        </IconButton>

        {/* Like / Match Button */}
        <IconButton
          onClick={triggerLike}
          aria-label="Gefällt mir und zur Watchlist hinzufügen"
          variant="primary"
          size="xl"
          radius="full"
          className="w-15 h-15 min-w-[60px] min-h-[60px] shadow-lg shadow-black/50"
        >
          <span className="material-symbols-outlined text-[28px] icon-filled">favorite</span>
        </IconButton>
      </div>

      {/* Friend Match Celebration Modal */}
      {matchNotification && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#1a1a1a] border border-[#333333] rounded-2xl p-6 max-w-xs w-full text-center flex flex-col items-center gap-3 shadow-2xl relative overflow-hidden">
            <div className="relative my-1">
              <img
                src="/watchmatch-icon.svg"
                alt="WatchMatch"
                className="w-16 h-16 relative z-10 animate-bounce"
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
                onClick={() => setMatchNotification(null)}
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
