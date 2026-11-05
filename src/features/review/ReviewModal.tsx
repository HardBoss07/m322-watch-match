import React, { useState } from "react";
import { Movie, Review } from "../../types";
import { StarRating } from "./StarRating";
import { Button, IconButton } from "../../components/ui/button";

interface ReviewModalProps {
  movie: Movie;
  onClose: () => void;
  onSubmitReview: (reviewData: Partial<Review>) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  movie,
  onClose,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState<number>(9);
  const [comment, setComment] = useState<string>(
    "Absolutes Meisterwerk! Bild und Ton genial.",
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const charCount = comment.length;
  const isNearLimit = charCount >= 95;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitReview({
        movieId: movie.id,
        movieTitle: movie.title,
        moviePoster: movie.posterUrl,
        movieInfo: `${movie.providers[0]?.name || "Netflix"} • ${movie.year} • ${movie.genres[0] || "Drama"}`,
        rating: rating,
        ratingMax: 10,
        text: comment.trim(),
        isSpoiler: false,
      });
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

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
            className="-ml-2 text-white hover:text-primary-container"
          >
            <span className="material-symbols-outlined text-[24px]">
              arrow_back
            </span>
          </IconButton>
          <h1 className="text-sm font-bold text-white">Film bewerten</h1>
        </div>

        <IconButton
          onClick={onClose}
          aria-label="Schließen"
          variant="secondary"
          size="sm"
          radius="full"
          className="text-tertiary hover:text-white"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </IconButton>
      </header>

      {/* Main Form Content */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full p-4 gap-4 pb-20">
        {/* Movie Header Card */}
        <div className="relative overflow-hidden rounded-xl bg-surface-container border border-surface-300 p-3 shadow-md flex items-center gap-3">
          <div className="relative w-16 h-22 rounded-lg overflow-hidden shrink-0 shadow-sm bg-surface-container-highest">
            <img
              src={movie.posterUrl}
              alt={`Poster von ${movie.title}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0 justify-center flex-1">
            <span className="text-sm font-bold text-white line-clamp-2">
              {movie.title}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#d6d4d3]">
              <span>{movie.year}</span>
              <span>•</span>
              <span>{movie.genres.join(", ")}</span>
            </div>
            <span className="text-[11px] text-secondary font-bold bg-secondary-container/20 border border-secondary/30 px-2.5 py-0.5 rounded-full mt-2 w-fit flex items-center gap-1">
              <span
                className="material-symbols-outlined text-[13px] icon-filled"
                aria-hidden="true"
              >
                bolt
              </span>
              +20 XP für Review
            </span>
          </div>
        </div>

        {/* 1. Star Rating (1-10) */}
        <StarRating rating={rating} onChange={setRating} />

        {/* 2. Short Comment Input */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="review-comment"
            className="text-xs font-bold text-white"
          >
            Deine Kurzkritik
          </label>
          <div className="bg-surface-container border border-surface-300 rounded-xl p-3 focus-within:border-secondary transition-colors shadow-sm">
            <textarea
              id="review-comment"
              rows={3}
              maxLength={100}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Was hat dir am besten gefallen? (max. 100 Zeichen)"
              className="w-full bg-transparent text-white placeholder:text-[#d6d4d3] text-xs resize-none outline-none leading-relaxed"
            />
            <div className="flex justify-between items-center pt-2 mt-1 border-t border-surface-300">
              <span className="text-[11px] text-[#d6d4d3]">
                Maximal 100 Zeichen
              </span>
              <span
                className={`text-[11px] font-mono font-bold ${
                  isNearLimit ? "text-primary-container" : "text-[#d6d4d3]"
                }`}
              >
                {charCount} / 100 Zeichen
              </span>
            </div>
          </div>
        </div>

        {/* 3. XP Gamification Visual & Primary CTA */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container-high border border-surface-300 w-fit mx-auto">
            <span
              className="material-symbols-outlined text-secondary text-[16px] icon-filled"
              aria-hidden="true"
            >
              stars
            </span>
            <span className="text-xs font-bold text-secondary">
              +20 XP Belohnung nach Veröffentlichung
            </span>
          </div>

          <Button
            type="button"
            variant="primary"
            size="lg"
            radius="md"
            fullWidth
            onClick={handleSubmit}
            isLoading={isSubmitting}
            leftIcon={
              <span className="material-symbols-outlined text-[18px]">
                send
              </span>
            }
            className="font-bold shadow-lg shadow-primary-container/30 min-h-[48px]"
          >
            Bewertung veröffentlichen
          </Button>
        </div>
      </div>
    </div>
  );
};
