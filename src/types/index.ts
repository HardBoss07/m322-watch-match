export type StreamingProvider = 'netflix' | 'disney' | 'prime' | 'crunchyroll' | 'apple' | 'paramount';

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  type: 'movie' | 'series';
  year: number;
  duration?: string;
  episodes?: number;
  season?: number;
  fsk?: string;
  genres: string[];
  rating: number;
  ratingCount?: string;
  matchScore?: number;
  posterUrl: string;
  backdropUrl?: string;
  trailerUrl?: string;
  synopsis: string;
  providers: {
    id: StreamingProvider;
    name: string;
    quality: string;
    audio: string[];
  }[];
  studio?: string;
  director?: string;
  cast?: string[];
  hasDeAudio: boolean;
  isGermanAudioDefault: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userHandle: string;
  userAvatar: string;
  userAge?: number;
  isVerified?: boolean;
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  movieInfo: string;
  rating: number; // 1-10 or 1-5
  ratingMax: 5 | 10;
  text: string;
  isSpoiler: boolean;
  createdAt: string;
  likes: number;
  commentsCount: number;
  likedByMe?: boolean;
  savedToWatchlist?: boolean;
}

export interface Recommendation {
  id: string;
  senderName: string;
  senderAvatar: string;
  movieTitle: string;
  moviePoster: string;
  movieSubtitle: string;
  matchScore: number;
  provider: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  filmTip?: {
    movieId: string;
    title: string;
    poster: string;
    matchScore: number;
    provider: string;
  };
}

export interface ChatThread {
  id: string;
  participantName: string;
  participantHandle: string;
  participantAvatar: string;
  isOnline: boolean;
  matchPercent: number;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface UserBadge {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  level: number;
  rankTitle: string;
  currentXp: number;
  targetXp: number;
  bio: string;
  seenCount: number;
  watchlistCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
  matchPercentWithMe?: number;
  sharedHits?: number;
  sharedGenres?: string[];
  badges: UserBadge[];
  recentWatches: {
    movieId: string;
    title: string;
    poster: string;
    year: number;
    info: string;
    provider: string;
    audio: string;
    rating: number;
    watchedAgo: string;
    quality: string;
  }[];
}

export interface FilterSettings {
  providers: Record<StreamingProvider, boolean>;
  onlyDeAudio: boolean;
  hideUnreleased: boolean;
  maxRuntimeMinutes: number; // 80 - 210 (210 = no limit)
  pushNewSeasons: boolean;
  pushFriendRecommendations: boolean;
}
