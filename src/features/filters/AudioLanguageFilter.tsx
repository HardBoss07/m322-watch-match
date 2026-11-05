import React from "react";
import { AVAILABLE_AUDIO_LANGUAGES } from "./useFilters";

interface AudioLanguageFilterProps {
  audioLanguages: string[];
  onlyDeAudio: boolean;
  onToggleAudioLanguage: (code: string) => void;
  onToggleOnlyDeAudio?: () => void;
}

/**
 * AudioLanguageFilter:
 * Sub-component for synchronisation and audio track preferences.
 * Implements WCAG 2.1 AA 44x44px touch targets and clear UX microcopy:
 * "Deutsche Tonspur bevorzugen" & "Nur Titel mit deutscher Tonspur anzeigen".
 */
export const AudioLanguageFilter: React.FC<AudioLanguageFilterProps> = ({
  audioLanguages,
  onlyDeAudio,
  onToggleAudioLanguage,
  onToggleOnlyDeAudio,
}) => {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span
            className="material-symbols-outlined text-secondary text-[18px] icon-filled"
            aria-hidden="true"
          >
            record_voice_over
          </span>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Tonspur & Synchronisation
          </h3>
        </div>
        <span className="text-[11px] text-[#d6d4d3] font-medium">
          Multi-Select
        </span>
      </div>

      {/* Language Pills with minimum 44px touch height */}
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_AUDIO_LANGUAGES.map((lang) => {
          const isSelected = audioLanguages.includes(lang.code);
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => onToggleAudioLanguage(lang.code)}
              aria-pressed={isSelected}
              className={`px-3.5 py-2.5 min-h-[44px] rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isSelected
                  ? "bg-secondary-container/20 border-secondary text-secondary shadow-sm"
                  : "bg-surface-container-low border-surface-300 text-[#d6d4d3] hover:text-white hover:border-surface-bright"
              }`}
            >
              <span className="text-base" aria-hidden="true">
                {lang.flag}
              </span>
              <span>{lang.label}</span>
              {isSelected && (
                <span
                  className="material-symbols-outlined text-[16px] text-secondary font-bold"
                  aria-hidden="true"
                >
                  check
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Fast Toggle: Deutsche Tonspur bevorzugen */}
      {onToggleOnlyDeAudio && (
        <div className="p-3 rounded-xl bg-surface-container-low border border-surface-300 flex items-center justify-between min-h-[50px]">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white">
              Deutsche Tonspur bevorzugen
            </span>
            <span className="text-[11px] text-[#d6d4d3]">
              Nur Titel mit deutscher Tonspur anzeigen
            </span>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={onlyDeAudio}
            aria-label="Nur Titel mit deutscher Tonspur anzeigen"
            onClick={onToggleOnlyDeAudio}
            className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer flex items-center min-w-[48px] min-h-[44px] ${
              onlyDeAudio
                ? "bg-primary-container justify-end"
                : "bg-surface-bright justify-start"
            }`}
          >
            <div
              className="w-5 h-5 rounded-full bg-white shadow-md"
              aria-hidden="true"
            ></div>
          </button>
        </div>
      )}
    </section>
  );
};
