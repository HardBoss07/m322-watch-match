import React, { useState } from "react";
import { FilterSettings, StreamingProvider } from "../../types";
import { Button, IconButton } from "../../components/ui/button";
import { ProviderFilterGrid } from "./ProviderFilterGrid";
import { AudioLanguageFilter } from "./AudioLanguageFilter";
import { GenreFilterGrid } from "./GenreFilterGrid";

interface StreamingFiltersProps {
  filters: FilterSettings;
  onSave: (newFilters: FilterSettings) => void;
  onClose: () => void;
  onOpenOnboarding?: () => void;
}

export const StreamingFilters: React.FC<StreamingFiltersProps> = ({
  filters,
  onSave,
  onClose,
  onOpenOnboarding,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterSettings>({
    ...filters,
    audioLanguages: filters.audioLanguages || ["DE"],
    genres: filters.genres || [],
  });

  const toggleProvider = (p: StreamingProvider) => {
    setLocalFilters((prev: any) => ({
      ...prev,
      providers: {
        ...prev.providers,
        [p]: !prev.providers[p],
      },
    }));
  };

  const toggleAudio = (code: string) => {
    setLocalFilters((prev: any) => {
      const current = prev.audioLanguages || ["DE"];
      const next = current.includes(code)
        ? current.filter((c: string) => c !== code)
        : [...current, code];
      return {
        ...prev,
        audioLanguages: next.length > 0 ? next : ["DE"],
        onlyDeAudio: next.length === 1 && next[0] === "DE",
      };
    });
  };

  const toggleOnlyDeAudio = () => {
    setLocalFilters((prev: any) => ({
      ...prev,
      onlyDeAudio: !prev.onlyDeAudio,
      audioLanguages: !prev.onlyDeAudio ? ["DE"] : prev.audioLanguages,
    }));
  };

  const toggleGenre = (genre: string) => {
    setLocalFilters((prev: any) => {
      const current = prev.genres || [];
      const next = current.includes(genre)
        ? current.filter((g: string) => g !== genre)
        : [...current, genre];
      return {
        ...prev,
        genres: next,
      };
    });
  };

  const handleSave = () => {
    onSave(localFilters);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="filters-title"
      className="absolute inset-0 z-50 bg-surface overflow-y-auto flex flex-col animate-in fade-in duration-150"
    >
      {/* Top Header */}
      <header className="sticky top-0 inset-x-0 z-30 bg-surface/90 backdrop-blur-xl border-b border-surface-bright h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconButton
            onClick={onClose}
            aria-label="Zurück zum Match-Deck"
            variant="ghost"
            size="md"
            radius="full"
            className="-ml-2 text-white hover:text-secondary min-w-[44px] min-h-[44px]"
          >
            <span className="material-symbols-outlined text-[24px]">
              arrow_back
            </span>
          </IconButton>
          <h1 id="filters-title" className="text-sm font-bold text-white">
            Streaming & Filter
          </h1>
        </div>

        <Button
          variant="primary"
          size="sm"
          radius="md"
          onClick={handleSave}
          leftIcon={
            <span className="material-symbols-outlined text-[16px] font-bold">
              check
            </span>
          }
          className="bg-secondary text-surface hover:bg-secondary/90 font-black min-h-[44px] px-4"
        >
          Speichern
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full p-4 gap-6 pb-24">
        {/* Intro */}
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Deine Streaming-DNA
          </h2>
          <p className="text-xs text-[#d6d4d3] mt-0.5">
            Filter für dein persönliches Swipe-Match Deck
          </p>
        </div>

        {/* Section 1: Streaming Providers Grid */}
        <ProviderFilterGrid
          providers={localFilters.providers}
          onToggleProvider={toggleProvider}
        />

        {/* Section 2: Audio Track / Tonspuren Multi-Select */}
        <AudioLanguageFilter
          audioLanguages={localFilters.audioLanguages || ["DE"]}
          onlyDeAudio={Boolean(localFilters.onlyDeAudio)}
          onToggleAudioLanguage={toggleAudio}
          onToggleOnlyDeAudio={toggleOnlyDeAudio}
        />

        {/* Section 3: Genres Selector Chips */}
        <GenreFilterGrid
          genres={localFilters.genres || []}
          onToggleGenre={toggleGenre}
        />

        {/* Section 4: Runtime Slider & Unreleased Switch */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-secondary text-[18px] icon-filled"
              aria-hidden="true"
            >
              timelapse
            </span>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Laufzeit & Verfügbarkeit
            </h3>
          </div>

          <div className="flex flex-col bg-surface-container-low border border-surface-300 rounded-xl overflow-hidden divide-y divide-surface-bright">
            {/* Runtime Slider */}
            <div className="p-3.5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="filter-max-runtime"
                  className="text-xs font-bold text-white"
                >
                  Maximale Filmlänge
                </label>
                <span className="px-2 py-0.5 rounded bg-surface border border-surface-300 text-secondary font-bold text-xs font-mono">
                  {localFilters.maxRuntimeMinutes >= 210
                    ? "Kein Limit"
                    : `${localFilters.maxRuntimeMinutes} min`}
                </span>
              </div>

              <input
                id="filter-max-runtime"
                type="range"
                aria-label="Maximale Filmlänge in Minuten"
                min={80}
                max={210}
                step={10}
                value={localFilters.maxRuntimeMinutes}
                onChange={(e) =>
                  setLocalFilters((prev: any) => ({
                    ...prev,
                    maxRuntimeMinutes: parseInt(e.target.value, 10),
                  }))
                }
                className="w-full h-3 rounded-lg bg-surface-bright appearance-none accent-secondary cursor-pointer mt-1 min-h-[30px]"
              />
              <div className="flex justify-between text-[11px] text-[#d6d4d3]">
                <span>80 min</span>
                <span>150 min</span>
                <span>210+ min (Kein Limit)</span>
              </div>
            </div>

            {/* Unreleased Titles Switch */}
            <div
              role="switch"
              tabIndex={0}
              aria-checked={Boolean(localFilters.hideUnreleased)}
              aria-label="Unveröffentlichte Titel ausblenden: Nur sofort streambare Titel anzeigen"
              onClick={() =>
                setLocalFilters((prev: any) => ({
                  ...prev,
                  hideUnreleased: !prev.hideUnreleased,
                }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setLocalFilters((prev: any) => ({
                    ...prev,
                    hideUnreleased: !prev.hideUnreleased,
                  }));
                }
              }}
              className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-surface-container transition-colors min-h-[56px]"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="material-symbols-outlined text-[20px] text-secondary"
                  aria-hidden="true"
                >
                  event_busy
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">
                    Unveröffentlichte Titel ausblenden
                  </span>
                  <span className="text-[11px] text-[#d6d4d3]">
                    Nur sofort streambare Titel im Deck anzeigen
                  </span>
                </div>
              </div>
              <div
                className={`w-12 h-7 rounded-full p-1 transition-colors flex items-center min-w-[48px] min-h-[44px] ${
                  localFilters.hideUnreleased
                    ? "bg-secondary justify-end"
                    : "bg-surface-200 justify-start"
                }`}
                aria-hidden="true"
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-md"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Onboarding trigger */}
        {onOpenOnboarding && (
          <div className="pt-1">
            <Button
              variant="outline"
              size="md"
              radius="md"
              fullWidth
              onClick={onOpenOnboarding}
              leftIcon={
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  restart_alt
                </span>
              }
              className="text-[#d6d4d3] hover:text-white min-h-[44px] font-bold"
            >
              Präferenzen-Assistent neu starten
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
