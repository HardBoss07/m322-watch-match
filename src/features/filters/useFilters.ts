import { useState, useCallback } from "react";
import { FilterSettings, StreamingProvider } from "../../types";
import { INITIAL_FILTERS } from "../../data/mockData";

export const AVAILABLE_AUDIO_LANGUAGES = [
  { code: "DE", label: "Deutsch (DE)", flag: "🇩🇪" },
  { code: "EN", label: "Englisch (EN)", flag: "🇬🇧" },
  { code: "JA", label: "Japanisch (JA)", flag: "🇯🇵" },
  { code: "FR", label: "Französisch (FR)", flag: "🇫🇷" },
  { code: "ES", label: "Spanisch (ES)", flag: "🇪🇸" },
];

export const AVAILABLE_GENRES = [
  "Sci-Fi",
  "Action",
  "Anime",
  "Dystopie",
  "Drama",
  "Abenteuer",
  "Mystery",
  "Horror",
];

export function useFilters(initial: FilterSettings = INITIAL_FILTERS) {
  const [filters, setFilters] = useState<FilterSettings>({
    ...initial,
    audioLanguages: initial.audioLanguages || ["DE"],
    genres: initial.genres || [],
  });

  const toggleProvider = useCallback((provider: StreamingProvider) => {
    setFilters((prev) => ({
      ...prev,
      providers: {
        ...prev.providers,
        [provider]: !prev.providers[provider],
      },
    }));
  }, []);

  const toggleAudioLanguage = useCallback((code: string) => {
    setFilters((prev) => {
      const current = prev.audioLanguages || ["DE"];
      const next = current.includes(code)
        ? current.filter((c) => c !== code)
        : [...current, code];
      // Keep onlyDeAudio synced: true if only DE is selected or DE is in selection
      return {
        ...prev,
        audioLanguages: next.length > 0 ? next : ["DE"],
        onlyDeAudio: next.length === 1 && next[0] === "DE",
      };
    });
  }, []);

  const toggleGenre = useCallback((genre: string) => {
    setFilters((prev) => {
      const current = prev.genres || [];
      const next = current.includes(genre)
        ? current.filter((g) => g !== genre)
        : [...current, genre];
      return {
        ...prev,
        genres: next,
      };
    });
  }, []);

  const setMaxRuntime = useCallback((runtime: number) => {
    setFilters((prev) => ({
      ...prev,
      maxRuntimeMinutes: runtime,
    }));
  }, []);

  const toggleHideUnreleased = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      hideUnreleased: !prev.hideUnreleased,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  return {
    filters,
    setFilters,
    toggleProvider,
    toggleAudioLanguage,
    toggleGenre,
    setMaxRuntime,
    toggleHideUnreleased,
    resetFilters,
  };
}
