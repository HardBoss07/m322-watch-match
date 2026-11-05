import React from "react";
import { AVAILABLE_GENRES } from "./useFilters";

interface GenreFilterGridProps {
  genres: string[];
  onToggleGenre: (genre: string) => void;
}

/**
 * GenreFilterGrid:
 * Subcomponent for genre selection.
 * Addresses UX writing finding: "Wähle mindestens 2 Genres"
 * Enforces 44x44px minimum interactive touch targets.
 */
export const GenreFilterGrid: React.FC<GenreFilterGridProps> = ({
  genres,
  onToggleGenre,
}) => {
  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span
            className="material-symbols-outlined text-secondary text-[18px] icon-filled"
            aria-hidden="true"
          >
            category
          </span>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Bevorzugte Genres
          </h3>
        </div>
        <span className="text-[11px] text-secondary font-bold">
          Wähle mindestens 2 Genres
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {AVAILABLE_GENRES.map((genre) => {
          const isSelected = genres.includes(genre);
          return (
            <button
              key={genre}
              type="button"
              onClick={() => onToggleGenre(genre)}
              aria-pressed={isSelected}
              className={`px-3.5 py-2.5 min-h-[44px] rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? "bg-primary-container border-primary-container text-white shadow-md"
                  : "bg-surface-100 border-surface-300 text-[#d6d4d3] hover:text-white hover:border-surface-bright"
              }`}
            >
              <span>{genre}</span>
              {isSelected && (
                <span
                  className="material-symbols-outlined text-[15px] font-bold"
                  aria-hidden="true"
                >
                  check
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};
