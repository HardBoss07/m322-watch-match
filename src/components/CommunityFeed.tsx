import React, { useState } from 'react';
import { Review, Recommendation, ChatThread, Movie } from '../types';
import { Button, IconButton, ButtonIcon } from './ui/button';

interface CommunityFeedProps {
  reviews: Review[];
  chats: ChatThread[];
  onOpenReviewModal: () => void;
  onOpenSendRecommendation: () => void;
  onOpenChat: (thread: ChatThread) => void;
  onOpenUserProfile: (userId: string) => void;
  onOpenMovieDetails: (movieId: string) => void;
  onToggleLike: (reviewId: string) => void;
  onToggleWatchlist: (movieTitle: string) => void;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  reviews,
  chats,
  onOpenReviewModal,
  onOpenSendRecommendation,
  onOpenChat,
  onOpenUserProfile,
  onOpenMovieDetails,
  onToggleLike,
  onToggleWatchlist,
}) => {
  const [subTab, setSubTab] = useState<'reviews' | 'chats'>('reviews');
  const [revealedSpoilers, setRevealedSpoilers] = useState<Record<string, boolean>>({});

  const toggleSpoilerReveal = (id: string) => {
    setRevealedSpoilers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col w-full pb-24 max-w-lg mx-auto">
      {/* Sub-Tabs: Freunde & Reviews vs Direkt-Chats */}
      <div className="px-4 pt-2.5 pb-2 bg-[#131313] sticky top-0 z-20">
        <div className="flex p-1 bg-[#1c1b1b] border border-[#262626] rounded-xl gap-1">
          <Button
            variant={subTab === 'reviews' ? 'primary' : 'ghost'}
            size="sm"
            radius="md"
            onClick={() => setSubTab('reviews')}
            className={`flex-1 font-bold ${
              subTab === 'reviews' ? 'text-white' : 'text-[#a3a3a3] hover:text-white'
            }`}
            leftIcon={<span className="material-symbols-outlined text-[18px]">group</span>}
          >
            Freunde & Reviews
          </Button>

          <Button
            variant={subTab === 'chats' ? 'primary' : 'ghost'}
            size="sm"
            radius="md"
            onClick={() => setSubTab('chats')}
            className={`flex-1 font-bold ${
              subTab === 'chats' ? 'text-white' : 'text-[#a3a3a3] hover:text-white'
            }`}
            leftIcon={<span className="material-symbols-outlined text-[18px]">chat</span>}
            rightIcon={
              <span className="px-1.5 py-0.2 rounded-full bg-[#2a2a2a] text-[#ffd405] text-[10px] font-bold">
                {chats.filter((c) => c.unreadCount > 0).length || 3}
              </span>
            }
          >
            Direkt-Chats
          </Button>
        </div>
      </div>

      {/* VIEW 1: Freunde & Reviews */}
      {subTab === 'reviews' && (
        <div className="flex flex-col gap-3 px-4 pt-1">
          {/* Quick Action: Tipp an Freunde senden */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0 text-white">
                <span className="material-symbols-outlined text-[20px]">send</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white truncate">Empfehlung teilen</span>
                <span className="text-[11px] text-[#a3a3a3] truncate">
                  Sende einen Filmtipp an deine Freunde
                </span>
              </div>
            </div>

            <IconButton
              onClick={onOpenSendRecommendation}
              aria-label="Tipp senden"
              variant="primary"
              size="md"
              radius="full"
              className="shadow-md shadow-[#d80b69]/30"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
            </IconButton>
          </div>

          {/* Friend Recommendation Highlight Banner: Arcane S2 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3 flex flex-col gap-2 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div
                onClick={() => onOpenUserProfile('dario-m')}
                className="flex items-center gap-2 min-w-0 cursor-pointer group"
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCX-DATfZHnME16uKVt6ohsEU31ezgDSVxOcOEmRXW0MlDDTT2yHeNNw_iZK7kEDnW09Q7oa6WzgdiapNlqNsVykTW7r23d0F_JC8CScXmxfWQ680JXQ91eGZl_rJA7nIABj6n_5apEseObUZ9oGXAqK-WVFms2wF-wBFlkuBe4OnxySo0ycSaCOXDlBF_gEBIMUr0IquTRM3BGJo9yvl-D1JCvzlXbJ9q5ccaUZrPrX0wRwgB9WkCK"
                  alt="Dario Profilbild"
                  className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-[#ffd405]/50"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white group-hover:text-[#ffb1c3] transition-colors truncate">
                    Dario empfiehlt
                  </span>
                  <span className="text-[10px] text-[#a3a3a3] truncate">Staffel 2 • 9.1/10 Match</span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded bg-[#2a2a2a] text-[#a3a3a3] text-[10px] font-semibold">
                Heute
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcxi1K6Kj4ffG8g4_xb9SvzHFgmDyYSTgebhEIPgRUGOpg6C5p1He4eocAitUCWjZAPleZEQf1wmKAkzl1vkqAUJ-9uCXewTVGSKunEPxBNpluQwt1tK4ASE9n-hfiNKXGRsboY3FDWxYPacQM4FeF8SKtkK-qNmudLh9w79H41DpNhhmzFJznh9SP_XAVGgKQZNe8hmxtKUbrqxemSeMbkhf9dFzzSs-6MLjYYyXSCu-bmfio8yG3"
                alt="Arcane Poster"
                className="w-14 h-18 rounded-lg object-cover shrink-0 shadow-md cursor-pointer"
                onClick={() => onOpenMovieDetails('arcane-s2')}
              />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[10px] text-[#a3a3a3]">Netflix Serie</span>
                <h4
                  onClick={() => onOpenMovieDetails('arcane-s2')}
                  className="text-sm font-bold text-white truncate cursor-pointer hover:text-[#d80b69] transition-colors"
                >
                  Arcane: Staffel 2
                </h4>
                <div className="flex items-center gap-1 text-[#ffd405] text-[11px] font-bold mt-0.5">
                  <span className="material-symbols-outlined text-[14px] icon-filled">star</span>
                  <span>9.1</span>
                  <span className="text-[#737373] font-normal">• Höchste Match-Rate</span>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                radius="md"
                onClick={() => onOpenMovieDetails('arcane-s2')}
                leftIcon={
                  <span className="material-symbols-outlined text-[16px] text-[#ffd405] icon-filled">
                    play_arrow
                  </span>
                }
              >
                Ansehen
              </Button>
            </div>
          </div>

          {/* Feed Reviews List */}
          {reviews.map((rev) => {
            const isObscured = rev.isSpoiler && !revealedSpoilers[rev.id];
            return (
              <article
                key={rev.id}
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3 flex flex-col gap-3 shadow-sm"
              >
                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div
                    onClick={() => onOpenUserProfile(rev.userId)}
                    className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
                  >
                    <img
                      src={rev.userAvatar}
                      alt={rev.userName}
                      className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-[#3a3a3a]"
                    />
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-white group-hover:text-[#d80b69] transition-colors truncate">
                          {rev.userName} {rev.userAge ? `(${rev.userAge})` : ''}
                        </span>
                        {rev.isVerified && (
                          <span className="material-symbols-outlined text-[15px] text-[#ffd405] icon-filled">
                            verified
                          </span>
                        )}
                        {rev.isSpoiler && (
                          <span className="px-1.5 py-0.2 rounded bg-[#2a2a2a] text-[#ffd405] text-[9px] font-bold">
                            Spoiler
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[#a3a3a3] text-[10px]">
                        <span className="truncate">{rev.userHandle}</span>
                        <span>•</span>
                        <span className="shrink-0">{rev.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <IconButton
                    aria-label="Mehr Optionen"
                    variant="ghost"
                    size="sm"
                    radius="full"
                    className="text-[#737373] hover:text-white"
                  >
                    <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                  </IconButton>
                </div>

                {/* Embedded Movie Ribbon */}
                <div
                  onClick={() => onOpenMovieDetails(rev.movieId)}
                  className="flex items-center gap-2.5 p-2 bg-[#121212] border border-[#262626] rounded-lg cursor-pointer hover:border-[#3a3a3a] transition-colors"
                >
                  <img
                    src={rev.moviePoster}
                    alt={rev.movieTitle}
                    className="w-11 h-14 rounded object-cover shrink-0 shadow"
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-bold text-white truncate">{rev.movieTitle}</span>
                    <span className="text-[10px] text-[#a3a3a3] mt-0.5">{rev.movieInfo}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-[#ffd405] pr-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className={`material-symbols-outlined text-[14px] ${
                          rev.rating >= s ? 'icon-filled text-[#ffd405]' : 'text-[#353534]'
                        }`}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>

                {/* Review Text with Spoiler Blur Protection */}
                <div className="relative pl-1">
                  <p
                    className={`text-xs text-white leading-relaxed ${
                      isObscured ? 'filter blur-sm select-none' : ''
                    }`}
                  >
                    {rev.text}
                  </p>
                  {isObscured && (
                    <Button
                      variant="ghost"
                      size="sm"
                      radius="md"
                      onClick={() => toggleSpoilerReveal(rev.id)}
                      leftIcon={<span className="material-symbols-outlined text-[16px]">visibility</span>}
                      className="absolute inset-0 bg-black/60 backdrop-blur-xs text-[#ffd405] hover:text-[#ffd405] hover:bg-black/70 font-bold"
                    >
                      Spoiler anzeigen
                    </Button>
                  )}
                </div>

                {/* Bottom Actions: Like, Comment, Watchlist */}
                <div className="flex items-center justify-between pt-1 border-t border-[#222222]">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      radius="full"
                      onClick={() => onToggleLike(rev.id)}
                      leftIcon={
                        <span
                          className={`material-symbols-outlined text-[18px] ${
                            rev.likedByMe ? 'icon-filled text-[#d80b69]' : ''
                          }`}
                        >
                          favorite
                        </span>
                      }
                      className="px-2.5 h-7 text-xs text-[#a3a3a3] hover:text-[#d80b69]"
                    >
                      <span className="font-bold text-white">{rev.likes}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      radius="full"
                      leftIcon={<span className="material-symbols-outlined text-[18px]">chat_bubble</span>}
                      className="px-2.5 h-7 text-xs text-[#a3a3a3] hover:text-white"
                    >
                      <span className="font-bold text-white">{rev.commentsCount}</span>
                    </Button>
                  </div>

                  <Button
                    variant={rev.savedToWatchlist ? 'primary' : 'secondary'}
                    size="sm"
                    radius="md"
                    onClick={() => onToggleWatchlist(rev.movieTitle)}
                    leftIcon={
                      <span className="material-symbols-outlined text-[15px]">
                        {rev.savedToWatchlist ? 'bookmark_added' : 'bookmark_add'}
                      </span>
                    }
                    className="h-8 text-xs font-semibold"
                  >
                    Watchlist
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* VIEW 2: Direkt-Chats */}
      {subTab === 'chats' && (
        <div className="flex flex-col gap-2 px-4 pt-1">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Aktive Unterhaltungen
            </span>
            <span className="text-[11px] text-[#a3a3a3]">3 Kontakte</span>
          </div>

          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onOpenChat(chat)}
              className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all active:scale-[0.99] shadow-sm"
            >
              <div className="relative shrink-0">
                <img
                  src={chat.participantAvatar}
                  alt={chat.participantName}
                  className="w-12 h-12 rounded-full object-cover ring-1 ring-[#3a3a3a]"
                />
                {chat.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-[#1a1a1a]"></span>
                )}
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-bold text-white truncate">
                      {chat.participantName}
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full bg-[#fbd100]/15 text-[#ffd405] text-[10px] font-bold">
                      {chat.matchPercent}% Match
                    </span>
                  </div>
                  <span className="text-[10px] text-[#737373] shrink-0 font-mono">
                    {chat.lastMessageTime}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-[#a3a3a3] truncate pr-2">{chat.lastMessage}</p>
                  {chat.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#d80b69] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Action Button (Review verfassen) */}
      <div className="sticky bottom-4 self-end mr-4 z-30 mt-2">
        <Button
          variant="primary"
          size="md"
          radius="full"
          onClick={onOpenReviewModal}
          leftIcon={<span className="material-symbols-outlined text-[18px]">edit</span>}
          className="shadow-xl shadow-[#d80b69]/40 font-bold"
        >
          Review verfassen
        </Button>
      </div>
    </div>
  );
};
