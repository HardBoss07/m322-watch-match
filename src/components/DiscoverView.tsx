import React, { useState } from 'react';
import { Movie } from '../types';
import { Button, IconButton, ButtonIcon } from './ui/button';

interface DiscoverViewProps {
  movies: Movie[];
  onOpenMovieDetails: (movieId: string) => void;
  onOpenFilters: () => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  movies,
  onOpenMovieDetails,
  onOpenFilters,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('Alle');

  const moods = ['Alle', 'Sci-Fi', 'Anime', 'Thriller', 'Action', 'Mystery'];

  const filteredMovies = movies.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesMood =
      selectedMood === 'Alle' || m.genres.some((g) => g.toLowerCase() === selectedMood.toLowerCase());
    return matchesSearch && matchesMood;
  });

  return (
    <div className="flex flex-col w-full px-4 pt-3 pb-24 max-w-lg mx-auto gap-4">
      {/* Search Bar */}
      <div className="relative flex items-center">
        <span className="material-symbols-outlined absolute left-3.5 text-[#737373] text-[20px]">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filme, Serien, Anime durchsuchen..."
          className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] text-xs text-white placeholder:text-[#737373] outline-none focus:border-[#d80b69]"
        />
        {searchQuery && (
          <div className="absolute right-2">
            <IconButton
              onClick={() => setSearchQuery('')}
              aria-label="Suche löschen"
              variant="ghost"
              size="xs"
              radius="full"
              className="text-[#737373] hover:text-white"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </IconButton>
          </div>
        )}
      </div>

      {/* Mood Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {moods.map((mood) => (
          <Button
            key={mood}
            variant={selectedMood === mood ? 'accent' : 'secondary'}
            size="sm"
            radius="full"
            onClick={() => setSelectedMood(mood)}
            className="whitespace-nowrap font-bold shrink-0"
          >
            {mood}
          </Button>
        ))}
      </div>

      {/* Curated Row: Beliebt bei Freunden */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#ffd405] text-[18px] icon-filled">
              local_fire_department
            </span>
            <span>Beliebt bei Freunden</span>
          </span>
          <span className="text-[10px] text-[#ffd405] font-semibold">90%+ Match</span>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {movies.slice(0, 4).map((m) => (
            <div
              key={m.id}
              onClick={() => onOpenMovieDetails(m.id)}
              className="flex-shrink-0 w-32 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-xl overflow-hidden shadow-md cursor-pointer transition-transform active:scale-95"
            >
              <div className="relative aspect-[3/4.2] overflow-hidden">
                <img
                  src={m.posterUrl}
                  alt={m.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-1.5 left-1.5 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                  {m.providers[0]?.name || 'Netflix'}
                </span>
                <span className="absolute bottom-1.5 right-1.5 bg-[#fbd100] text-[#3b2f00] text-[9px] font-black px-1.5 py-0.2 rounded flex items-center gap-0.5">
                  ★ {m.rating}
                </span>
              </div>
              <div className="p-2">
                <h4 className="text-xs font-bold text-white truncate">{m.title}</h4>
                <span className="text-[10px] text-[#a3a3a3] block mt-0.5">{m.year} • {m.genres[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Curated Row: Top Deutsche Synchronisation */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#d80b69] text-[18px]">
              record_voice_over
            </span>
            <span>Deutsche Synchronisation</span>
          </span>
          <Button
            variant="ghost"
            size="sm"
            radius="md"
            onClick={onOpenFilters}
            className="p-1 h-auto text-[10px] text-[#a3a3a3] hover:text-white"
          >
            Filter anpassen
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {filteredMovies.map((m) => (
            <div
              key={m.id}
              onClick={() => onOpenMovieDetails(m.id)}
              className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-xl p-2 flex gap-2.5 items-center cursor-pointer shadow-sm transition-all active:scale-[0.98]"
            >
              <img
                src={m.posterUrl}
                alt={m.title}
                className="w-14 h-20 rounded-lg object-cover shrink-0"
              />
              <div className="flex flex-col min-w-0 justify-center">
                <span className="text-xs font-bold text-white truncate">{m.title}</span>
                <span className="text-[10px] text-[#a3a3a3] mt-0.5">{m.year} • {m.genres[0]}</span>
                <div className="flex items-center gap-1 text-[#ffd405] text-[10px] font-bold mt-1">
                  <span>★ {m.rating}</span>
                  <span className="text-[#737373] font-normal">• {m.providers[0]?.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
