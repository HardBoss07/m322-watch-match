import React, { useState } from "react";
import { FilterSettings, StreamingProvider } from "../../types";
import { AVAILABLE_AUDIO_LANGUAGES, AVAILABLE_GENRES } from "./useFilters";
import { Button, IconButton } from "../../components/ui/button";

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

  const providerConfigs: {
    id: StreamingProvider;
    name: string;
    tag: string;
    color: string;
    icon: string;
  }[] = [
    {
      id: "netflix",
      name: "Netflix",
      tag: "N",
      color: "#e50914",
      icon: "subscriptions",
    },
    { id: "disney", name: "Disney+", tag: "D+", color: "#113ccf", icon: "tv" },
    {
      id: "prime",
      name: "Prime Video",
      tag: "Prime",
      color: "#00a8e1",
      icon: "play_circle",
    },
    {
      id: "crunchyroll",
      name: "Crunchyroll",
      tag: "CR",
      color: "#f47521",
      icon: "animation",
    },
    {
      id: "apple",
      name: "Apple TV+",
      tag: "Apple",
      color: "#a3a3a3",
      icon: "tv",
    },
    {
      id: "paramount",
      name: "Paramount+",
      tag: "P+",
      color: "#0064ff",
      icon: "movie",
    },
  ];

  return (
    <div className="absolute inset-0 z-50 bg-surface overflow-y-auto flex flex-col animate-in fade-in duration-150">
      {/* Top Header */}
      <header className="sticky top-0 inset-x-0 z-30 bg-surface/90 backdrop-blur-xl border-b border-surface-bright h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconButton
            onClick={onClose}
            aria-label="Zurück"
            variant="ghost"
            size="md"
            radius="full"
            className="-ml-2 text-white hover:text-secondary"
          >
            <span className="material-symbols-outlined text-[24px]">
              arrow_back
            </span>
          </IconButton>
          <h1 className="text-sm font-bold text-white">Streaming & Filter</h1>
        </div>

        <Button
          variant="primary"
          size="sm"
          radius="md"
          onClick={handleSave}
          leftIcon={
            <span className="material-symbols-outlined text-[15px]">check</span>
          }
          className="bg-secondary text-surface hover:bg-secondary/90 font-black"
        >
          Speichern
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full p-4 gap-5 pb-24">
        {/* Intro */}
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Streaming & Präferenzen
          </h2>
          <p className="text-xs text-tertiary mt-0.5">
            Filter für dein persönliches Swipe-Match Deck
          </p>
        </div>

        {/* Section 1: Streaming Providers */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[18px] icon-filled">
                subscriptions
              </span>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Aktive Streaming-Dienste
              </h3>
            </div>
            <span className="text-[11px] font-mono text-secondary">
              {Object.values(localFilters.providers).filter(Boolean).length}{" "}
              aktiv
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {providerConfigs.map((p) => {
              const isSelected = localFilters.providers[p.id];
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggleProvider(p.id)}
                  aria-pressed={isSelected}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer text-left ${
                    isSelected
                      ? "bg-surface-container-low border-secondary shadow-md shadow-secondary/10 ring-1 ring-secondary/30"
                      : "bg-surface-container-low/70 border-surface-bright opacity-60 hover:opacity-90"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0"
                      style={{
                        backgroundColor: isSelected ? p.color : "#222222",
                      }}
                    >
                      {p.tag}
                    </div>
                    <span
                      className={`text-xs font-bold truncate ${isSelected ? "text-white" : "text-tertiary"}`}
                    >
                      {p.name}
                    </span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      isSelected
                        ? "bg-secondary text-surface shadow-sm"
                        : "bg-surface-bright text-tertiary"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[13px] font-bold">
                      {isSelected ? "check" : "remove"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 2: Audio Track / Tonspuren Multi-Select */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[18px] icon-filled">
                record_voice_over
              </span>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Tonspur & Synchronisation
              </h3>
            </div>
            <span className="text-[10px] text-tertiary">Multi-Select</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {AVAILABLE_AUDIO_LANGUAGES.map((lang) => {
              const isSelected = (localFilters.audioLanguages || []).includes(
                lang.code,
              );
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => toggleAudio(lang.code)}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-secondary-container/15 border-secondary text-secondary shadow-sm"
                      : "bg-surface-container-low border-surface-300 text-tertiary hover:text-white hover:border-surface-bright"
                  }`}
                >
                  <span className="text-sm">{lang.flag}</span>
                  <span>{lang.label}</span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[14px]">
                      check
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 3: Genres Selector Chips */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[18px] icon-filled">
                category
              </span>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Bevorzugte Genres
              </h3>
            </div>
            <span className="text-[10px] text-tertiary">
              {(localFilters.genres || []).length > 0
                ? `${localFilters.genres?.length} gewählt`
                : "Alle aktiv"}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {AVAILABLE_GENRES.map((genre) => {
              const isSelected = (localFilters.genres || []).includes(genre);
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary-container border-primary-container text-white shadow-sm"
                      : "bg-surface-100 border-surface-300 text-on-surface hover:text-white hover:border-surface-bright"
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 4: Runtime Slider & Unreleased Switch */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[18px] icon-filled">
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
                <span className="text-xs font-bold text-white">
                  Maximale Filmlänge
                </span>
                <span className="px-2 py-0.5 rounded bg-surface border border-surface-300 text-secondary font-bold text-xs font-mono">
                  {localFilters.maxRuntimeMinutes >= 210
                    ? "Kein Limit"
                    : `${localFilters.maxRuntimeMinutes} min`}
                </span>
              </div>

              <input
                type="range"
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
                className="w-full h-2 rounded-lg bg-surface-bright appearance-none accent-secondary cursor-pointer mt-1"
              />
              <div className="flex justify-between text-[10px] text-tertiary">
                <span>80 min</span>
                <span>150 min</span>
                <span>210+ min (Kein Limit)</span>
              </div>
            </div>

            {/* Unreleased Titles Switch */}
            <div
              onClick={() =>
                setLocalFilters((prev: any) => ({
                  ...prev,
                  hideUnreleased: !prev.hideUnreleased,
                }))
              }
              className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-surface-container transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-tertiary">
                  event_busy
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">
                    Unveröffentlichte Titel ausblenden
                  </span>
                  <span className="text-[10px] text-tertiary">
                    Nur sofort streambare Titel im Deck anzeigen
                  </span>
                </div>
              </div>
              <div
                className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center ${
                  localFilters.hideUnreleased
                    ? "bg-secondary justify-end"
                    : "bg-surface-200 justify-start"
                }`}
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
              size="sm"
              radius="md"
              fullWidth
              onClick={onOpenOnboarding}
              leftIcon={
                <span className="material-symbols-outlined text-[16px]">
                  restart_alt
                </span>
              }
              className="text-tertiary hover:text-white"
            >
              Präferenzen-Assistent neu starten
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
