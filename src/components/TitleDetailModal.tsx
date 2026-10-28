import React, { useState } from 'react';
import { Movie } from '../types';
import { Button, IconButton, ButtonIcon } from './ui/button';

interface TitleDetailModalProps {
  movie: Movie;
  onClose: () => void;
  onAddToWatchlist: (movie: Movie) => void;
  onShareRecommendation: (movie: Movie) => void;
  isSaved?: boolean;
}

export const TitleDetailModal: React.FC<TitleDetailModalProps> = ({
  movie,
  onClose,
  onAddToWatchlist,
  onShareRecommendation,
  isSaved = false,
}) => {
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'episodes' | 'reviews'>('info');

  const episodes = [
    { ep: 1, title: 'Let You Down', runtime: '24 Min.', desc: 'David schlägt sich durch die Straßen von Santo Domingo, während seine Mutter für seine Bildung schuftet.' },
    { ep: 2, title: 'Like a Boy', runtime: '25 Min.', desc: 'Nach einer schweren Tragödie lässt David sich das experimentelle Sandevistan-Implantat einsetzen.' },
    { ep: 3, title: 'Smooth Criminal', runtime: '23 Min.', desc: 'David trifft auf Lucy und wird in die gefährliche Welt der Edgerunners eingeführt.' },
    { ep: 4, title: 'Lucky You', runtime: '24 Min.', desc: 'Maine nimmt David unter seine Fittiche für einen riskanten Raubzug auf ein Konzerndepot.' },
  ];

  return (
    <div className="absolute inset-0 z-50 bg-[#131313] overflow-y-auto flex flex-col animate-in fade-in duration-150">
      {/* Fixed Sticky Header */}
      <header className="sticky top-0 inset-x-0 z-30 bg-[#131313]/90 backdrop-blur-xl border-b border-[#262626] h-14 px-4 flex items-center justify-between">
        <IconButton
          onClick={onClose}
          aria-label="Zurück"
          variant="ghost"
          size="md"
          radius="full"
          className="-ml-2 text-white hover:text-[#d80b69]"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </IconButton>

        <h1 className="text-sm font-bold text-white truncate max-w-[200px]">
          {movie.title}
        </h1>

        <div className="flex items-center gap-1">
          <IconButton
            onClick={() => onShareRecommendation(movie)}
            aria-label="Filmtipp teilen"
            variant="ghost"
            size="md"
            radius="full"
            className="text-[#a3a3a3] hover:text-white"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </IconButton>
          <IconButton
            onClick={onClose}
            aria-label="Schließen"
            variant="ghost"
            size="md"
            radius="full"
            className="text-[#a3a3a3] hover:text-white"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </IconButton>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full pb-24">
        {/* Hero Trailer / Backdrop Container */}
        <div className="relative w-full aspect-video bg-[#0e0e0e] overflow-hidden shadow-2xl flex items-center justify-center">
          {isPlayingTrailer ? (
            <div className="w-full h-full relative">
              <iframe
                src={`${movie.trailerUrl || 'https://www.youtube-nocookie.com/embed/JtqIas3bYhg'}?autoplay=1`}
                title={`${movie.title} Trailer`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <button
                onClick={() => setIsPlayingTrailer(false)}
                className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded text-white text-[11px] font-bold z-10"
              >
                Schließen ✕
              </button>
            </div>
          ) : (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/30 to-transparent pointer-events-none"></div>

              {/* Teaser Badge */}
              <div className="absolute top-3 left-4 flex items-center gap-1.5 px-2.5 py-1 bg-[#201f1f]/80 rounded-full shadow-md backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#d80b69] animate-pulse"></span>
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                  Offizieller Teaser
                </span>
              </div>

              {/* Play Trigger */}
              <IconButton
                onClick={() => setIsPlayingTrailer(true)}
                aria-label="Trailer abspielen"
                variant="primary"
                size="xl"
                radius="full"
                className="relative z-10 w-16 h-16 min-w-[64px] min-h-[64px] shadow-xl"
              >
                <span className="material-symbols-outlined text-[36px] ml-0.5 icon-filled">
                  play_arrow
                </span>
              </IconButton>

              {/* Quality & Audio Badges */}
              <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-[#201f1f]/90 text-white font-bold text-[10px] rounded border border-[#333333]">
                  4K HDR
                </span>
                <span className="px-2 py-0.5 bg-[#201f1f]/90 text-white font-bold text-[10px] rounded border border-[#333333]">
                  5.1 SURROUND
                </span>
              </div>
            </>
          )}
        </div>

        {/* Primary Details Block */}
        <div className="px-4 flex flex-col gap-4 -mt-2 relative z-20">
          {/* Header Metadata Row */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 bg-[#2a2a2a] text-[#ffb1c3] text-xs font-bold rounded">
                {movie.type === 'series' ? 'ANIME-SERIE' : 'SPIELFILM'}
              </span>
              <span className="text-[#737373] text-xs">•</span>
              <span className="text-white text-xs font-medium">{movie.year}</span>
              <span className="text-[#737373] text-xs">•</span>
              <span className="px-1.5 py-0.5 bg-[#201f1f] border border-[#3a3a3a] text-white text-[10px] font-bold rounded">
                {movie.fsk || 'FSK 16'}
              </span>
              <span className="text-[#737373] text-xs">•</span>
              <span className="text-[#a3a3a3] text-xs">{movie.duration || `${movie.episodes} Episoden`}</span>
            </div>

            <div className="flex items-start justify-between gap-3 mt-1">
              <h2 className="text-2xl font-black text-white tracking-tight">{movie.title}</h2>
              <div className="flex items-center gap-1 bg-[#201f1f] border border-[#3a3a3a] px-2.5 py-1 rounded-full shrink-0">
                <span className="material-symbols-outlined text-[16px] text-[#ffd405] icon-filled">star</span>
                <span className="text-sm text-[#ffd405] font-bold">{movie.rating}</span>
                <span className="text-[10px] text-[#737373]">/10</span>
              </div>
            </div>

            {movie.studio && (
              <span className="text-xs text-[#a3a3a3] font-medium">
                {movie.studio} {movie.director ? `• Regie: ${movie.director}` : ''}
              </span>
            )}
          </div>

          {/* Taste Match Banner */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-[#201f1f] via-[#2a2a2a] to-[#201f1f] border border-[#ffd405]/30 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#fbd100]/20 text-[#ffd405] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] icon-filled">bolt</span>
              </div>
              <div>
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <span className="text-[#ffd405]">{movie.matchScore || 94}% Streaming-Match</span> mit deinen Freunden
                </span>
                <p className="text-[11px] text-[#a3a3a3]">Dario M. & Elena C. haben diesen Titel mit 10/10 bewertet</p>
              </div>
            </div>
          </div>

          {/* Streaming Availability Cards */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#d80b69]">tv</span>
              Verfügbar im Streaming-Abo
            </span>
            <div className="grid grid-cols-1 gap-2">
              {movie.providers.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white ${
                        p.id === 'netflix'
                          ? 'bg-[#e50914]'
                          : p.id === 'prime'
                          ? 'bg-[#00a8e1]'
                          : p.id === 'crunchyroll'
                          ? 'bg-[#f47521]'
                          : 'bg-[#2a2a2a]'
                      }`}
                    >
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{p.name}</span>
                      <span className="text-[11px] text-[#a3a3a3]">
                        {p.quality} • {p.audio.join(', ')}
                      </span>
                    </div>
                  </div>

                  <a
                    href="#watch"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Öffne ${movie.title} auf ${p.name}...`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#2a2a2a] hover:bg-[#353534] text-white font-semibold text-xs transition-colors flex items-center gap-1"
                  >
                    <span>Streamen</span>
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Segmented Sub-Tabs: Info, Episoden, Reviews */}
          <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded-xl border border-[#262626] mt-1">
            <Button
              variant={activeTab === 'info' ? 'primary' : 'ghost'}
              size="sm"
              radius="md"
              onClick={() => setActiveTab('info')}
              className={`flex-1 font-bold ${
                activeTab === 'info' ? 'text-white' : 'text-[#a3a3a3] hover:text-white'
              }`}
            >
              Übersicht
            </Button>
            {movie.type === 'series' && (
              <Button
                variant={activeTab === 'episodes' ? 'primary' : 'ghost'}
                size="sm"
                radius="md"
                onClick={() => setActiveTab('episodes')}
                className={`flex-1 font-bold ${
                  activeTab === 'episodes' ? 'text-white' : 'text-[#a3a3a3] hover:text-white'
                }`}
              >
                Episoden (10)
              </Button>
            )}
            <Button
              variant={activeTab === 'reviews' ? 'primary' : 'ghost'}
              size="sm"
              radius="md"
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 font-bold ${
                activeTab === 'reviews' ? 'text-white' : 'text-[#a3a3a3] hover:text-white'
              }`}
            >
              Freunde-Kritiken
            </Button>
          </div>

          {/* Tab Content 1: Info / Synopsis / Cast */}
          {activeTab === 'info' && (
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-xs font-bold text-white block mb-1">Handlung</span>
                <p className="text-xs text-[#d4d4d4] leading-relaxed bg-[#1a1a1a] p-3 rounded-xl border border-[#262626]">
                  {movie.synopsis}
                </p>
              </div>

              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-white block mb-1.5">Hauptbesetzung</span>
                  <div className="flex flex-wrap gap-1.5">
                    {movie.cast.map((actor, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-full bg-[#1c1b1b] border border-[#2a2a2a] text-xs text-[#e5e2e1]"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-xs font-bold text-white block mb-1.5">Genre & Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {movie.genres.map((g, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#201f1f] text-xs text-[#a3a3a3] font-medium"
                    >
                      #{g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 2: Episodes */}
          {activeTab === 'episodes' && (
            <div className="flex flex-col gap-2">
              {episodes.map((ep) => (
                <div
                  key={ep.ep}
                  className="p-3 rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      Folge {ep.ep}: {ep.title}
                    </span>
                    <span className="text-[10px] text-[#737373] font-mono">{ep.runtime}</span>
                  </div>
                  <p className="text-[11px] text-[#a3a3a3] leading-relaxed">{ep.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tab Content 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="flex flex-col gap-2.5">
              <div className="p-3 rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#d80b69] flex items-center justify-center font-bold text-xs text-white">
                      D
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Dario M.</span>
                      <span className="text-[10px] text-[#a3a3a3]">@dario_cineaste • vor 2 Tagen</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#ffd405]">★ 10/10</span>
                </div>
                <p className="text-xs text-[#e5e2e1] bg-[#121212] p-2 rounded-lg italic">
                  «Unglaubliche Animationen & Sounddesign! Das Ende trifft einen wie ein Schlag.»
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-0 inset-x-0 bg-[#131313]/95 backdrop-blur-xl border-t border-[#262626] p-3 z-40 mt-auto">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          <Button
            variant={isSaved ? 'accent' : 'primary'}
            size="lg"
            radius="md"
            onClick={() => onAddToWatchlist(movie)}
            className="flex-1 font-bold text-xs shadow-lg"
            leftIcon={
              <span className="material-symbols-outlined text-[18px]">
                {isSaved ? 'bookmark_added' : 'bookmark_add'}
              </span>
            }
          >
            {isSaved ? 'Auf deiner Watchlist' : 'Zur Watchlist hinzufügen'}
          </Button>

          <IconButton
            onClick={() => onShareRecommendation(movie)}
            aria-label="Tipp an Freunde senden"
            variant="secondary"
            size="lg"
            radius="md"
            className="w-12 h-12 min-w-[48px] min-h-[48px]"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </IconButton>
        </div>
      </div>
    </div>
  );
};
