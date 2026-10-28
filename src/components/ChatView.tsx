import React, { useState } from 'react';
import { ChatThread, ChatMessage, Movie } from '../types';
import { Button, IconButton, ButtonIcon } from './ui/button';

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
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#131313] flex flex-col animate-in fade-in duration-150">
      {/* Top Header */}
      <header className="sticky top-0 inset-x-0 z-30 bg-[#1c1b1b]/95 backdrop-blur-md border-b border-[#262626] h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <IconButton
            onClick={onBack}
            aria-label="Zurück"
            variant="ghost"
            size="md"
            radius="full"
            className="-ml-2 text-white hover:text-[#d80b69]"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </IconButton>

          <div className="relative shrink-0">
            <img
              src={chat.participantAvatar}
              alt={chat.participantName}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-[#3a3a3a]"
            />
            {chat.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-[#1c1b1b]"></span>
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white truncate">
                {chat.participantName}
              </span>
              <span className="text-[10px] text-[#a3a3a3] truncate">
                {chat.participantHandle}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-emerald-400 font-semibold">Online</span>
              <span className="text-[#737373]">•</span>
              <span className="text-[#ffd405] font-bold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[13px] icon-filled">bolt</span>
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
            className="text-[#a3a3a3] hover:text-white hover:bg-[#2a2a2a]"
          >
            <span className="material-symbols-outlined text-[20px]">call</span>
          </IconButton>
          <IconButton
            aria-label="Mehr Optionen"
            variant="ghost"
            size="md"
            radius="full"
            className="text-[#a3a3a3] hover:text-white hover:bg-[#2a2a2a]"
          >
            <span className="material-symbols-outlined text-[20px]">more_vert</span>
          </IconButton>
        </div>
      </header>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 max-w-lg mx-auto w-full pb-20">
        {/* Match Introduction Box */}
        <div className="p-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-center flex flex-col items-center gap-1 shadow-sm">
          <span className="text-xs font-bold text-[#ffd405]">
            88% Geschmack-Match mit {chat.participantName}
          </span>
          <p className="text-[11px] text-[#a3a3a3]">
            Ihr beide teilt Vorlieben für Sci-Fi, Anime und Psychothriller auf Netflix & Prime Video.
          </p>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-md ${
                msg.isMe
                  ? 'bg-[#d80b69] text-white rounded-br-xs'
                  : 'bg-[#201f1f] border border-[#2a2a2a] text-[#e5e2e1] rounded-bl-xs'
              }`}
            >
              <p>{msg.text}</p>

              {/* Embedded Film Tip Card */}
              {msg.filmTip && (
                <div
                  onClick={() => onOpenMovieDetails(msg.filmTip!.movieId)}
                  className="mt-2 p-2 bg-[#121212] border border-[#333333] rounded-xl flex items-center gap-2.5 cursor-pointer hover:border-[#ffd405] transition-colors"
                >
                  <img
                    src={msg.filmTip.poster}
                    alt={msg.filmTip.title}
                    className="w-12 h-16 rounded object-cover shrink-0 shadow"
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[10px] text-[#ffd405] font-bold uppercase tracking-wider">
                      Empfohlener Titel
                    </span>
                    <span className="text-xs font-bold text-white truncate">
                      {msg.filmTip.title}
                    </span>
                    <span className="text-[10px] text-[#a3a3a3] mt-0.5">
                      {msg.filmTip.provider}
                    </span>
                    <span className="text-[10px] text-[#ffd405] font-bold mt-1 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px] icon-filled">bolt</span>
                      {msg.filmTip.matchScore}% Match
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-[#a3a3a3]">
                    chevron_right
                  </span>
                </div>
              )}

              <span
                className={`block text-[9px] mt-1 text-right font-mono ${
                  msg.isMe ? 'text-white/70' : 'text-[#737373]'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Input Field */}
      <footer className="sticky bottom-0 inset-x-0 bg-[#1c1b1b] border-t border-[#2a2a2a] p-3 z-30 mt-auto">
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
            className="text-[#ffd405] hover:bg-[#333333]"
          >
            <span className="material-symbols-outlined text-[20px]">movie</span>
          </IconButton>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Nachricht an ${chat.participantName}...`}
            className="flex-1 h-10 px-3 rounded-full bg-[#121212] border border-[#2a2a2a] text-xs text-white placeholder:text-[#737373] outline-none focus:border-[#d80b69]"
          />

          <IconButton
            type="submit"
            disabled={!inputText.trim()}
            aria-label="Senden"
            variant={inputText.trim() ? 'primary' : 'secondary'}
            size="md"
            radius="full"
            className={inputText.trim() ? 'shadow-md' : 'text-[#737373] opacity-60'}
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </IconButton>
        </form>
      </footer>
    </div>
  );
};
