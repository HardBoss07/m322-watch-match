import React from "react";
import { FilterSettings } from "../../types";
import { Button, ButtonIcon } from "../../components/ui/button";

interface DeckHeaderProps {
  filters: FilterSettings;
  surpriseMode: boolean;
  onOpenFilters: () => void;
  onToggleSurprise: () => void;
  onInteractionReset?: () => void;
}

/**
 * DeckHeader component:
 * Top bar of the match deck presenting active streaming providers,
 * audio language preference indicator, and random/surprise mode toggle.
 */
export const DeckHeader: React.FC<DeckHeaderProps> = ({
  filters,
  surpriseMode,
  onOpenFilters,
  onToggleSurprise,
  onInteractionReset,
}) => {
  const activeProvidersCount = Object.values(filters.providers).filter(
    Boolean,
  ).length;

  const activeProvidersSummary =
    activeProvidersCount > 0
      ? Object.entries(filters.providers)
          .filter(([, v]) => v)
          .map(([k]) =>
            k === "netflix"
              ? "Netflix"
              : k === "disney"
                ? "Disney+"
                : k === "prime"
                  ? "Prime"
                  : k === "crunchyroll"
                    ? "Crunchyroll"
                    : k,
          )
          .slice(0, 2)
          .join(", ") +
        (activeProvidersCount > 2 ? ` +${activeProvidersCount - 2}` : "")
      : "Keine Abos gewählt";

  const audioLabel =
    filters.audioLanguages && filters.audioLanguages.length > 0
      ? `Tonspur: ${filters.audioLanguages.join(", ")}`
      : filters.onlyDeAudio
        ? "Deutsche Tonspur bevorzugt"
        : "Tonspur: Alle";

  return (
    <div className="flex items-center justify-between gap-2 mt-1 shrink-0">
      <Button
        variant="secondary"
        size="sm"
        radius="full"
        onClick={() => {
          if (onInteractionReset) onInteractionReset();
          onOpenFilters();
        }}
        aria-label={`Aktive Streaming-Filter anpassen (${activeProvidersSummary}, ${audioLabel})`}
        className="h-auto min-h-[44px] py-1.5 px-3 bg-surface-container hover:bg-surface-container-high border-surface-300 justify-between text-left shadow-none group font-normal flex-1 max-w-[270px] cursor-pointer"
      >
        <div className="flex items-center gap-2 min-w-0">
          <ButtonIcon position="left" size="sm">
            <span
              className="material-symbols-outlined text-[18px] text-secondary shrink-0"
              aria-hidden="true"
            >
              tune
            </span>
          </ButtonIcon>
          <div className="flex flex-col min-w-0 leading-tight">
            <span className="text-[11px] font-semibold text-white truncate">
              {activeProvidersSummary}
            </span>
            <span className="text-[10px] text-[#d6d4d3] truncate">
              {audioLabel}
            </span>
          </div>
        </div>
      </Button>

      {/* Surprise Mode Toggle (min 44x44px hit area) */}
      <button
        type="button"
        role="switch"
        aria-checked={surpriseMode}
        aria-label="Zufallsmodus für das Match-Deck ein- oder ausschalten"
        onClick={() => {
          if (onInteractionReset) onInteractionReset();
          onToggleSurprise();
        }}
        className="flex items-center gap-2 bg-surface-container border border-surface-300 px-3 py-2 rounded-full shrink-0 min-h-[44px] cursor-pointer hover:bg-surface-container-high transition-colors"
      >
        <span
          className="material-symbols-outlined text-[18px] text-primary-container shrink-0"
          aria-hidden="true"
        >
          shuffle
        </span>
        <span className="text-[11px] font-bold text-white hidden xs:inline">
          Zufall
        </span>
        <span
          className={`w-9 h-5 rounded-full p-0.5 transition-colors flex items-center ${
            surpriseMode
              ? "bg-primary-container justify-end"
              : "bg-surface-container-highest justify-start"
          }`}
          aria-hidden="true"
        >
          <span className="w-4 h-4 rounded-full bg-white shadow-sm block transition-transform"></span>
        </span>
      </button>
    </div>
  );
};
