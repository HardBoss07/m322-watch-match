import React, { useState } from "react";
import { Movie } from "../types";
import { Button, IconButton } from "./ui/button";

interface TitleDetailModalProps {
  movie: Movie;
  onClose: () => void;
  onAddToWatchlist: (movie: Movie) => void;
  onShareRecommendation: (movie: Movie) => void;
  isSaved?: boolean;
}

export const TitleDetailModal: React.FC<TitleDetailModalProps> = ({
  movie,
  onClose,
  onAddToWatchlist,
  onShareRecommendation,
  isSaved = false,
}) => {
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "episodes" | "reviews">(
    "info",
  );

  const episodes = [
    {
      ep: 1,
      title: "Let You Down",
      runtime: "24 Min.",
      desc: "David schlägt sich durch die Straßen von Santo Domingo, während seine Mutter für seine Bildung schuftet.",
    },
    {
      ep: 2,
      title: "Like a Boy",
      runtime: "25 Min.",
      desc: "Nach einer schweren Tragödie lässt David sich das experimentelle Sandevistan-Implantat einsetzen.",
    },
    {
      ep: 3,
      title: "Smooth Criminal",
      runtime: "23 Min.",
      desc: "David trifft auf Lucy und wird in die gefährliche Welt der Edgerunners eingeführt.",
    },
    {
      ep: 4,
      title: "Lucky You",
      runtime: "24 Min.",
      desc: "Maine nimmt David unter seine Fittiche für einen riskanten Raubzug auf ein Konzerndepot.",
    },
  ];

  return (
    <div className="absolute inset-0 z-50 bg-surface overflow-y-auto flex flex-col animate-in fade-in duration-150">
      {/* Fixed Sticky Header */}
      <header className="sticky top-0 inset-x-0 z-30 bg-surface/90 backdrop-blur-xl border-b border-surface-bright h-14 px-4 flex items-center justify-between">
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

        <h1 className="text-sm font-bold text-white truncate max-w-[200px]">
          {movie.title}
        </h1>

        <div className="flex items-center gap-1">
          <IconButton
            onClick={() => onShareRecommendation(movie)}
            aria-label="Filmtipp teilen"
            variant="ghost"
            size="md"
            radius="full"
            className="text-tertiary hover:text-white"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </IconButton>
          <IconButton
            onClick={onClose}
            aria-label="Schließen"
            variant="ghost"
            size="md"
            radius="full"
            className="text-tertiary hover:text-white"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </IconButton>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full pb-24">
        {/* Hero Trailer Container */}
        <div className="relative w-full aspect-video bg-surface-container-lowest overflow-hidden shadow-2xl flex items-center justify-center">
          {isPlayingTrailer ? (
            <div className="w-full h-full relative">
              <iframe
                src={`${movie.trailerUrl || "https://www.youtube-nocookie.com/embed/JtqIas3bYhg"}?autoplay=1`}
                title={`${movie.title} Trailer`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <button
                type="button"
                onClick={() => setIsPlayingTrailer(false)}
                className="absolute top-2 right-2 bg-black/80 min-h-[44px] min-w-[44px] px-3 py-1.5 rounded-lg text-white text-xs font-bold z-10 cursor-pointer flex items-center justify-center hover:bg-black"
                aria-label="Trailer schließen"
              >
                Schließen ✕
              </button>
            </div>
          ) : (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})`,
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent pointer-events-none"></div>

              {/* Teaser Badge */}
              <div className="absolute top-3 left-4 flex items-center gap-1.5 px-2.5 py-1 bg-surface-container/80 rounded-full shadow-md backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                  Offizieller Teaser
                </span>
              </div>

              {/* Play Trigger */}
              <IconButton
                onClick={() => setIsPlayingTrailer(true)}
                aria-label="Trailer abspielen"
                variant="primary"
                size="xl"
                radius="full"
                className="relative z-10 w-16 h-16 min-w-[64px] min-h-[64px] shadow-xl"
              >
                <span className="material-symbols-outlined text-[36px] ml-0.5 icon-filled">
                  play_arrow
                </span>
              </IconButton>

              {/* Quality & Audio Badges */}
              <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-surface-container/90 text-white font-bold text-[10px] rounded border border-surface-300">
                  4K HDR
                </span>
                <span className="px-2 py-0.5 bg-surface-container/90 text-white font-bold text-[10px] rounded border border-surface-300">
                  5.1 SURROUND
                </span>
              </div>
            </>
          )}
        </div>

        {/* Primary Details Block */}
        <div className="px-4 flex flex-col gap-4 -mt-2 relative z-20">
          {/* Header Metadata Row */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 bg-surface-container-high text-primary text-xs font-bold rounded">
                {movie.type === "series" ? "ANIME-SERIE" : "SPIELFILM"}
              </span>
              <span className="text-tertiary text-xs">•</span>
              <span className="text-white text-xs font-medium">
                {movie.year}
              </span>
              <span className="text-tertiary text-xs">•</span>
              <span className="px-1.5 py-0.5 bg-surface-container border border-surface-bright text-white text-[10px] font-bold rounded">
                {movie.fsk || "FSK 16"}
              </span>
              <span className="text-tertiary text-xs">•</span>
              <span className="text-tertiary text-xs">
                {movie.duration || `${movie.episodes} Episoden`}
              </span>
            </div>

            <div className="flex items-start justify-between gap-3 mt-1">
              <h2 className="text-2xl font-black text-white tracking-tight">
                {movie.title}
              </h2>
              <div className="flex items-center gap-1 bg-surface-container border border-surface-bright px-2.5 py-1 rounded-full shrink-0">
                <span className="material-symbols-outlined text-[16px] text-secondary icon-filled">
                  star
                </span>
                <span className="text-sm text-secondary font-bold">
                  {movie.rating}
                </span>
                <span className="text-[10px] text-tertiary">/10</span>
              </div>
            </div>

            {movie.studio && (
              <span className="text-xs text-tertiary font-medium">
                {movie.studio}{" "}
                {movie.director ? `• Regie: ${movie.director}` : ""}
              </span>
            )}
          </div>

          {/* Taste Match Banner */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-surface-container via-surface-container-high to-surface-container border border-secondary/30 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-secondary-container/20 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] icon-filled">
                  bolt
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <span className="text-secondary">
                    {movie.matchScore || 94}% Streaming-Match
                  </span>{" "}
                  mit deinen Freunden
                </span>
                <p className="text-[11px] text-tertiary">
                  Dario M. & Elena C. haben diesen Titel mit 10/10 bewertet
                </p>
              </div>
            </div>
          </div>

          {/* Streaming Availability Cards */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary-container">
                tv
              </span>
              Verfügbar im Streaming-Abo
            </span>
            <div className="grid grid-cols-1 gap-2">
              {movie.providers.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-surface-container-low border border-surface-300 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white ${
                        p.id === "netflix"
                          ? "bg-[#e50914]"
                          : p.id === "prime"
                            ? "bg-[#00a8e1]"
                            : p.id === "crunchyroll"
                              ? "bg-[#f47521]"
                              : "bg-surface-container-high"
                      }`}
                    >
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {p.name}
                      </span>
                      <span className="text-[11px] text-tertiary">
                        {p.quality} • {p.audio.join(", ")}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      // Handled cleanly without window.alert
                    }}
                    className="px-3.5 py-2.5 min-h-[44px] rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-white font-bold text-xs transition-colors flex items-center gap-1.5 border border-surface-300 cursor-pointer active:scale-95"
                    aria-label={`Auf ${p.name} ansehen`}
                  >
                    <span>Auf {p.name} ansehen</span>
                    <span
                      className="material-symbols-outlined text-[16px] text-secondary"
                      aria-hidden="true"
                    >
                      open_in_new
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Segmented Sub-Tabs */}
          <div className="flex items-center gap-1 bg-surface-100 p-1 rounded-xl border border-surface-bright mt-1">
            <Button
              variant={activeTab === "info" ? "primary" : "ghost"}
              size="sm"
              radius="md"
              onClick={() => setActiveTab("info")}
              className={`flex-1 font-bold ${
                activeTab === "info"
                  ? "text-white"
                  : "text-tertiary hover:text-white"
              }`}
            >
              Übersicht
            </Button>
            {movie.type === "series" && (
              <Button
                variant={activeTab === "episodes" ? "primary" : "ghost"}
                size="sm"
                radius="md"
                onClick={() => setActiveTab("episodes")}
                className={`flex-1 font-bold ${
                  activeTab === "episodes"
                    ? "text-white"
                    : "text-tertiary hover:text-white"
                }`}
              >
                Episoden (10)
              </Button>
            )}
            <Button
              variant={activeTab === "reviews" ? "primary" : "ghost"}
              size="sm"
              radius="md"
              onClick={() => setActiveTab("reviews")}
              className={`flex-1 font-bold ${
                activeTab === "reviews"
                  ? "text-white"
                  : "text-tertiary hover:text-white"
              }`}
            >
              Freunde-Kritiken
            </Button>
          </div>

          {/* Tab Content 1: Info */}
          {activeTab === "info" && (
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-xs font-bold text-white block mb-1">
                  Handlung
                </span>
                <p className="text-xs text-on-surface leading-relaxed bg-surface-100 p-3 rounded-xl border border-surface-bright">
                  {movie.synopsis}
                </p>
              </div>

              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-white block mb-1.5">
                    Hauptbesetzung
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {movie.cast.map((actor, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-full bg-surface-container-low border border-surface-300 text-xs text-on-surface"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-xs font-bold text-white block mb-1.5">
                  Genre & Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {movie.genres.map((g, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-surface-container text-xs text-tertiary font-medium"
                    >
                      #{g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 2: Episodes */}
          {activeTab === "episodes" && (
            <div className="flex flex-col gap-2">
              {episodes.map((ep) => (
                <div
                  key={ep.ep}
                  className="p-3 rounded-xl bg-surface-container-low border border-surface-300 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      Folge {ep.ep}: {ep.title}
                    </span>
                    <span className="text-[10px] text-tertiary font-mono">
                      {ep.runtime}
                    </span>
                  </div>
                  <p className="text-[11px] text-tertiary leading-relaxed">
                    {ep.desc}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Tab Content 3: Reviews */}
          {activeTab === "reviews" && (
            <div className="flex flex-col gap-2.5">
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-300 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary-container flex items-center justify-center font-bold text-xs text-white">
                      D
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Dario M.
                      </span>
                      <span className="text-[10px] text-tertiary">
                        @dario_cineaste • vor 2 Tagen
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-secondary">
                    ★ 10/10
                  </span>
                </div>
                <p className="text-xs text-on-surface bg-surface p-2 rounded-lg italic">
                  «Unglaubliche Animationen & Sounddesign! Das Ende trifft einen
                  wie ein Schlag.»
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-0 inset-x-0 bg-surface/95 backdrop-blur-xl border-t border-surface-bright p-3 z-40 mt-auto">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          <Button
            variant={isSaved ? "accent" : "primary"}
            size="lg"
            radius="md"
            onClick={() => onAddToWatchlist(movie)}
            className="flex-1 font-bold text-xs shadow-lg"
            leftIcon={
              <span className="material-symbols-outlined text-[18px]">
                {isSaved ? "bookmark_added" : "bookmark_add"}
              </span>
            }
          >
            {isSaved ? "Auf deiner Watchlist" : "Zur Watchlist hinzufügen"}
          </Button>

          <IconButton
            onClick={() => onShareRecommendation(movie)}
            aria-label="Tipp an Freunde senden"
            variant="secondary"
            size="lg"
            radius="md"
            className="w-12 h-12 min-w-[48px] min-h-[48px]"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </IconButton>
        </div>
      </div>
    </div>
  );
};
