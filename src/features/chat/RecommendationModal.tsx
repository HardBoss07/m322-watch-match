import React, { useState } from "react";
import { Movie, ChatThread } from "../../types";
import { Button, IconButton } from "../../components/ui/button";

interface RecommendationModalProps {
  movies: Movie[];
  friends: ChatThread[];
  preselectedMovie?: Movie;
  onClose: () => void;
  onSend: (movieId: string, friendId: string, note: string) => void;
}

export const RecommendationModal: React.FC<RecommendationModalProps> = ({
  movies,
  friends,
  preselectedMovie,
  onClose,
  onSend,
}) => {
  const [selectedMovieId, setSelectedMovieId] = useState<string>(
    preselectedMovie?.id || movies[0]?.id || "",
  );
  const [selectedFriendId, setSelectedFriendId] = useState<string>(
    friends[0]?.id || "",
  );
  const [note, setNote] = useState<string>(
    "Musst du dir unbedingt für deinen nächsten Streaming-Abend vormerken!",
  );
  const [isSending, setIsSending] = useState(false);

  const selectedMovie = movies.find((m) => m.id === selectedMovieId);

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      onSend(selectedMovieId, selectedFriendId, note);
      setIsSending(false);
    }, 200);
  };

  return (
    <div className="absolute inset-0 z-50 bg-surface overflow-y-auto flex flex-col animate-in fade-in duration-150">
      {/* Header */}
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
          <h1 className="text-sm font-bold text-white">Filmtipp empfehlen</h1>
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

      {/* Form Content */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full p-4 gap-4 pb-20">
        <div>
          <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
            1. Film oder Serie wählen
          </span>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {movies.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMovieId(m.id)}
                aria-pressed={selectedMovieId === m.id}
                aria-label={`Film auswählen: ${m.title}`}
                className={`flex-shrink-0 w-24 rounded-xl p-1.5 border transition-all cursor-pointer text-left min-h-[44px] ${
                  selectedMovieId === m.id
                    ? "border-primary-container bg-primary-container/15 shadow-md ring-1 ring-primary-container"
                    : "border-surface-300 bg-surface-100 opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={m.posterUrl}
                  alt={`Poster von ${m.title}`}
                  className="w-full h-28 object-cover rounded-lg"
                />
                <span className="text-[11px] font-bold text-white block mt-1 line-clamp-2 leading-tight">
                  {m.title}
                </span>
                <span className="text-[10px] text-secondary font-bold">
                  ★ {m.rating}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Movie Preview Ribbon */}
        {selectedMovie && (
          <div className="p-3 rounded-xl bg-surface-container border border-surface-300 flex items-center gap-3">
            <img
              src={selectedMovie.posterUrl}
              alt={`Poster von ${selectedMovie.title}`}
              className="w-12 h-16 rounded object-cover"
            />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-white truncate">
                {selectedMovie.title}
              </span>
              <span className="text-[10px] text-[#d6d4d3] mt-0.5">
                {selectedMovie.providers.map((p: any) => p.name).join(", ")} •{" "}
                {selectedMovie.genres[0]}
              </span>
              <span className="text-[10px] text-secondary font-bold mt-1">
                {selectedMovie.matchScore || 90}% Match-Rate
              </span>
            </div>
          </div>
        )}

        {/* 2. Choose Friend */}
        <div>
          <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
            2. Freund auswählen
          </span>
          <div className="grid grid-cols-1 gap-2">
            {friends.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFriendId(f.id)}
                aria-pressed={selectedFriendId === f.id}
                aria-label={`Freund auswählen: ${f.participantName}`}
                className={`p-3 min-h-[48px] rounded-xl border flex items-center justify-between cursor-pointer transition-all text-left w-full ${
                  selectedFriendId === f.id
                    ? "border-secondary bg-secondary/15 shadow-md ring-1 ring-secondary"
                    : "border-surface-300 bg-surface-100 hover:bg-surface-container"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={f.participantAvatar}
                    alt={`Profilbild von ${f.participantName}`}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-surface-300"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {f.participantName}
                    </span>
                    <span className="text-[11px] text-[#d6d4d3]">
                      {f.participantHandle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold text-secondary">
                  <span
                    className="material-symbols-outlined text-[15px] icon-filled"
                    aria-hidden="true"
                  >
                    bolt
                  </span>
                  <span>{f.matchPercent}% Match</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Personal Note */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="rec-note"
            className="text-xs font-bold text-white uppercase tracking-wider block"
          >
            3. Persönliche Notiz (optional)
          </label>
          <textarea
            id="rec-note"
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Warum empfiehlst du diesen Titel?"
            className="w-full bg-surface-container-low border border-surface-300 rounded-xl p-3 text-xs text-white placeholder:text-[#d6d4d3] outline-none focus:border-primary-container"
          ></textarea>
        </div>

        {/* Send Action */}
        <Button
          type="button"
          variant="primary"
          size="lg"
          radius="md"
          fullWidth
          onClick={handleSend}
          isLoading={isSending}
          leftIcon={
            <span className="material-symbols-outlined text-[18px]">send</span>
          }
          className="mt-2 font-bold shadow-lg shadow-primary-container/30 min-h-[48px]"
        >
          Tipp senden & Chat starten
        </Button>
      </div>
    </div>
  );
};
