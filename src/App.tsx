/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback } from "react";
import {
  Movie,
  Review,
  UserProfile,
  ChatThread,
  ChatMessage,
  FilterSettings,
} from "./types";
import {
  MOCK_MOVIES,
  MOCK_REVIEWS,
  CURRENT_USER_PROFILE,
  DARIO_PROFILE,
  MOCK_CHATS,
  MOCK_DARIO_MESSAGES,
  INITIAL_FILTERS,
} from "./data/mockData";
import { filterMovies } from "./utils/matching";

// Context Providers
import { ToastProvider, useToast } from "./context/ToastContext";

// Feature Components & Hooks
import { MatchDeck } from "./features/deck/MatchDeck";
import { ChatView } from "./features/chat/ChatView";
import { RecommendationModal } from "./features/chat/RecommendationModal";
import { StreamingFilters } from "./features/filters/StreamingFilters";
import { ReviewModal } from "./features/review/ReviewModal";
import { ProfileView } from "./features/profile/ProfileView";

// Standard Components
import { MobileFrame } from "./components/MobileFrame";
import { Header } from "./components/Header";
import { BottomNav, NavTab } from "./components/BottomNav";
import { DiscoverView } from "./components/DiscoverView";
import { CommunityFeed } from "./components/CommunityFeed";
import { WatchlistView } from "./components/WatchlistView";
import { TitleDetailModal } from "./components/TitleDetailModal";
import { EditProfileModal } from "./components/EditProfileModal";
import { OnboardingModal } from "./components/OnboardingModal";

