import React, { useState } from "react";
import { Movie } from "../types";
import { Button, IconButton } from "./ui/button";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState<string>("Alle");

  const moods = ["Alle", "Sci-Fi", "Anime", "Thriller", "Action", "Mystery"];

  const filteredMovies = movies.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesMood =
      selectedMood === "Alle" ||
      m.genres.some((g) => g.toLowerCase() === selectedMood.toLowerCase());
    return matchesSearch && matchesMood;
  });

  return (
    <div className="flex flex-col w-full px-4 pt-3 pb-24 max-w-lg mx-auto gap-4">
      {/* Search Bar */}
      <div className="relative flex items-center">
        <label htmlFor="discover-search-input" className="sr-only">
          Filme, Serien, Anime durchsuchen
        </label>
        <span
          className="material-symbols-outlined absolute left-3.5 text-[#d6d4d3] text-[20px]"
          aria-hidden="true"
        >
          search
        </span>
        <input
          id="discover-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filme, Serien, Anime durchsuchen..."
          className="w-full h-12 pl-11 pr-11 rounded-xl bg-surface-container-low border border-surface-300 text-xs text-white placeholder:text-[#d6d4d3] outline-none focus:border-primary-container"
        />
        {searchQuery && (
          <div className="absolute right-1.5">
            <IconButton
              onClick={() => setSearchQuery("")}
              aria-label="Sucheingabe löschen"
              variant="ghost"
              size="xs"
              radius="full"
              className="text-[#d6d4d3] hover:text-white min-w-[44px] min-h-[44px]"
            >
              <span className="material-symbols-outlined text-[18px]">
                close
              </span>
            </IconButton>
          </div>
        )}
      </div>

      {/* Mood Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {moods.map((mood) => (
          <Button
            key={mood}
            variant={selectedMood === mood ? "accent" : "secondary"}
            size="sm"
            radius="full"
            onClick={() => setSelectedMood(mood)}
            className="whitespace-nowrap font-bold shrink-0 min-h-[44px] px-4"
          >
            {mood}
          </Button>
        ))}
      </div>

      {/* Curated Row: Beliebt bei Freunden */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-secondary text-[18px] icon-filled"
              aria-hidden="true"
            >
              local_fire_department
            </span>
            <span>Beliebt bei Freunden</span>
          </span>
          <span className="text-[11px] text-secondary font-bold">
            90%+ Match
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {movies.slice(0, 4).map((m) => (
            <div
              key={m.id}
              role="button"
              tabIndex={0}
              aria-label={`Filmdetails öffnen: ${m.title}`}
              onClick={() => onOpenMovieDetails(m.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpenMovieDetails(m.id);
                }
              }}
              className="flex-shrink-0 w-32 bg-surface-100 border border-surface-300 hover:border-surface-bright rounded-xl overflow-hidden shadow-md cursor-pointer transition-transform active:scale-95"
            >
              <div className="relative aspect-[3/4.2] overflow-hidden">
                <img
                  src={m.posterUrl}
                  alt={`Poster von ${m.title}`}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-1.5 left-1.5 bg-black/85 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  {m.providers[0]?.name || "Netflix"}
                </span>
                <span className="absolute bottom-1.5 right-1.5 bg-secondary-container text-on-secondary-container text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  ★ {m.rating}
                </span>
              </div>
              <div className="p-2.5">
                <h4
                  title={m.title}
                  className="text-xs font-bold text-white line-clamp-2 leading-tight break-words"
                >
                  {m.title}
                </h4>
                <span className="text-[10px] text-[#d6d4d3] block mt-1">
                  {m.year} • {m.genres[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Curated Row: Top Deutsche Synchronisation */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-primary-container text-[18px]"
              aria-hidden="true"
            >
              record_voice_over
            </span>
            <span>Deutsche Synchronisation</span>
          </span>
          <Button
            variant="ghost"
            size="sm"
            radius="md"
            onClick={onOpenFilters}
            className="p-2 min-h-[44px] text-xs text-[#d6d4d3] hover:text-white font-bold"
          >
            Filter anpassen
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {filteredMovies.map((m) => (
            <div
              key={m.id}
              role="button"
              tabIndex={0}
              aria-label={`Filmdetails öffnen: ${m.title}`}
              onClick={() => onOpenMovieDetails(m.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpenMovieDetails(m.id);
                }
              }}
              className="bg-surface-100 border border-surface-300 hover:border-surface-bright rounded-xl p-2.5 flex gap-2.5 items-center cursor-pointer shadow-sm transition-all active:scale-[0.98] min-h-[64px]"
            >
              <img
                src={m.posterUrl}
                alt={`Poster von ${m.title}`}
                className="w-14 h-20 rounded-lg object-cover shrink-0"
              />
              <div className="flex flex-col min-w-0 justify-center flex-1">
                <span
                  title={m.title}
                  className="text-xs font-bold text-white line-clamp-2 leading-tight break-words"
                >
                  {m.title}
                </span>
                <span className="text-[10px] text-[#d6d4d3] mt-1">
                  {m.year} • {m.genres[0]}
                </span>
                <div className="flex items-center gap-1 text-secondary text-[10px] font-bold mt-1">
                  <span>★ {m.rating}</span>
                  <span className="text-[#d6d4d3] font-normal">
                    • {m.providers[0]?.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
