import React from "react";
import { Movie } from "../../types";
import { Button } from "../../components/ui/button";

interface MatchOverlayProps {
  movie: Movie;
  friendName: string;
  matchPercent: number;
  onDismiss: () => void;
}

export const MatchOverlay: React.FC<MatchOverlayProps> = ({
  movie,
  friendName,
  matchPercent,
  onDismiss,
}) => {
  return (
    <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-surface-100 border border-surface-300 rounded-2xl p-5 max-w-xs w-full text-center flex flex-col items-center gap-3 shadow-2xl relative overflow-hidden">
        <button
          onClick={onDismiss}
          aria-label="Schließen"
          className="absolute top-3 right-3 text-tertiary hover:text-white p-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <div className="relative my-1">
          <img
            src="/watchmatch-icon.svg"
            alt="WatchMatch"
            className="w-14 h-14 relative z-10 animate-bounce"
          />
        </div>

        <div>
          <span className="text-xs uppercase font-extrabold text-secondary tracking-widest block">
            It's a Match!
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            Du & {friendName}
          </h3>
          <p className="text-xs text-tertiary mt-1">
            Ihr beide wollt{" "}
            <strong className="text-white">{movie.title}</strong> sehen!
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-full bg-surface-container border border-surface-300 text-xs font-bold text-secondary flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[15px] icon-filled">
            bolt
          </span>
          {matchPercent}% Übereinstimmung
        </div>

        <div className="flex flex-col gap-2 w-full mt-2">
          <Button
            variant="primary"
            size="md"
            radius="md"
            fullWidth
            onClick={onDismiss}
          >
            Super, weiter matchen!
          </Button>
        </div>
      </div>
    </div>
  );
};
