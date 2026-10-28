import React, { useState } from 'react';
import { Movie, Review } from '../types';
import { getSentimentLabel } from '../utils/matching';
import { Button, IconButton, ButtonIcon } from './ui/button';

interface QuickReviewModalProps {
  movie?: Movie;
  onClose: () => void;
  onSubmitReview: (review: Partial<Review>) => void;
}

export const QuickReviewModal: React.FC<QuickReviewModalProps> = ({
  movie,
  onClose,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState<number>(8.5);
  const [reviewText, setReviewText] = useState<string>(
    'Spannung von der ersten Minute an! Vecna ist ein genialer Bösewicht.'
  );
  const [isSpoiler, setIsSpoiler] = useState<boolean>(false);
  const [shareInFeed, setShareInFeed] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const charCount = reviewText.length;
  const isNearLimit = charCount >= 95;

  const defaultMovie: Movie = movie || {
    id: 'stranger-things-4',
    title: 'Stranger Things - Staffel 4',
    type: 'series',
    year: 2022,
    episodes: 9,
    genres: ['Mystery', 'Sci-Fi'],
    rating: 8.7,
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtT0XHSgnqKTsdj6Aw-rUeLcYslOZe8l_cc4sRyeBekanp8jvGBG3qHXVsMy2-9USlkbw8DogEEC7ZjhzaLjZKOnN-SwlYNHf-HQvSBRckdmpFCfBLNMIFeIAhyvUsbOMcY-CWj_6mACKT_bQ59qph4j_pY_sG9wvhpZXckwPmejoL2vRSMW-9HG_WAWRrA9z545aMplFbiHwRV4YFXNXGzYTQLUb0cXsJ3tXNspt6WeV2ByTuH5FW',
    synopsis: 'Dunkle Mächte erwachen in Hawkins...',
    providers: [{ id: 'netflix', name: 'Netflix', quality: '4K', audio: ['DE Audio'] }],
    hasDeAudio: true,
    isGermanAudioDefault: true,
  };

  const handleStarClick = (val: number) => {
    setRating(val);
  };

  const handlePublish = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitReview({
        movieId: defaultMovie.id,
        movieTitle: defaultMovie.title,
        moviePoster: defaultMovie.posterUrl,
        movieInfo: `${defaultMovie.providers[0]?.name || 'Netflix'} • ${defaultMovie.year} • ${defaultMovie.genres[0] || 'Drama'}`,
        rating: rating,
        ratingMax: 10,
        text: reviewText,
        isSpoiler: isSpoiler,
        createdAt: 'Gerade eben',
        likes: 0,
        commentsCount: 0,
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#131313] overflow-y-auto flex flex-col animate-in fade-in duration-150">
      {/* Header */}
      <header className="sticky top-0 inset-x-0 z-30 bg-[#131313]/90 backdrop-blur-xl border-b border-[#262626] h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconButton
            onClick={onClose}
            aria-label="Zurück"
            variant="ghost"
            size="md"
            radius="full"
            className="-ml-2 text-white hover:text-[#d80b69]"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </IconButton>
          <h1 className="text-sm font-bold text-white">Quick Review</h1>
        </div>

        <IconButton
          onClick={onClose}
          aria-label="Schließen ohne Speichern"
          variant="secondary"
          size="sm"
          radius="full"
          className="text-[#a3a3a3] hover:text-white"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </IconButton>
      </header>

      {/* Sheet Content */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full p-4 gap-4 pb-20">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">Film bewerten</h2>
          <span className="text-xs text-[#ffd405] font-semibold bg-[#ffd405]/10 px-2 py-0.5 rounded-full">
            +20 XP Belohnung
          </span>
        </div>

        {/* Media Card Preview */}
        <div className="relative overflow-hidden rounded-xl bg-[#201f1f] border border-[#2a2a2a] p-3 shadow-md flex items-center gap-3">
          <div className="relative w-16 h-24 rounded-lg overflow-hidden shrink-0 shadow-sm bg-[#353534]">
            <img
              src={defaultMovie.posterUrl}
              alt={defaultMovie.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0 justify-center">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className="bg-[#2a2a2a] text-[#c8c6c5] text-[10px] px-2 py-0.5 rounded-full font-bold">
                {defaultMovie.year}
              </span>
              <span className="bg-[#e50914]/20 text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e50914]"></span> Netflix
              </span>
            </div>
            <h3 className="text-sm font-bold text-white truncate">{defaultMovie.title}</h3>
            <div className="flex items-center gap-1 mt-1 text-xs text-[#a3a3a3]">
              <span>{defaultMovie.genres.join(', ')}</span>
              <span>•</span>
              <span className="bg-[#2a2a2a] text-white text-[10px] px-1 py-0.5 rounded font-mono">
                DE Audio
              </span>
            </div>
          </div>
        </div>

        {/* Rating Selection Section */}
        <div className="rounded-xl bg-[#201f1f] border border-[#2a2a2a] p-4 flex flex-col items-center gap-2.5 shadow-md">
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-semibold text-[#a3a3a3]">Deine Wertung (1-10 Sterne)</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-[#fbd100]">{rating.toFixed(1)}</span>
              <span className="text-xs text-[#a3a3a3]">/ 10</span>
            </div>
          </div>

          {/* 10 Interactive Star Chips */}
          <div className="w-full flex items-center justify-between py-1" id="star-row">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => {
              const isFilled = rating >= val;
              const isHalf = !isFilled && rating >= val - 0.5;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleStarClick(val)}
                  aria-label={`Bewertung: ${val} von 10 Sternen`}
                  className="w-8 h-10 flex items-center justify-center transition-transform active:scale-125 cursor-pointer text-[#ffd405]"
                >
                  <span
                    className={`material-symbols-outlined text-[24px] ${
                      isFilled || isHalf ? 'icon-filled text-[#ffd405]' : 'text-[#353534]'
                    }`}
                  >
                    {isHalf ? 'star_half' : 'star'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Reactive Sentiment Badge */}
          <div className="w-full flex justify-center pt-0.5">
            <span className="px-3 py-1 rounded-full bg-[#fbd100]/15 text-[#fbd100] text-xs font-bold shadow-sm">
              {getSentimentLabel(rating)}
            </span>
          </div>
        </div>

        {/* Quick Review Textarea (Max 100 Characters) */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="review-input" className="text-xs font-bold text-white">
            Deine Kurzkritik
          </label>
          <div className="relative bg-[#201f1f] border border-[#2a2a2a] rounded-xl p-3 focus-within:border-[#ffd405] transition-colors shadow-sm">
            <textarea
              id="review-input"
              rows={3}
              maxLength={100}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Was hat dir am besten gefallen? (max. 100 Zeichen)"
              className="w-full bg-transparent text-white placeholder:text-[#737373] text-xs resize-none outline-none focus:outline-none leading-relaxed"
            ></textarea>
            <div className="flex justify-between items-center pt-2 mt-1 border-t border-[#2a2a2a]">
              <span className="text-[10px] text-[#737373]">Maximal 100 Zeichen</span>
              <span
                className={`text-[10px] font-mono font-bold ${
                  isNearLimit ? 'text-[#d80b69]' : 'text-[#a3a3a3]'
                }`}
              >
                {charCount} / 100 Zeichen
              </span>
            </div>
          </div>
        </div>

        {/* Options & Toggles */}
        <div className="flex flex-col gap-2">
          {/* Spoiler Warning Toggle */}
          <div
            className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer ${
              isSpoiler
                ? 'bg-[#fbd100]/10 border-[#fbd100]/40'
                : 'bg-[#201f1f] border-[#2a2a2a]'
            }`}
            onClick={() => setIsSpoiler(!isSpoiler)}
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[#ffd405] shrink-0">
                <span className="material-symbols-outlined text-[18px]">visibility_off</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Spoiler-Warnung aktivieren</span>
                <span className="text-[10px] text-[#a3a3a3]">Text wird für andere abgedunkelt</span>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isSpoiler}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                isSpoiler ? 'bg-[#fbd100] justify-end' : 'bg-[#2a2a2a] justify-start'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full shadow-md transition-transform ${
                  isSpoiler ? 'bg-[#3b2f00]' : 'bg-[#c8c6c5]'
                }`}
              ></div>
            </button>
          </div>

          {/* Community Feed Share Toggle */}
          <div
            className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer ${
              shareInFeed
                ? 'bg-[#d80b69]/10 border-[#d80b69]/40'
                : 'bg-[#201f1f] border-[#2a2a2a]'
            }`}
            onClick={() => setShareInFeed(!shareInFeed)}
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined text-[18px]">group</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Im Community-Feed teilen</span>
                <span className="text-[10px] text-[#a3a3a3]">Für deine WatchMatch-Freunde sichtbar</span>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={shareInFeed}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                shareInFeed ? 'bg-[#d80b69] justify-end' : 'bg-[#2a2a2a] justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-md transition-transform"></div>
            </button>
          </div>
        </div>

        {/* Action Buttons Cluster */}
        <div className="flex flex-col gap-2 pt-1">
          <Button
            variant="primary"
            size="lg"
            radius="md"
            fullWidth
            onClick={handlePublish}
            isLoading={isSubmitting}
            leftIcon={<span className="material-symbols-outlined text-[18px]">send</span>}
          >
            Review veröffentlichen (+20 XP)
          </Button>

          <Button
            variant="outline"
            size="md"
            radius="md"
            fullWidth
            onClick={onClose}
            leftIcon={<span className="material-symbols-outlined text-[16px]">lock</span>}
            className="text-[#a3a3a3] hover:text-white"
          >
            Nur privat in meine Historie speichern
          </Button>
        </div>
      </div>
    </div>
  );
};
