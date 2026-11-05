import React, { useState } from "react";
import { Review, ChatThread } from "../types";
import { Button, IconButton } from "./ui/button";

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
  const [subTab, setSubTab] = useState<"reviews" | "chats">("reviews");
  const [revealedSpoilers, setRevealedSpoilers] = useState<
    Record<string, boolean>
  >({});

  const toggleSpoilerReveal = (id: string) => {
    setRevealedSpoilers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col w-full pb-24 max-w-lg mx-auto">
      {/* Sub-Tabs: Freunde & Reviews vs Direkt-Chats */}
      <div className="px-4 pt-2.5 pb-2 bg-surface sticky top-0 z-20">
        <div className="flex p-1 bg-surface-container-low border border-surface-bright rounded-xl gap-1">
          <Button
            variant={subTab === "reviews" ? "primary" : "ghost"}
            size="sm"
            radius="md"
            onClick={() => setSubTab("reviews")}
            className={`flex-1 font-bold ${
              subTab === "reviews"
                ? "text-white"
                : "text-tertiary hover:text-white"
            }`}
            leftIcon={
              <span className="material-symbols-outlined text-[18px]">
                group
              </span>
            }
          >
            Freunde & Reviews
          </Button>

          <Button
            variant={subTab === "chats" ? "primary" : "ghost"}
            size="sm"
            radius="md"
            onClick={() => setSubTab("chats")}
            className={`flex-1 font-bold ${
              subTab === "chats"
                ? "text-white"
                : "text-tertiary hover:text-white"
            }`}
            leftIcon={
              <span className="material-symbols-outlined text-[18px]">
                chat
              </span>
            }
            rightIcon={
              <span className="px-1.5 py-0.2 rounded-full bg-surface-container-high text-secondary text-[10px] font-bold">
                {chats.filter((c) => c.unreadCount > 0).length || 3}
              </span>
            }
          >
            Direkt-Chats
          </Button>
        </div>
      </div>

      {/* VIEW 1: Freunde & Reviews */}
      {subTab === "reviews" && (
        <div className="flex flex-col gap-3 px-4 pt-1">
          {/* Quick Action: Tipp an Freunde senden */}
          <div
            onClick={onOpenSendRecommendation}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpenSendRecommendation();
              }
            }}
            className="bg-surface-100 border border-surface-300 rounded-xl p-3 flex items-center justify-between shadow-sm cursor-pointer hover:border-surface-bright transition-colors min-h-[44px]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0 text-white">
                <span className="material-symbols-outlined text-[20px]">
                  send
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white truncate">
                  Filmtipp senden
                </span>
                <span className="text-[11px] text-tertiary truncate">
                  Sende einen Filmtipp direkt an deine Freunde
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-surface-container text-white text-[11px] font-semibold shrink-0">
              Tipp senden
            </span>
          </div>

          {/* Friend Recommendation Highlight Banner: Arcane S2 */}
          <div className="bg-surface-100 border border-surface-300 rounded-xl p-3 flex flex-col gap-2 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div
                onClick={() => onOpenUserProfile("dario-m")}
                className="flex items-center gap-2 min-w-0 cursor-pointer group min-h-[44px]"
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCX-DATfZHnME16uKVt6ohsEU31ezgDSVxOcOEmRXW0MlDDTT2yHeNNw_iZK7kEDnW09Q7oa6WzgdiapNlqNsVykTW7r23d0F_JC8CScXmxfWQ680JXQ91eGZl_rJA7nIABj6n_5apEseObUZ9oGXAqK-WVFms2wF-wBFlkuBe4OnxySo0ycSaCOXDlBF_gEBIMUr0IquTRM3BGJo9yvl-D1JCvzlXbJ9q5ccaUZrPrX0wRwgB9WkCK"
                  alt="Profilbild von Dario"
                  className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-secondary/50"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white group-hover:text-primary transition-colors truncate">
                    Dario empfiehlt
                  </span>
                  <span className="text-[10px] text-tertiary truncate">
                    Staffel 2 • 9.1/10 Match
                  </span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded bg-surface-container-high text-tertiary text-[10px] font-semibold">
                Heute
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcxi1K6Kj4ffG8g4_xb9SvzHFgmDyYSTgebhEIPgRUGOpg6C5p1He4eocAitUCWjZAPleZEQf1wmKAkzl1vkqAUJ-9uCXewTVGSKunEPxBNpluQwt1tK4ASE9n-hfiNKXGRsboY3FDWxYPacQM4FeF8SKtkK-qNmudLh9w79H41DpNhhmzFJznh9SP_XAVGgKQZNe8hmxtKUbrqxemSeMbkhf9dFzzSs-6MLjYYyXSCu-bmfio8yG3"
                alt="Poster von Arcane: Staffel 2"
                className="w-14 h-18 rounded-lg object-cover shrink-0 shadow-md cursor-pointer"
                onClick={() => onOpenMovieDetails("arcane-s2")}
              />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[10px] text-tertiary">Netflix Serie</span>
                <h4
                  onClick={() => onOpenMovieDetails("arcane-s2")}
                  className="text-sm font-bold text-white truncate cursor-pointer hover:text-primary-container transition-colors"
                >
                  Arcane: Staffel 2
                </h4>
                <div className="flex items-center gap-1 text-secondary text-[11px] font-bold mt-0.5">
                  <span className="material-symbols-outlined text-[14px] icon-filled">
                    star
                  </span>
                  <span>9.1</span>
                  <span className="text-tertiary font-normal">
                    • Höchste Match-Rate
                  </span>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                radius="md"
                onClick={() => onOpenMovieDetails("arcane-s2")}
                className="min-h-[44px] px-3.5 font-semibold"
                leftIcon={
                  <span className="material-symbols-outlined text-[16px] text-secondary icon-filled">
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
                className="bg-surface-100 border border-surface-300 rounded-xl p-3 flex flex-col gap-3 shadow-sm"
              >
                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div
                    onClick={() => onOpenUserProfile(rev.userId)}
                    className="flex items-center gap-2.5 min-w-0 cursor-pointer group min-h-[44px]"
                  >
                    <img
                      src={rev.userAvatar}
                      alt={`Profilbild von ${rev.userName}`}
                      className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-surface-bright"
                    />
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-white group-hover:text-primary-container transition-colors truncate">
                          {rev.userName} {rev.userAge ? `(${rev.userAge})` : ""}
                        </span>
                        {rev.isVerified && (
                          <span
                            className="material-symbols-outlined text-[15px] text-secondary icon-filled"
                            title="Verifizierter Nutzer"
                            aria-label="Verifiziert"
                          >
                            verified
                          </span>
                        )}
                        {rev.isSpoiler && (
                          <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-secondary text-[9px] font-bold">
                            Spoiler
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-tertiary text-[10px]">
                        <span className="truncate">{rev.userHandle}</span>
                        <span>•</span>
                        <span className="shrink-0">{rev.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <IconButton
                    aria-label={`Mehr Optionen zu Review von ${rev.userName}`}
                    variant="ghost"
                    size="sm"
                    radius="full"
                    className="min-h-[44px] min-w-[44px] text-tertiary hover:text-white"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      more_horiz
                    </span>
                  </IconButton>
                </div>

                {/* Embedded Movie Ribbon */}
                <div
                  onClick={() => onOpenMovieDetails(rev.movieId)}
                  className="flex items-center gap-2.5 p-2 bg-surface border border-surface-bright rounded-lg cursor-pointer hover:border-surface-300 transition-colors min-h-[44px]"
                >
                  <img
                    src={rev.moviePoster}
                    alt={`Poster von ${rev.movieTitle}`}
                    className="w-11 h-14 rounded object-cover shrink-0 shadow"
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-bold text-white truncate">
                      {rev.movieTitle}
                    </span>
                    <span className="text-[10px] text-tertiary mt-0.5">
                      {rev.movieInfo}
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-0.5 text-secondary pr-1"
                    aria-label={`Bewertung: ${rev.rating} von 5`}
                  >
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className={`material-symbols-outlined text-[14px] ${
                          rev.rating >= s
                            ? "icon-filled text-secondary"
                            : "text-surface-container-highest"
                        }`}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>

                {/* Review Text with Spoiler Protection */}
                <div className="relative pl-1">
                  <p
                    className={`text-xs text-white leading-relaxed ${
                      isObscured ? "filter blur-sm select-none" : ""
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
                      leftIcon={
                        <span className="material-symbols-outlined text-[16px]">
                          visibility
                        </span>
                      }
                      className="absolute inset-0 min-h-[44px] bg-black/60 backdrop-blur-xs text-secondary hover:text-secondary hover:bg-black/70 font-bold"
                    >
                      Spoiler anzeigen
                    </Button>
                  )}
                </div>

                {/* Bottom Actions: Like, Comment, Watchlist */}
                <div className="flex items-center justify-between pt-1 border-t border-surface-container-high">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      radius="full"
                      onClick={() => onToggleLike(rev.id)}
                      aria-label={`${rev.likes} Gefällt mir Angaben`}
                      leftIcon={
                        <span
                          className={`material-symbols-outlined text-[18px] ${
                            rev.likedByMe
                              ? "icon-filled text-primary-container"
                              : ""
                          }`}
                        >
                          favorite
                        </span>
                      }
                      className="px-3 min-h-[44px] min-w-[44px] text-xs text-tertiary hover:text-primary-container"
                    >
                      <span className="font-bold text-white">{rev.likes}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      radius="full"
                      aria-label={`${rev.commentsCount} Kommentare`}
                      leftIcon={
                        <span className="material-symbols-outlined text-[18px]">
                          chat_bubble
                        </span>
                      }
                      className="px-3 min-h-[44px] min-w-[44px] text-xs text-tertiary hover:text-white"
                    >
                      <span className="font-bold text-white">
                        {rev.commentsCount}
                      </span>
                    </Button>
                  </div>

                  <Button
                    variant={rev.savedToWatchlist ? "primary" : "secondary"}
                    size="sm"
                    radius="md"
                    onClick={() => onToggleWatchlist(rev.movieTitle)}
                    aria-label={
                      rev.savedToWatchlist
                        ? `Aus Watchlist entfernen: ${rev.movieTitle}`
                        : `Auf Watchlist speichern: ${rev.movieTitle}`
                    }
                    leftIcon={
                      <span className="material-symbols-outlined text-[15px]">
                        {rev.savedToWatchlist
                          ? "bookmark_added"
                          : "bookmark_add"}
                      </span>
                    }
                    className="min-h-[44px] px-3.5 text-xs font-semibold"
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
      {subTab === "chats" && (
        <div className="flex flex-col gap-2 px-4 pt-1">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Aktive Unterhaltungen
            </span>
            <span className="text-[11px] text-tertiary">3 Kontakte</span>
          </div>

          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onOpenChat(chat)}
              className="bg-surface-100 border border-surface-300 hover:border-surface-bright p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all active:scale-[0.99] shadow-sm min-h-[44px]"
            >
              <div className="relative shrink-0">
                <img
                  src={chat.participantAvatar}
                  alt={`Profilbild von ${chat.participantName}`}
                  className="w-12 h-12 rounded-full object-cover ring-1 ring-surface-bright"
                />
                {chat.isOnline && (
                  <span
                    className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-surface-100"
                    title="Online"
                    aria-label="Online Status"
                  ></span>
                )}
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-bold text-white truncate">
                      {chat.participantName}
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full bg-secondary-container/15 text-secondary text-[10px] font-bold">
                      {chat.matchPercent}% Match
                    </span>
                  </div>
                  <span className="text-[10px] text-tertiary shrink-0 font-mono">
                    {chat.lastMessageTime}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-tertiary truncate pr-2">
                    {chat.lastMessage}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary-container text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Button */}
      <div className="sticky bottom-4 self-end mr-4 z-30 mt-2">
        <Button
          variant="primary"
          size="md"
          radius="full"
          onClick={onOpenReviewModal}
          leftIcon={
            <span className="material-symbols-outlined text-[18px]">edit</span>
          }
          className="shadow-xl shadow-primary-container/40 font-bold min-h-[44px] px-4"
        >
          Review verfassen
        </Button>
      </div>
    </div>
  );
};
