import React, { useState } from 'react';
import { Movie, StreamingProvider } from '../types';
import { Button, IconButton, ButtonIcon } from './ui/button';

interface WatchlistViewProps {
  movies: Movie[];
  onOpenMovieDetails: (movieId: string) => void;
  onRemoveFromWatchlist: (movieId: string) => void;
  onShareRecommendation: (movie: Movie) => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  movies,
  onOpenMovieDetails,
  onRemoveFromWatchlist,
  onShareRecommendation,
}) => {
  const [filterProvider, setFilterProvider] = useState<string>('all');

  const filtered = movies.filter((m) => {
    if (filterProvider !== 'all') {
      const matchProv = m.providers.some((p) => p.id === filterProvider);
      if (!matchProv) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full px-4 pt-3 pb-24 max-w-lg mx-auto gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Deine Watchlist</h2>
          <p className="text-xs text-[#a3a3a3] mt-0.5">{movies.length} gemerkte Titel</p>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-[#fbd100]/15 text-[#ffd405] text-xs font-bold flex items-center gap-1.5">
          <img src="/watchmatch-icon.svg" alt="" className="w-4 h-4 object-contain" />
          <span>WatchMatch Liste</span>
        </span>
      </div>

      {/* Provider Filter Chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <Button
          variant={filterProvider === 'all' ? 'primary' : 'secondary'}
          size="sm"
          radius="full"
          onClick={() => setFilterProvider('all')}
          className="font-bold shrink-0"
        >
          Alle Dienste
        </Button>
        {['netflix', 'prime', 'crunchyroll', 'apple'].map((prov) => (
          <Button
            key={prov}
            variant={filterProvider === prov ? 'primary' : 'secondary'}
            size="sm"
            radius="full"
            onClick={() => setFilterProvider(prov)}
            className="font-bold shrink-0 capitalize"
          >
            {prov === 'prime' ? 'Prime Video' : prov}
          </Button>
        ))}
      </div>

      {/* Watchlist Cards List */}
      <div className="flex flex-col gap-2.5">
        {filtered.length > 0 ? (
          filtered.map((movie) => (
            <div
              key={movie.id}
              className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-xl p-3 flex gap-3 items-center shadow-sm"
            >
              <img
                src={movie.posterUrl}
                alt={movie.title}
                onClick={() => onOpenMovieDetails(movie.id)}
                className="w-16 h-22 rounded-lg object-cover shrink-0 cursor-pointer shadow"
              />

              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <h3
                      onClick={() => onOpenMovieDetails(movie.id)}
                      className="text-xs font-bold text-white truncate cursor-pointer hover:text-[#d80b69] transition-colors"
                    >
                      {movie.title}
                    </h3>
                    <div className="flex items-center gap-0.5 text-[#ffd405] text-xs font-bold shrink-0">
                      <span className="material-symbols-outlined text-[14px] icon-filled">star</span>
                      <span>{movie.rating}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-[#a3a3a3] mt-0.5">
                    {movie.year} • {movie.genres.slice(0, 2).join(' / ')} • {movie.duration || `${movie.episodes} Episoden`}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#262626]">
                  <span className="text-[10px] text-[#ffd405] font-semibold bg-[#2a2a2a] px-2 py-0.5 rounded">
                    {movie.providers[0]?.name || 'Netflix'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <IconButton
                      onClick={() => onShareRecommendation(movie)}
                      aria-label="Freund empfehlen"
                      variant="secondary"
                      size="xs"
                      radius="md"
                      className="text-[#a3a3a3] hover:text-white"
                    >
                      <span className="material-symbols-outlined text-[15px]">send</span>
                    </IconButton>
                    <IconButton
                      onClick={() => onRemoveFromWatchlist(movie.id)}
                      aria-label="Von Watchlist entfernen"
                      variant="secondary"
                      size="xs"
                      radius="md"
                      className="text-[#a3a3a3] hover:text-[#ffb4ab]"
                    >
                      <span className="material-symbols-outlined text-[15px]">delete</span>
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl flex flex-col items-center gap-2.5">
            <img src="/watchmatch-icon.svg" alt="" className="w-10 h-10 opacity-60" />
            <span className="text-xs font-bold text-white">Keine Titel in diesem Filter</span>
            <p className="text-[11px] text-[#a3a3a3]">Swipen im Match-Deck fügt Titel automatisch hier hinzu.</p>
          </div>
        )}
      </div>
    </div>
  );
};
