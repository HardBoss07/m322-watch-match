/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Movie,
  Review,
  UserProfile,
  ChatThread,
  ChatMessage,
  FilterSettings,
} from './types';
import {
  MOCK_MOVIES,
  MOCK_REVIEWS,
  CURRENT_USER_PROFILE,
  DARIO_PROFILE,
  MOCK_CHATS,
  MOCK_DARIO_MESSAGES,
  INITIAL_FILTERS,
} from './data/mockData';
import { filterMovies } from './utils/matching';

// Modular UI Components
import { MobileFrame } from './components/MobileFrame';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { MatchDeck } from './components/MatchDeck';
import { DiscoverView } from './components/DiscoverView';
import { CommunityFeed } from './components/CommunityFeed';
import { WatchlistView } from './components/WatchlistView';
import { ProfileView } from './components/ProfileView';
import { TitleDetailModal } from './components/TitleDetailModal';
import { QuickReviewModal } from './components/QuickReviewModal';
import { SettingsModal } from './components/SettingsModal';
import { EditProfileModal } from './components/EditProfileModal';
import { SendRecommendationModal } from './components/SendRecommendationModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ChatView } from './components/ChatView';

export default function App() {
  // Navigation & Screen View State
  const [activeTab, setActiveTab] = useState<NavTab>('match');
  const [profileViewTarget, setProfileViewTarget] = useState<'my-profile' | 'friend-dario'>('my-profile');

  // Modals & Overlay Screens
  const [activeModal, setActiveModal] = useState<
    | null
    | 'title-detail'
    | 'quick-review'
    | 'settings'
    | 'edit-profile'
    | 'send-recommendation'
    | 'onboarding'
    | 'chat-view'
  >(null);

  // Data State
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
  const [chats, setChats] = useState<ChatThread[]>(MOCK_CHATS);
  const [darioMessages, setDarioMessages] = useState<ChatMessage[]>(MOCK_DARIO_MESSAGES);

  // Active selections
  const [selectedMovie, setSelectedMovie] = useState<Movie>(MOCK_MOVIES[0]);
  const [selectedChat, setSelectedChat] = useState<ChatThread>(MOCK_CHATS[0]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Filtered Movie list for Match Deck
  const deckMovies = filterMovies(movies, filters);

  // Handlers for Match Deck
  const handleMatch = (movie: Movie) => {
    if (!watchlist.some((m) => m.id === movie.id)) {
      setWatchlist((prev) => [movie, ...prev]);
    }
    showToast(`"${movie.title}" zur Watchlist hinzugefügt!`);
  };

  const handlePass = (movie: Movie) => {
    showToast(`"${movie.title}" übersprungen`);
  };

  const handleSuperlike = (movie: Movie) => {
    if (!watchlist.some((m) => m.id === movie.id)) {
      setWatchlist((prev) => [movie, ...prev]);
    }
    showToast(`Superlike für "${movie.title}"! ★`);
  };

  const handleOpenDetails = (movie: Movie) => {
    setSelectedMovie(movie);
    setActiveModal('title-detail');
  };

  const handleOpenMovieDetailsById = (movieId: string) => {
    const found = movies.find((m) => m.id === movieId);
    if (found) {
      setSelectedMovie(found);
      setActiveModal('title-detail');
    }
  };

  // Review Submissions
  const handleCreateReview = (newReviewData: Partial<Review>) => {
    const fullReview: Review = {
      id: `rev-${Date.now()}`,
      userId: myProfile.id,
      userName: myProfile.name,
      userHandle: myProfile.handle,
      userAvatar: myProfile.avatar,
      isVerified: true,
      movieId: newReviewData.movieId || 'custom',
      movieTitle: newReviewData.movieTitle || 'Stranger Things',
      moviePoster: newReviewData.moviePoster || MOCK_MOVIES[2].posterUrl,
      movieInfo: newReviewData.movieInfo || 'Netflix • 2022',
      rating: newReviewData.rating || 9,
      ratingMax: 10,
      text: newReviewData.text || '',
      isSpoiler: Boolean(newReviewData.isSpoiler),
      createdAt: 'Gerade eben',
      likes: 1,
      commentsCount: 0,
      likedByMe: true,
      savedToWatchlist: true,
    };

    setReviews((prev) => [fullReview, ...prev]);

    // Award XP
    setMyProfile((prev) => ({
      ...prev,
      currentXp: prev.currentXp + 20,
    }));

    showToast('Review veröffentlicht! +20 XP erhalten 🎉');
  };

  // Likes on Reviews
  const handleToggleLikeReview = (reviewId: string) => {
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
      })
    );
  };

  // Watchlist Toggles from reviews
  const handleToggleWatchlistByTitle = (title: string) => {
    const movie = movies.find((m) => m.title.toLowerCase().includes(title.toLowerCase()));
    if (movie) {
      if (watchlist.some((m) => m.id === movie.id)) {
        setWatchlist((prev) => prev.filter((m) => m.id !== movie.id));
        showToast(`"${movie.title}" aus Watchlist entfernt`);
      } else {
        setWatchlist((prev) => [movie, ...prev]);
        showToast(`"${movie.title}" auf Watchlist gespeichert!`);
      }
    }
  };

  // Sending recommendations to friends
  const handleSendRecommendation = (movieId: string, friendId: string, note: string) => {
    const targetMovie = movies.find((m) => m.id === movieId);
    if (!targetMovie) return;

    // Send into Dario messages
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      text: note || `Schau dir unbedingt ${targetMovie.title} an!`,
      timestamp: 'Jetzt',
      isMe: true,
      filmTip: {
        movieId: targetMovie.id,
        title: targetMovie.title,
        poster: targetMovie.posterUrl,
        matchScore: targetMovie.matchScore || 92,
        provider: `${targetMovie.providers[0]?.name || 'Netflix'} • DE-Synchro`,
      },
    };

    setDarioMessages((prev) => [...prev, newMsg]);
    showToast(`Filmtipp für "${targetMovie.title}" an Dario M. gesendet! 🚀`);
  };

  // Quick Jumper helper for user to directly preview any specific screen from design
  const handleQuickJump = (screenName: string) => {
    switch (screenName) {
      case 'Match Deck':
        setActiveModal(null);
        setActiveTab('match');
        break;
      case 'Title Detail':
        setSelectedMovie(MOCK_MOVIES[0]); // Cyberpunk
        setActiveModal('title-detail');
        break;
      case 'Quick Review':
        setSelectedMovie(MOCK_MOVIES[2]); // Stranger Things 4
        setActiveModal('quick-review');
        break;
      case 'Community Feed':
        setActiveModal(null);
        setActiveTab('community');
        break;
      case 'Chat Dario':
        setSelectedChat(chats[0]);
        setActiveModal('chat-view');
        break;
      case 'Friend Profile':
        setActiveModal(null);
        setProfileViewTarget('friend-dario');
        setActiveTab('profile');
        break;
      case 'My Profile':
        setActiveModal(null);
        setProfileViewTarget('my-profile');
        setActiveTab('profile');
        break;
      case 'Streaming Filters':
        setActiveModal('settings');
        break;
      case 'Send Recommendation':
        setActiveModal('send-recommendation');
        break;
      case 'Onboarding & Login':
        setActiveModal('onboarding');
        break;
      default:
        setActiveModal(null);
        break;
    }
  };

  // Calculate active screen label for top bar
  const getActiveScreenLabel = (): string => {
    if (activeModal === 'title-detail') return 'Title Detail';
    if (activeModal === 'quick-review') return 'Quick Review';
    if (activeModal === 'settings') return 'Streaming Filters';
    if (activeModal === 'edit-profile') return 'Profil bearbeiten';
    if (activeModal === 'send-recommendation') return 'Send Recommendation';
    if (activeModal === 'onboarding') return 'Onboarding & Login';
    if (activeModal === 'chat-view') return 'Chat Dario';
    if (activeTab === 'profile') {
      return profileViewTarget === 'friend-dario' ? 'Friend Profile' : 'My Profile';
    }
    if (activeTab === 'match') return 'Match Deck';
    if (activeTab === 'discover') return 'Discover';
    if (activeTab === 'community') return 'Community Feed';
    if (activeTab === 'watchlist') return 'Watchlist';
    return 'Match Deck';
  };

  return (
    <MobileFrame
      activeScreenName={getActiveScreenLabel()}
      onQuickJump={handleQuickJump}
    >
      <div className="flex-1 w-full flex flex-col h-full overflow-hidden relative">
        {/* Top Header (shown on tab views) */}
        <Header
          user={myProfile}
          onOpenProfile={() => {
            setProfileViewTarget('my-profile');
            setActiveTab('profile');
          }}
          onOpenSettings={() => setActiveModal('settings')}
          audioLanguage={filters.onlyDeAudio ? 'DE-Audio' : 'Alle Audio'}
        />

        {/* Main Tab Views (Scrollable) */}
        <main className="flex-1 w-full bg-[#131313] flex flex-col overflow-y-auto no-scrollbar">
          {activeTab === 'match' && (
            <MatchDeck
              movies={deckMovies.length > 0 ? deckMovies : movies}
              filters={filters}
              onOpenFilters={() => setActiveModal('settings')}
              onOpenDetails={handleOpenDetails}
              onMatch={handleMatch}
              onPass={handlePass}
              onSuperlike={handleSuperlike}
            />
          )}

          {activeTab === 'discover' && (
            <DiscoverView
              movies={movies}
              onOpenMovieDetails={handleOpenMovieDetailsById}
              onOpenFilters={() => setActiveModal('settings')}
            />
          )}

          {activeTab === 'community' && (
            <CommunityFeed
              reviews={reviews}
              chats={chats}
              onOpenReviewModal={() => {
                setSelectedMovie(MOCK_MOVIES[2]); // Stranger Things 4 default
                setActiveModal('quick-review');
              }}
              onOpenSendRecommendation={() => setActiveModal('send-recommendation')}
              onOpenChat={(chat) => {
                setSelectedChat(chat);
                setActiveModal('chat-view');
              }}
              onOpenUserProfile={(userId) => {
                if (userId === 'dario-m') {
                  setProfileViewTarget('friend-dario');
                } else {
                  setProfileViewTarget('my-profile');
                }
                setActiveTab('profile');
              }}
              onOpenMovieDetails={handleOpenMovieDetailsById}
              onToggleLike={handleToggleLikeReview}
              onToggleWatchlist={handleToggleWatchlistByTitle}
            />
          )}

          {activeTab === 'watchlist' && (
            <WatchlistView
              movies={watchlist}
              onOpenMovieDetails={handleOpenMovieDetailsById}
              onRemoveFromWatchlist={(movieId) => {
                setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
                showToast('Von Watchlist entfernt');
              }}
              onShareRecommendation={(movie) => {
                setSelectedMovie(movie);
                setActiveModal('send-recommendation');
              }}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              profile={profileViewTarget === 'friend-dario' ? darioProfile : myProfile}
              isMyProfile={profileViewTarget === 'my-profile'}
              onBack={() => setProfileViewTarget('my-profile')}
              onEditProfile={() => setActiveModal('edit-profile')}
              onOpenSettings={() => setActiveModal('settings')}
              onOpenChatWithUser={() => {
                setSelectedChat(chats[0]);
                setActiveModal('chat-view');
              }}
              onShareProfile={() => showToast('Profillink kopiert!')}
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
            />
          )}
        </main>

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
      {activeModal === 'title-detail' && (
        <TitleDetailModal
          movie={selectedMovie}
          isSaved={watchlist.some((m) => m.id === selectedMovie.id)}
          onClose={() => setActiveModal(null)}
          onAddToWatchlist={(m) => {
            handleMatch(m);
          }}
          onShareRecommendation={(m) => {
            setSelectedMovie(m);
            setActiveModal('send-recommendation');
          }}
        />
      )}

      {/* 2. Quick Review Modal */}
      {activeModal === 'quick-review' && (
        <QuickReviewModal
          movie={selectedMovie}
          onClose={() => setActiveModal(null)}
          onSubmitReview={handleCreateReview}
        />
      )}

      {/* 3. Streaming-Abos & Filter Settings */}
      {activeModal === 'settings' && (
        <SettingsModal
          filters={filters}
          onSave={(newFilters) => {
            setFilters(newFilters);
            showToast('Filter-Einstellungen gespeichert!');
          }}
          onClose={() => setActiveModal(null)}
          onOpenOnboarding={() => setActiveModal('onboarding')}
        />
      )}

      {/* 4. Edit Profile Modal */}
      {activeModal === 'edit-profile' && (
        <EditProfileModal
          profile={myProfile}
          onSave={(updated) => {
            setMyProfile((prev) => ({ ...prev, ...updated }));
            showToast('Profil erfolgreich aktualisiert!');
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* 5. Send Recommendation Modal */}
      {activeModal === 'send-recommendation' && (
        <SendRecommendationModal
          movies={movies}
          friends={chats}
          preselectedMovie={selectedMovie}
          onClose={() => setActiveModal(null)}
          onSend={handleSendRecommendation}
        />
      )}

      {/* 6. Direct Chat View */}
      {activeModal === 'chat-view' && (
        <ChatView
          chat={selectedChat}
          messages={darioMessages}
          onBack={() => setActiveModal(null)}
          onSendMessage={(text) => {
            const newMsg: ChatMessage = {
              id: `msg-${Date.now()}`,
              senderId: 'me',
              text: text,
              timestamp: 'Jetzt',
              isMe: true,
            };
            setDarioMessages((prev) => [...prev, newMsg]);

            // Simulate Dario's quick reply
            setTimeout(() => {
              const replyMsg: ChatMessage = {
                id: `reply-${Date.now()}`,
                senderId: 'dario-m',
                text: 'Absolut, sehe ich genauso! Lass uns das auf jeden Fall im nächsten Stream schauen.',
                timestamp: 'Gerade eben',
                isMe: false,
              };
              setDarioMessages((prev) => [...prev, replyMsg]);
            }, 1200);
          }}
          onOpenMovieDetails={handleOpenMovieDetailsById}
        />
      )}

      {/* 7. Onboarding & Login Setup */}
      {activeModal === 'onboarding' && (
        <OnboardingModal
          onClose={() => setActiveModal(null)}
          onComplete={(email, newFilters) => {
            setFilters((prev) => ({ ...prev, ...newFilters }));
            setMyProfile((prev) => ({
              ...prev,
              name: email.split('@')[0] || prev.name,
              handle: `@${email.split('@')[0]}`,
            }));
            showToast('Willkommen bei WatchMatch! Setup abgeschlossen.');
          }}
        />
      )}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#201f1f] border border-[#ffd405] text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 z-50 text-xs font-bold animate-in fade-in slide-in-from-bottom-2 duration-150">
          <span className="material-symbols-outlined text-[16px] text-[#ffd405]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </MobileFrame>
  );
}
