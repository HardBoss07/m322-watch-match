import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { EXTENDED_WATCH_HISTORY } from "./useProfile";

interface ProfileHistoryListProps {
  watches: any[];
  activeTab: "history" | "watchlist" | "reviews";
  onOpenMovieDetails?: (movieId: string) => void;
  notify: (msg: string) => void;
}

export const ProfileHistoryList: React.FC<ProfileHistoryListProps> = ({
  watches,
  activeTab,
  onOpenMovieDetails,
  notify,
}) => {
  const [isHistoryExpanded, setIsHistoryExpanded] = useState<boolean>(false);

  const displayedWatches = isHistoryExpanded
    ? [...watches, ...EXTENDED_WATCH_HISTORY]
    : watches;

  return (
    <div className="px-4 mt-3 flex flex-col gap-2.5">
      <div className="flex items-center justify-between pb-1">
        <span className="text-xs font-bold text-white">
          {activeTab === "history"
            ? "Zuletzt gesehen"
            : activeTab === "watchlist"
              ? "Gespeicherte Titel"
              : "Veröffentlichte Reviews"}
        </span>
        <span className="text-[11px] text-secondary font-mono font-bold">
          {displayedWatches.length}{" "}
          {activeTab === "history" ? "Einträge" : "Titel"}
        </span>
      </div>

      {displayedWatches.map((item: any, idx: number) => (
        <button
          key={`${item.movieId}-${idx}`}
          type="button"
          onClick={() => onOpenMovieDetails && onOpenMovieDetails(item.movieId)}
          aria-label={`Filmdetails öffnen: ${item.title}`}
          className="bg-surface-100 border border-surface-300 hover:border-surface-bright rounded-xl p-3 flex gap-3 items-center cursor-pointer transition-colors shadow-sm text-left w-full min-h-[56px]"
        >
          <div className="relative w-16 h-22 rounded-lg overflow-hidden shrink-0 bg-black">
            <img
              src={item.poster}
              alt={`Poster von ${item.title}`}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-1 left-1 bg-black/85 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              {item.provider}
            </span>
            <span className="absolute bottom-1 left-1 bg-black/85 text-[#d6d4d3] text-[9px] px-1 py-0.5 rounded font-mono font-bold">
              {item.audio}
            </span>
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div>
              <div className="flex items-start justify-between gap-1">
                <h3 className="text-xs font-bold text-white line-clamp-2 leading-tight">
                  {item.title}
                </h3>
                <div className="flex items-center gap-0.5 text-secondary shrink-0 font-bold text-xs ml-1">
                  <span
                    className="material-symbols-outlined text-[14px] icon-filled"
                    aria-hidden="true"
                  >
                    star
                  </span>
                  <span>{item.rating}</span>
                </div>
              </div>
              <p className="text-[11px] text-[#d6d4d3] mt-1 leading-snug">
                {item.info}
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#d6d4d3] mt-2 font-medium">
              <span>{item.watchedAgo}</span>
              <span className="text-white font-mono font-bold">
                {item.quality}
              </span>
            </div>
          </div>
        </button>
      ))}

      {/* Full History Toggle Button */}
      {activeTab === "history" && (
        <Button
          type="button"
          variant="outline"
          size="md"
          radius="md"
          fullWidth
          onClick={() => {
            setIsHistoryExpanded(!isHistoryExpanded);
            notify(
              !isHistoryExpanded
                ? "Vollständige Historie geöffnet (+4 weitere Titel)"
                : "Historie reduziert",
            );
          }}
          rightIcon={
            <span
              className="material-symbols-outlined text-[18px]"
              aria-hidden="true"
            >
              {isHistoryExpanded ? "expand_less" : "expand_more"}
            </span>
          }
          className="mt-1 border-surface-300 text-white hover:border-secondary hover:text-secondary font-bold min-h-[44px]"
        >
          {isHistoryExpanded
            ? "Weniger Titel anzeigen"
            : `Vollständige Historie laden (${EXTENDED_WATCH_HISTORY.length} weitere)`}
        </Button>
      )}
    </div>
  );
};
