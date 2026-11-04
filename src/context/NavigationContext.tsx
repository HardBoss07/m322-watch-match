import React, { createContext, useContext, useState, useCallback } from 'react';
import { Movie, ChatThread } from '../types';
import { MOCK_MOVIES, MOCK_CHATS } from '../data/mockData';

export type NavTab = 'match' | 'discover' | 'community' | 'watchlist' | 'profile';

export type ActiveModal =
  | null
  | 'title-detail'
  | 'quick-review'
  | 'settings'
  | 'edit-profile'
  | 'send-recommendation'
  | 'onboarding'
  | 'chat-view';

interface NavigationContextType {
  activeTab: NavTab;
  activeModal: ActiveModal;
  selectedMovie: Movie;
  selectedChat: ChatThread;
  profileViewTarget: 'my-profile' | 'friend-dario';
  setActiveTab: (tab: NavTab) => void;
  setActiveModal: (modal: ActiveModal) => void;
  setSelectedMovie: (movie: Movie) => void;
  setSelectedChat: (chat: ChatThread) => void;
  setProfileViewTarget: (target: 'my-profile' | 'friend-dario') => void;
  openMovieDetails: (movieOrId: Movie | string) => void;
  openReviewModal: (movie?: Movie) => void;
  openRecommendationModal: (movie?: Movie) => void;
  openChatWith: (chat?: ChatThread) => void;
  openProfile: (target?: 'my-profile' | 'friend-dario') => void;
  openSettings: () => void;
  closeModal: () => void;
  quickJump: (screenName: string) => void;
  getActiveScreenLabel: () => string;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<NavTab>('match');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie>(MOCK_MOVIES[0]);
  const [selectedChat, setSelectedChat] = useState<ChatThread>(MOCK_CHATS[0]);
  const [profileViewTarget, setProfileViewTarget] = useState<'my-profile' | 'friend-dario'>('my-profile');

  const setActiveTab = useCallback((tab: NavTab) => {
    setActiveModal(null);
    setActiveTabState(tab);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const openMovieDetails = useCallback((movieOrId: Movie | string) => {
    if (typeof movieOrId === 'string') {
      const found = MOCK_MOVIES.find((m) => m.id === movieOrId);
      if (found) setSelectedMovie(found);
    } else {
      setSelectedMovie(movieOrId);
    }
    setActiveModal('title-detail');
  }, []);

  const openReviewModal = useCallback((movie?: Movie) => {
    if (movie) setSelectedMovie(movie);
    setActiveModal('quick-review');
  }, []);

  const openRecommendationModal = useCallback((movie?: Movie) => {
    if (movie) setSelectedMovie(movie);
    setActiveModal('send-recommendation');
  }, []);

  const openChatWith = useCallback((chat?: ChatThread) => {
    if (chat) setSelectedChat(chat);
    setActiveModal('chat-view');
  }, []);

  const openProfile = useCallback((target: 'my-profile' | 'friend-dario' = 'my-profile') => {
    setActiveModal(null);
    setProfileViewTarget(target);
    setActiveTabState('profile');
  }, []);

  const openSettings = useCallback(() => {
    setActiveModal('settings');
  }, []);

  const quickJump = useCallback((screenName: string) => {
    switch (screenName) {
      case 'Match Deck':
        setActiveModal(null);
        setActiveTabState('match');
        break;
      case 'Title Detail':
        setSelectedMovie(MOCK_MOVIES[0]);
        setActiveModal('title-detail');
        break;
      case 'Quick Review':
        setSelectedMovie(MOCK_MOVIES[2]);
        setActiveModal('quick-review');
        break;
      case 'Community Feed':
        setActiveModal(null);
        setActiveTabState('community');
        break;
      case 'Chat Dario':
        setSelectedChat(MOCK_CHATS[0]);
        setActiveModal('chat-view');
        break;
      case 'Friend Profile':
        setActiveModal(null);
        setProfileViewTarget('friend-dario');
        setActiveTabState('profile');
        break;
      case 'My Profile':
        setActiveModal(null);
        setProfileViewTarget('my-profile');
        setActiveTabState('profile');
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
  }, []);

  const getActiveScreenLabel = useCallback((): string => {
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
  }, [activeModal, activeTab, profileViewTarget]);

  return (
    <NavigationContext.Provider
      value={{
        activeTab,
        activeModal,
        selectedMovie,
        selectedChat,
        profileViewTarget,
        setActiveTab,
        setActiveModal,
        setSelectedMovie,
        setSelectedChat,
        setProfileViewTarget,
        openMovieDetails,
        openReviewModal,
        openRecommendationModal,
        openChatWith,
        openProfile,
        openSettings,
        closeModal,
        quickJump,
        getActiveScreenLabel,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
