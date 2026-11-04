import { useState, useCallback } from 'react';
import { UserProfile } from '../../types';
import { CURRENT_USER_PROFILE, DARIO_PROFILE, MOCK_MOVIES } from '../../data/mockData';

// Extended watch history items for the full expansion
export const EXTENDED_WATCH_HISTORY = [
  {
    movieId: 'arcane-s1',
    title: 'Arcane: League of Legends',
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80',
    provider: 'Netflix',
    audio: 'DE 5.1',
    rating: 9.8,
    info: 'Staffel 1 • Animation / Sci-Fi',
    watchedAgo: 'vor 5 Tagen',
    quality: '4K HDR',
  },
  {
    movieId: 'blade-runner-2049',
    title: 'Blade Runner 2049',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80',
    provider: 'Prime Video',
    audio: 'DE Dolby Atmos',
    rating: 9.4,
    info: 'Film • 164 Min • Sci-Fi Noir',
    watchedAgo: 'vor 1 Woche',
    quality: '4K UHD',
  },
  {
    movieId: 'attack-on-titan-final',
    title: 'Attack on Titan: Final Season',
    poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80',
    provider: 'Crunchyroll',
    audio: 'DE Synchro',
    rating: 9.6,
    info: 'Anime • Ep. 87 • Dark Fantasy',
    watchedAgo: 'vor 2 Wochen',
    quality: '1080p',
  },
  {
    movieId: 'dune-part-2',
    title: 'Dune: Part Two',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80',
    provider: 'Apple TV+',
    audio: 'DE Dolby Digital',
    rating: 9.5,
    info: 'Film • 166 Min • Epos / Sci-Fi',
    watchedAgo: 'vor 3 Wochen',
    quality: '4K Dolby Vision',
  },
];

export function useProfile() {
  const [myProfile, setMyProfile] = useState<UserProfile>(CURRENT_USER_PROFILE);
  const [darioProfile, setDarioProfile] = useState<UserProfile>(DARIO_PROFILE);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState<boolean>(false);

  const toggleFollowDario = useCallback(() => {
    setDarioProfile((prev) => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      followersCount: prev.isFollowing ? prev.followersCount - 1 : prev.followersCount + 1,
    }));
  }, []);

  const addXp = useCallback((amount: number = 20) => {
    setMyProfile((prev) => {
      const nextXp = prev.currentXp + amount;
      const leveledUp = nextXp >= prev.targetXp;
      return {
        ...prev,
        currentXp: leveledUp ? nextXp - prev.targetXp : nextXp,
        level: leveledUp ? prev.level + 1 : prev.level,
      };
    });
  }, []);

  const toggleHistoryExpanded = useCallback(() => {
    setIsHistoryExpanded((prev) => !prev);
  }, []);

  return {
    myProfile,
    setMyProfile,
    darioProfile,
    setDarioProfile,
    toggleFollowDario,
    addXp,
    isHistoryExpanded,
    toggleHistoryExpanded,
  };
}
