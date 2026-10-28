import React, { useState } from 'react';
import { Movie, ChatThread } from '../types';
import { Button, IconButton, ButtonIcon } from './ui/button';

interface SendRecommendationModalProps {
  movies: Movie[];
  friends: ChatThread[];
  preselectedMovie?: Movie;
  onClose: () => void;
  onSend: (movieId: string, friendId: string, note: string) => void;
}

export const SendRecommendationModal: React.FC<SendRecommendationModalProps> = ({
  movies,
  friends,
  preselectedMovie,
  onClose,
  onSend,
}) => {
  const [selectedMovieId, setSelectedMovieId] = useState<string>(
    preselectedMovie?.id || movies[0]?.id || ''
  );
  const [selectedFriendId, setSelectedFriendId] = useState<string>(
    friends[0]?.id || ''
  );
  const [note, setNote] = useState<string>(
    'Musst du dir unbedingt für deinen nächsten Streaming-Abend vormerken!'
  );
  const [isSending, setIsSending] = useState(false);

  const selectedMovie = movies.find((m) => m.id === selectedMovieId);

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      onSend(selectedMovieId, selectedFriendId, note);
      setIsSending(false);
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
          <h1 className="text-sm font-bold text-white">Empfehlung teilen</h1>
        </div>

        <IconButton
          onClick={onClose}
          aria-label="Schließen"
          variant="secondary"
          size="sm"
          radius="full"
          className="text-[#a3a3a3] hover:text-white"
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
              <div
                key={m.id}
                onClick={() => setSelectedMovieId(m.id)}
                className={`flex-shrink-0 w-24 rounded-xl p-1.5 border transition-all cursor-pointer ${
                  selectedMovieId === m.id
                    ? 'border-[#d80b69] bg-[#d80b69]/10 shadow-md'
                    : 'border-[#2a2a2a] bg-[#1a1a1a] opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={m.posterUrl}
                  alt={m.title}
                  className="w-full h-28 object-cover rounded-lg"
                />
                <span className="text-[10px] font-bold text-white block mt-1 truncate">
                  {m.title}
                </span>
                <span className="text-[9px] text-[#ffd405]">★ {m.rating}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Movie Preview Ribbon */}
        {selectedMovie && (
          <div className="p-3 rounded-xl bg-[#201f1f] border border-[#2a2a2a] flex items-center gap-3">
            <img
              src={selectedMovie.posterUrl}
              alt={selectedMovie.title}
              className="w-12 h-16 rounded object-cover"
            />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-white truncate">{selectedMovie.title}</span>
              <span className="text-[10px] text-[#a3a3a3] mt-0.5">
                {selectedMovie.providers.map((p) => p.name).join(', ')} • {selectedMovie.genres[0]}
              </span>
              <span className="text-[10px] text-[#ffd405] font-bold mt-1">
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
              <div
                key={f.id}
                onClick={() => setSelectedFriendId(f.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedFriendId === f.id
                    ? 'border-[#ffd405] bg-[#ffd405]/10 shadow-md'
                    : 'border-[#2a2a2a] bg-[#1a1a1a] hover:bg-[#201f1f]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={f.participantAvatar}
                    alt={f.participantName}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-[#3a3a3a]"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">{f.participantName}</span>
                    <span className="text-[10px] text-[#a3a3a3]">{f.participantHandle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold text-[#ffd405]">
                  <span className="material-symbols-outlined text-[14px] icon-filled">bolt</span>
                  <span>{f.matchPercent}% Match</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Personal Note */}
        <div>
          <span className="text-xs font-bold text-white uppercase tracking-wider block mb-1.5">
            3. Persönliche Notiz (optional)
          </span>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Warum empfiehlst du diesen Titel?"
            className="w-full bg-[#1c1b1b] border border-[#2a2a2a] rounded-xl p-3 text-xs text-white placeholder:text-[#737373] outline-none focus:border-[#d80b69]"
          ></textarea>
        </div>

        {/* Send Action */}
        <Button
          variant="primary"
          size="lg"
          radius="md"
          fullWidth
          onClick={handleSend}
          isLoading={isSending}
          leftIcon={<span className="material-symbols-outlined text-[18px]">send</span>}
          className="mt-2 font-bold shadow-lg shadow-[#d80b69]/30"
        >
          Filmtipp jetzt senden
        </Button>
      </div>
    </div>
  );
};
