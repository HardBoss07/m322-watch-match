import React, { useState } from "react";
import { ChatThread, ChatMessage } from "../../types";
import { IconButton } from "../../components/ui/button";

interface ChatViewProps {
  chat: ChatThread;
  messages: ChatMessage[];
  onBack: () => void;
  onSendMessage: (text: string) => void;
  onOpenMovieDetails: (movieId: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  chat,
  messages,
  onBack,
  onSendMessage,
  onOpenMovieDetails,
}) => {
  const [inputText, setInputText] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  return (
    <div className="absolute inset-0 z-50 bg-surface flex flex-col animate-in fade-in duration-150">
      {/* Top Header */}
      <header className="sticky top-0 inset-x-0 z-30 bg-surface-container-low/95 backdrop-blur-md border-b border-surface-bright h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <IconButton
            onClick={onBack}
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

          <div className="relative shrink-0">
            <img
              src={chat.participantAvatar}
              alt={chat.participantName}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-surface-300"
            />
            {chat.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-surface-container-low"></span>
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white truncate">
                {chat.participantName}
              </span>
              <span className="text-[10px] text-tertiary truncate">
                {chat.participantHandle}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-emerald-400 font-semibold">Online</span>
              <span className="text-tertiary">•</span>
              <span className="text-secondary font-bold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[13px] icon-filled">
                  bolt
                </span>
                {chat.matchPercent}% Match
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <IconButton
            aria-label="Anrufen"
            variant="ghost"
            size="md"
            radius="full"
            className="text-tertiary hover:text-white hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-[20px]">call</span>
          </IconButton>
          <IconButton
            aria-label="Mehr Optionen"
            variant="ghost"
            size="md"
            radius="full"
            className="text-tertiary hover:text-white hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-[20px]">
              more_vert
            </span>
          </IconButton>
        </div>
      </header>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 max-w-lg mx-auto w-full pb-20">
        {/* Match Introduction Box */}
        <div className="p-3 rounded-xl bg-surface-100 border border-surface-300 text-center flex flex-col items-center gap-1 shadow-sm">
          <span className="text-xs font-bold text-secondary">
            88% Geschmack-Match mit {chat.participantName}
          </span>
          <p className="text-[11px] text-tertiary">
            Ihr beide teilt Vorlieben für Sci-Fi, Anime und Psychothriller auf
            Netflix & Prime Video.
          </p>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-md ${
                msg.isMe
                  ? "bg-primary-container text-white rounded-br-xs"
                  : "bg-surface-container border border-surface-300 text-on-surface rounded-bl-xs"
              }`}
            >
              <p>{msg.text}</p>

              {/* Embedded Film Tip Card */}
              {msg.filmTip && (
                <div
                  onClick={() => onOpenMovieDetails(msg.filmTip!.movieId)}
                  className="mt-2 p-2 bg-surface border border-surface-300 rounded-xl flex items-center gap-2.5 cursor-pointer hover:border-secondary transition-colors"
                >
                  <img
                    src={msg.filmTip.poster}
                    alt={msg.filmTip.title}
                    className="w-12 h-16 rounded object-cover shrink-0 shadow"
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">
                      Empfohlener Titel
                    </span>
                    <span className="text-xs font-bold text-white truncate">
                      {msg.filmTip.title}
                    </span>
                    <span className="text-[10px] text-tertiary mt-0.5">
                      {msg.filmTip.provider}
                    </span>
                    <span className="text-[10px] text-secondary font-bold mt-1 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px] icon-filled">
                        bolt
                      </span>
                      {msg.filmTip.matchScore}% Match
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-tertiary">
                    chevron_right
                  </span>
                </div>
              )}

              <span
                className={`block text-[9px] mt-1 text-right font-mono ${
                  msg.isMe ? "text-white/70" : "text-tertiary"
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Input Field */}
      <footer className="sticky bottom-0 inset-x-0 bg-surface-container-low border-t border-surface-300 p-3 z-30 mt-auto">
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 max-w-lg mx-auto w-full"
        >
          <IconButton
            type="button"
            aria-label="Filmtipp anfügen"
            variant="secondary"
            size="md"
            radius="full"
            className="text-secondary hover:bg-surface-300"
          >
            <span className="material-symbols-outlined text-[20px]">movie</span>
          </IconButton>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Nachricht an ${chat.participantName}...`}
            className="flex-1 h-10 px-3 rounded-full bg-surface border border-surface-300 text-xs text-white placeholder:text-tertiary outline-none focus:border-primary-container"
          />

          <IconButton
            type="submit"
            disabled={!inputText.trim()}
            aria-label="Senden"
            variant={inputText.trim() ? "primary" : "secondary"}
            size="md"
            radius="full"
            className={
              inputText.trim() ? "shadow-md" : "text-tertiary opacity-60"
            }
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </IconButton>
        </form>
      </footer>
    </div>
  );
};