function AppContent() {
  const { showToast } = useToast();

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>("match");
  const [profileViewTarget, setProfileViewTarget] = useState<
    "my-profile" | "friend-dario"
  >("my-profile");

  // Modals & Overlay Screens
  const [activeModal, setActiveModal] = useState<
    | null
    | "title-detail"
    | "quick-review"
    | "settings"
    | "edit-profile"
    | "send-recommendation"
    | "onboarding"
    | "chat-view"
  >(null);

  // App Data State
  const [filters, setFilters] = useState<FilterSettings>(INITIAL_FILTERS);
  const [movies] = useState<Movie[]>(MOCK_MOVIES);
  const [watchlist, setWatchlist] = useState<Movie[]>([
    MOCK_MOVIES[0], // Cyberpunk
    MOCK_MOVIES[3], // Interstellar
    MOCK_MOVIES[6], // The Batman
  ]);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [myProfile, setMyProfile] = useState<UserProfile>(CURRENT_USER_PROFILE);
  const [darioProfile, setDarioProfile] = useState<UserProfile>(DARIO_PROFILE);
  const [chats] = useState<ChatThread[]>(MOCK_CHATS);
  const [darioMessages, setDarioMessages] =
    useState<ChatMessage[]>(MOCK_DARIO_MESSAGES);

  // Active Selections
  const [selectedMovie, setSelectedMovie] = useState<Movie>(MOCK_MOVIES[0]);
  const [selectedChat, setSelectedChat] = useState<ChatThread>(MOCK_CHATS[0]);

  // Filtered Movie list for Match Deck
  const deckMovies = useMemo(() => {
    const filtered = filterMovies(movies, filters);
    return filtered.length > 0 ? filtered : movies;
  }, [movies, filters]);

  // Match Deck Actions
  const handleMatch = useCallback(
    (movie: Movie) => {
      setWatchlist((prev) => {
        if (prev.some((m) => m.id === movie.id)) return prev;
        return [movie, ...prev];
      });
      showToast(`"${movie.title}" zu deiner Watchlist hinzugefügt!`);
    },
    [showToast],
  );

  const handlePass = useCallback(
    (movie: Movie) => {
      showToast(`"${movie.title}" übersprungen`);
    },
    [showToast],
  );

  const handleSuperlike = useCallback(
    (movie: Movie) => {
      setWatchlist((prev) => {
        if (prev.some((m) => m.id === movie.id)) return prev;
        return [movie, ...prev];
      });
      showToast(`Superlike für "${movie.title}"! ★`);
    },
    [showToast],
  );

  const handleOpenDetails = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
    setActiveModal("title-detail");
  }, []);

  const handleOpenMovieDetailsById = useCallback(
    (movieId: string) => {
      const found = movies.find((m) => m.id === movieId);
      if (found) {
        setSelectedMovie(found);
        setActiveModal("title-detail");
      }
    },
    [movies],
  );

  // Review Flow
  const handleOpenReview = useCallback((movie?: Movie) => {
    if (movie) setSelectedMovie(movie);
    setActiveModal("quick-review");
  }, []);

  const handleCreateReview = useCallback(
    (newReviewData: Partial<Review>) => {
      const fullReview: Review = {
        id: `rev-${Date.now()}`,
        userId: myProfile.id,
        userName: myProfile.name,
        userHandle: myProfile.handle,
        userAvatar: myProfile.avatar,
        isVerified: true,
        movieId: newReviewData.movieId || selectedMovie.id,
        movieTitle: newReviewData.movieTitle || selectedMovie.title,
        moviePoster: newReviewData.moviePoster || selectedMovie.posterUrl,
        movieInfo:
          newReviewData.movieInfo ||
          `${selectedMovie.providers[0]?.name || "Netflix"} • ${selectedMovie.year}`,
        rating: newReviewData.rating || 9,
        ratingMax: 10,
        text: newReviewData.text || "",
        isSpoiler: Boolean(newReviewData.isSpoiler),
        createdAt: "Gerade eben",
        likes: 1,
        commentsCount: 0,
        likedByMe: true,
        savedToWatchlist: true,
      };

      setReviews((prev) => [fullReview, ...prev]);

      // Award +20 XP
      setMyProfile((prev) => ({
        ...prev,
        currentXp: prev.currentXp + 20,
      }));

      showToast("Review veröffentlicht! +20 XP erhalten 🎉");
    },
    [myProfile, selectedMovie, showToast],
  );

  const handleToggleLikeReview = useCallback((reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const nextLiked = !r.likedByMe;
          return {
            ...r,
            likedByMe: nextLiked,
            likes: nextLiked ? r.likes + 1 : r.likes - 1,
          };
        }
        return r;
      }),
    );
  }, []);

  const handleToggleWatchlistByTitle = useCallback(
    (title: string) => {
      const movie = movies.find((m) =>
        m.title.toLowerCase().includes(title.toLowerCase()),
      );
      if (movie) {
        setWatchlist((prev) => {
          if (prev.some((m) => m.id === movie.id)) {
            showToast(`"${movie.title}" aus Watchlist entfernt`);
            return prev.filter((m) => m.id !== movie.id);
          } else {
            showToast(`"${movie.title}" auf Watchlist gespeichert!`);
            return [movie, ...prev];
          }
        });
      }
    },
    [movies, showToast],
  );

  // Recommendation Flow: Sends recommendation and auto-routes directly to recipient's Chat
  const handleSendRecommendation = useCallback(
    (movieId: string, friendId: string, note: string) => {
      const targetMovie = movies.find((m) => m.id === movieId);
      if (!targetMovie) return;

      const targetFriend = chats.find((c) => c.id === friendId) || chats[0];

      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: "me",
        text: note || `Schau dir unbedingt ${targetMovie.title} an!`,
        timestamp: "Jetzt",
        isMe: true,
        filmTip: {
          movieId: targetMovie.id,
          title: targetMovie.title,
          poster: targetMovie.posterUrl,
          matchScore: targetMovie.matchScore || 92,
          provider: `${targetMovie.providers[0]?.name || "Netflix"} • DE-Synchro`,
        },
      };

      setDarioMessages((prev) => [...prev, newMsg]);
      setSelectedChat(targetFriend);

      // Auto-transition directly to the chat view with that recipient
      setActiveModal("chat-view");
      showToast(`Filmtipp an ${targetFriend.participantName} gesendet! 🚀`);
    },
    [chats, movies, showToast],
  );

  // Quick Jumper helper for user to directly preview any specific screen
  const handleQuickJump = useCallback(
    (screenName: string) => {
      switch (screenName) {
        case "Match Deck":
          setActiveModal(null);
          setActiveTab("match");
          break;
        case "Title Detail":
          setSelectedMovie(MOCK_MOVIES[0]);
          setActiveModal("title-detail");
          break;
        case "Quick Review":
          setSelectedMovie(MOCK_MOVIES[2]);
          setActiveModal("quick-review");
          break;
        case "Community Feed":
          setActiveModal(null);
          setActiveTab("community");
          break;
        case "Chat Dario":
          setSelectedChat(chats[0]);
          setActiveModal("chat-view");
          break;
        case "Friend Profile":
          setActiveModal(null);
          setProfileViewTarget("friend-dario");
          setActiveTab("profile");
          break;
        case "My Profile":
          setActiveModal(null);
          setProfileViewTarget("my-profile");
          setActiveTab("profile");
          break;
        case "Streaming Filters":
          setActiveModal("settings");
          break;
        case "Send Recommendation":
          setActiveModal("send-recommendation");
          break;
        case "Onboarding & Login":
          setActiveModal("onboarding");
          break;
        default:
          setActiveModal(null);
          break;
      }
    },
    [chats],
  );

  // Active Screen Label for the Top Frame Bar
  const activeScreenLabel = useMemo((): string => {
    if (activeModal === "title-detail") return "Title Detail";
    if (activeModal === "quick-review") return "Quick Review";
    if (activeModal === "settings") return "Streaming Filters";
    if (activeModal === "edit-profile") return "Profil bearbeiten";
    if (activeModal === "send-recommendation") return "Send Recommendation";
    if (activeModal === "onboarding") return "Onboarding & Login";
    if (activeModal === "chat-view") return "Chat Dario";
    if (activeTab === "profile") {
      return profileViewTarget === "friend-dario"
        ? "Friend Profile"
        : "My Profile";
    }
    if (activeTab === "match") return "Match Deck";
    if (activeTab === "discover") return "Discover";
    if (activeTab === "community") return "Community Feed";
    if (activeTab === "watchlist") return "Watchlist";
    return "Match Deck";
  }, [activeModal, activeTab, profileViewTarget]);

  return (
    <MobileFrame
      activeScreenName={activeScreenLabel}
      onQuickJump={handleQuickJump}
    >
      <div className="flex-1 w-full flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <Header
          user={myProfile}
          onOpenProfile={() => {
            setProfileViewTarget("my-profile");
            setActiveTab("profile");
          }}
          onOpenSettings={() => setActiveModal("settings")}
          onOpenRecommendation={() => setActiveModal("send-recommendation")}
          onEditProfile={() => setActiveModal("edit-profile")}
          onLogoClick={() => {
            setActiveModal(null);
            setActiveTab("match");
          }}
          audioLanguage={
            filters.audioLanguages && filters.audioLanguages.length > 0
              ? filters.audioLanguages.join(", ")
              : "DE"
          }
          onSelectLanguage={(langCode) => {
            setFilters((prev) => ({
              ...prev,
              audioLanguages: [langCode],
              onlyDeAudio: langCode === "DE",
            }));
            showToast(`Tonspur auf ${langCode} gesetzt`);
          }}
        />

        {/* Main Tab Views */}
        <main className="flex-1 min-h-0 w-full bg-[#131313] flex flex-col overflow-y-auto no-scrollbar">
          {activeTab === "match" && (
            <MatchDeck
              movies={deckMovies}
              filters={filters}
              onOpenFilters={() => setActiveModal("settings")}
              onOpenDetails={handleOpenDetails}
              onOpenReview={handleOpenReview}
              onMatch={handleMatch}
              onPass={handlePass}
              onSuperlike={handleSuperlike}
              onDeckWrapped={(msg) => showToast(msg)}
            />
          )}

          {activeTab === "discover" && (
            <DiscoverView
              movies={movies}
              onOpenMovieDetails={handleOpenMovieDetailsById}
              onOpenFilters={() => setActiveModal("settings")}
            />
          )}

          {activeTab === "community" && (
            <CommunityFeed
              reviews={reviews}
              chats={chats}
              onOpenReviewModal={() => {
                setSelectedMovie(MOCK_MOVIES[2]);
                setActiveModal("quick-review");
              }}
              onOpenSendRecommendation={() =>
                setActiveModal("send-recommendation")
              }
              onOpenChat={(chat) => {
                setSelectedChat(chat);
                setActiveModal("chat-view");
              }}
              onOpenUserProfile={(userId) => {
                if (userId === "dario-m") {
                  setProfileViewTarget("friend-dario");
                } else {
                  setProfileViewTarget("my-profile");
                }
                setActiveTab("profile");
              }}
              onOpenMovieDetails={handleOpenMovieDetailsById}
              onToggleLike={handleToggleLikeReview}
              onToggleWatchlist={handleToggleWatchlistByTitle}
            />
          )}

          {activeTab === "watchlist" && (
            <WatchlistView
              movies={watchlist}
              onOpenMovieDetails={handleOpenMovieDetailsById}
              onRemoveFromWatchlist={(movieId) => {
                setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
                showToast("Von Watchlist entfernt");
              }}
              onShareRecommendation={(movie) => {
                setSelectedMovie(movie);
                setActiveModal("send-recommendation");
              }}
            />
          )}

          {activeTab === "profile" && (
            <ProfileView
              profile={
                profileViewTarget === "friend-dario" ? darioProfile : myProfile
              }
              isMyProfile={profileViewTarget === "my-profile"}
              onBack={() => setProfileViewTarget("my-profile")}
              onEditProfile={() => setActiveModal("edit-profile")}
              onOpenSettings={() => setActiveModal("settings")}
              onOpenChatWithUser={() => {
                setSelectedChat(chats[0]);
                setActiveModal("chat-view");
              }}
              onShareProfile={() => showToast("Profillink kopiert!")}
              onOpenMovieDetails={handleOpenMovieDetailsById}
              onToggleFollow={() => {
                setDarioProfile((prev) => ({
                  ...prev,
                  isFollowing: !prev.isFollowing,
                  followersCount: prev.isFollowing
                    ? prev.followersCount - 1
                    : prev.followersCount + 1,
                }));
              }}
              showToast={showToast}
              audioLanguage={filters.audioLanguages?.join(", ") || "DE"}
            />
          )}
        </main>

        {/* Global Quick Action Floating Action Button (FAB) */}
        {!activeModal && activeTab !== "community" && (
          <button
            type="button"
            onClick={() => setActiveModal("send-recommendation")}
            aria-label="Filmtipp senden"
            className="absolute bottom-20 right-4 z-30 w-12 h-12 rounded-full bg-[#d80b69] hover:bg-[#ba095b] text-white shadow-xl shadow-[#d80b69]/40 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer group"
            title="Filmtipp senden"
          >
            <span className="material-symbols-outlined text-[24px] font-bold transition-transform duration-200 group-hover:rotate-90">
              add
            </span>
          </button>
        )}

        {/* Persistent Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveModal(null);
            setActiveTab(tab);
          }}
          watchlistCount={watchlist.length}
        />
      </div>

      {/* OVERLAY MODALS & SCREENS */}

      {/* 1. Title Detail View */}
      {activeModal === "title-detail" && (
        <TitleDetailModal
          movie={selectedMovie}
          isSaved={watchlist.some((m) => m.id === selectedMovie.id)}
          onClose={() => setActiveModal(null)}
          onAddToWatchlist={(m) => {
            handleMatch(m);
          }}
          onShareRecommendation={(m) => {
            setSelectedMovie(m);
            setActiveModal("send-recommendation");
          }}
        />
      )}

      {/* 2. Simplified Quick Review Modal */}
      {activeModal === "quick-review" && (
        <ReviewModal
          movie={selectedMovie}
          onClose={() => setActiveModal(null)}
          onSubmitReview={handleCreateReview}
        />
      )}

      {/* 3. Streaming-Abos & Filter Settings */}
      {activeModal === "settings" && (
        <StreamingFilters
          filters={filters}
          onSave={(newFilters) => {
            setFilters(newFilters);
            showToast("Filter-Einstellungen gespeichert!");
          }}
          onClose={() => setActiveModal(null)}
          onOpenOnboarding={() => setActiveModal("onboarding")}
        />
      )}

      {/* 4. Edit Profile Modal */}
      {activeModal === "edit-profile" && (
        <EditProfileModal
          profile={myProfile}
          onSave={(updated) => {
            setMyProfile((prev) => ({ ...prev, ...updated }));
            showToast("Profil erfolgreich aktualisiert!");
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* 5. Send Recommendation Modal (With Auto-Route to Chat) */}
      {activeModal === "send-recommendation" && (
        <RecommendationModal
          movies={movies}
          friends={chats}
          preselectedMovie={selectedMovie}
          onClose={() => setActiveModal(null)}
          onSend={handleSendRecommendation}
        />
      )}

      {/* 6. Direct Chat View */}
      {activeModal === "chat-view" && (
        <ChatView
          chat={selectedChat}
          messages={darioMessages}
          onBack={() => setActiveModal(null)}
          onSendMessage={(text) => {
            const newMsg: ChatMessage = {
              id: `msg-${Date.now()}`,
              senderId: "me",
              text: text,
              timestamp: "Jetzt",
              isMe: true,
            };
            setDarioMessages((prev) => [...prev, newMsg]);

            setTimeout(() => {
              const replyMsg: ChatMessage = {
                id: `reply-${Date.now()}`,
                senderId: "dario-m",
                text: "Absolut, sehe ich genauso! Lass uns das auf jeden Fall im nächsten Stream schauen.",
                timestamp: "Gerade eben",
                isMe: false,
              };
              setDarioMessages((prev) => [...prev, replyMsg]);
            }, 1200);
          }}
          onOpenMovieDetails={handleOpenMovieDetailsById}
        />
      )}

      {/* 7. Onboarding & Login Setup */}
      {activeModal === "onboarding" && (
        <OnboardingModal
          onClose={() => setActiveModal(null)}
          onComplete={(email, newFilters) => {
            setFilters((prev) => ({ ...prev, ...newFilters }));
            setMyProfile((prev) => ({
              ...prev,
              name: email.split("@")[0] || prev.name,
              handle: `@${email.split("@")[0]}`,
            }));
            showToast("Willkommen bei WatchMatch! Setup abgeschlossen.");
          }}
        />
      )}
    </MobileFrame>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
