import React from "react";
import { getSentimentLabel } from "../../utils/matching";

interface StarRatingProps {
  rating: number;
  onChange: (value: number) => void;
  maxStars?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onChange,
  maxStars = 10,
}) => {
  return (
    <div className="rounded-xl bg-surface-container border border-surface-300 p-3.5 flex flex-col items-center gap-2 shadow-md w-full">
      <div className="w-full flex items-center justify-between">
        <span className="text-xs font-semibold text-tertiary">
          Deine Wertung (1-10 Sterne)
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-secondary">{rating}</span>
          <span className="text-xs text-tertiary">/ 10</span>
        </div>
      </div>

      {/* 10 Interactive Star Chips */}
      <div
        className="w-full flex items-center justify-between py-1"
        id="star-row"
      >
        {Array.from({ length: maxStars }, (_, i) => i + 1).map((val) => {
          const isFilled = rating >= val;
          return (
            <button
              key={val}
              type="button"
              onClick={() => onChange(val)}
              aria-label={`Wertung: ${val} von 10`}
              className="w-7 h-9 flex items-center justify-center transition-transform active:scale-125 cursor-pointer text-secondary"
            >
              <span
                className={`material-symbols-outlined text-[22px] ${
                  isFilled
                    ? "icon-filled text-secondary"
                    : "text-surface-container-highest"
                }`}
              >
                star
              </span>
            </button>
          );
        })}
      </div>

      {/* Sentiment Badge */}
      <div className="w-full flex justify-center pt-0.5">
        <span className="px-3 py-0.5 rounded-full bg-secondary-container/15 text-secondary text-[11px] font-bold shadow-sm">
          {getSentimentLabel(rating)}
        </span>
      </div>
    </div>
  );
};
