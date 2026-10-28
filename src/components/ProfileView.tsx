import React, { useState } from 'react';
import { UserProfile, Movie } from '../types';
import { Button, IconButton, ButtonIcon } from './ui/button';

interface ProfileViewProps {
  profile: UserProfile;
  isMyProfile: boolean;
  onBack?: () => void;
  onEditProfile?: () => void;
  onOpenSettings?: () => void;
  onOpenChatWithUser?: () => void;
  onShareProfile?: () => void;
  onOpenMovieDetails?: (movieId: string) => void;
  onToggleFollow?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  isMyProfile,
  onBack,
  onEditProfile,
  onOpenSettings,
  onOpenChatWithUser,
  onShareProfile,
  onOpenMovieDetails,
  onToggleFollow,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'watchlist' | 'reviews' | 'shared'>('history');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  const xpPercent = Math.min(Math.round((profile.currentXp / profile.targetXp) * 100), 100);
  const xpRemaining = Math.max(profile.targetXp - profile.currentXp, 0);

  return (
    <div className="flex flex-col w-full pb-24 max-w-lg mx-auto">
      {/* Top Bar Navigation */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        {!isMyProfile ? (
          <IconButton
            onClick={onBack}
            aria-label="Zurück"
            variant="secondary"
            size="md"
            radius="full"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </IconButton>
        ) : (
          <span className="text-xs font-bold text-[#a3a3a3] uppercase tracking-wider">Mein Profil</span>
        )}

        <div className="flex items-center gap-1.5 ml-auto">
          <IconButton
            onClick={() => {
              if (onShareProfile) onShareProfile();
              else showToast('Profillink in die Zwischenablage kopiert!');
            }}
            aria-label="Profil teilen"
            variant="secondary"
            size="md"
            radius="full"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
          </IconButton>
          {isMyProfile && (
            <IconButton
              onClick={onOpenSettings}
              aria-label="Einstellungen"
              variant="secondary"
              size="md"
              radius="full"
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
            </IconButton>
          )}
        </div>
      </div>

      {/* Main Profile Info Card */}
      <div className="px-4">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 shadow-md flex flex-col gap-3 relative overflow-hidden">
          {/* Header Row: Avatar & Primary Actions */}
          <div className="flex items-start justify-between gap-3">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-[#333333] shadow-md">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 bg-[#ffd405] text-[#0a0a0a] font-bold text-[10px] px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[12px] icon-filled">stars</span>
                Lv. {profile.level}
              </span>
            </div>

            {/* Actions */}
            {isMyProfile ? (
              <div className="flex flex-col gap-1.5 items-end">
                <Button
                  variant="secondary"
                  size="sm"
                  radius="md"
                  onClick={onEditProfile}
                  leftIcon={<span className="material-symbols-outlined text-[16px]">edit</span>}
                  className="font-bold"
                >
                  Profil bearbeiten
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  radius="md"
                  onClick={onOpenSettings}
                  leftIcon={<span className="material-symbols-outlined text-[15px]">tune</span>}
                  className="h-8 px-2.5 text-[#a3a3a3] hover:text-white text-[11px]"
                >
                  Streaming-Abos
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant={profile.isFollowing ? 'secondary' : 'primary'}
                  size="sm"
                  radius="md"
                  onClick={() => {
                    if (onToggleFollow) onToggleFollow();
                    showToast(profile.isFollowing ? `${profile.name} entfolgt` : `Du folgst jetzt ${profile.name}`);
                  }}
                  leftIcon={
                    <span className="material-symbols-outlined text-[16px]">
                      {profile.isFollowing ? 'check' : 'person_add'}
                    </span>
                  }
                  className="font-bold"
                >
                  {profile.isFollowing ? 'Folge ich' : 'Folgen'}
                </Button>

                <IconButton
                  onClick={onOpenChatWithUser}
                  aria-label="Nachricht senden"
                  variant="secondary"
                  size="md"
                  radius="md"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                </IconButton>
              </div>
            )}
          </div>

          {/* Name & Title */}
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold text-white tracking-tight">{profile.name}</h1>
              <span className="material-symbols-outlined text-[#ffd405] text-[18px] icon-filled">
                verified
              </span>
            </div>
            <p className="text-xs text-[#a3a3a3] mt-0.5">
              {profile.handle} • <span className="text-white font-medium">{profile.rankTitle}</span>
            </p>
          </div>

          {/* Bio Box */}
          <blockquote className="bg-[#121212] border border-[#262626] p-2.5 rounded-xl text-xs text-[#d4d4d4] italic leading-relaxed">
            {profile.bio}
          </blockquote>

          {/* Numerical Stats Strip */}
          <div className="grid grid-cols-4 gap-2 pt-1 text-center">
            <div className="bg-[#121212] py-2 px-1 rounded-xl border border-[#262626]">
              <span className="block text-sm font-bold text-white">{profile.seenCount}</span>
              <span className="block text-[10px] text-[#a3a3a3]">Gesehen</span>
            </div>
            <div className="bg-[#121212] py-2 px-1 rounded-xl border border-[#262626]">
              <span className="block text-sm font-bold text-white">{profile.watchlistCount}</span>
              <span className="block text-[10px] text-[#a3a3a3]">Watchlist</span>
            </div>
            <div className="bg-[#121212] py-2 px-1 rounded-xl border border-[#262626]">
              <span className="block text-sm font-bold text-white">{profile.followersCount}</span>
              <span className="block text-[10px] text-[#a3a3a3]">Follower</span>
            </div>
            <div className="bg-[#121212] py-2 px-1 rounded-xl border border-[#262626]">
              <span className="block text-sm font-bold text-white">
                {isMyProfile ? `Lv. ${profile.level}` : profile.followingCount}
              </span>
              <span className="block text-[10px] text-[#a3a3a3]">
                {isMyProfile ? 'Cineast' : 'Folgt'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Friend Taste Match Card (Shown on friend profile) */}
      {!isMyProfile && profile.matchPercentWithMe && (
        <div className="px-4 mt-3">
          <div className="bg-[#1a1a1a] border border-[#ffd405]/30 p-3.5 rounded-2xl flex flex-col gap-2.5 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#fbd100] text-[#3b2f00] flex items-center justify-center font-black">
                  <span className="material-symbols-outlined text-[22px] icon-filled">bolt</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-black text-[#fbd100]">
                      {profile.matchPercentWithMe}%
                    </span>
                    <span className="text-xs font-bold text-white">Geschmack-Match</span>
                  </div>
                  <p className="text-[10px] text-[#a3a3a3]">
                    Hohe Streaming-Harmonie mit deinem Geschmack
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1 bg-[#201f1f] px-2.5 py-1 rounded-full text-[#ffd405] text-[10px] font-bold shrink-0">
                <span className="material-symbols-outlined text-[13px] icon-filled">auto_awesome</span>
                <span>{profile.sharedHits || 14} Treffer</span>
              </div>
            </div>

            {/* Shared Genre Badges */}
            {profile.sharedGenres && (
              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-[#2a2a2a]">
                {profile.sharedGenres.map((g, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#201f1f] rounded-full text-[10px] font-bold text-white"
                  >
                    <span className="material-symbols-outlined text-[12px] text-[#ffd405]">movie</span>
                    {g}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Gamification Level Progress (Shown on user profile) */}
      {isMyProfile && (
        <div className="px-4 mt-3">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#ffd405] text-[20px]">trending_up</span>
                <span className="text-xs font-bold text-white">Level 9</span>
              </div>
              <span className="text-xs font-bold text-[#ffd405]">
                {profile.currentXp} / {profile.targetXp} XP
              </span>
            </div>

            <div className="w-full h-2 bg-[#2a2a2a] rounded-full mt-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#d80b69] transition-all duration-300"
                style={{ width: `${xpPercent}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#a3a3a3] mt-1.5">
              <span>
                Noch <strong className="text-white">{xpRemaining} XP</strong> bis zum Rang Screen-Guru
              </span>
              <span className="text-[#ffd405] font-semibold">+20 XP pro Rezension</span>
            </div>
          </div>
        </div>
      )}

      {/* Badges Strip */}
      <div className="px-4 mt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Freigeschaltete Badges ({profile.badges.length})
          </span>
          <span className="text-[10px] text-[#a3a3a3]">3 von 12</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {profile.badges.map((b) => (
            <div
              key={b.id}
              className="bg-[#1a1a1a] border border-[#2a2a2a] p-2.5 rounded-xl flex flex-col items-center text-center gap-1 shadow-sm"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center my-0.5"
                style={{ backgroundColor: `${b.color}20`, color: b.color }}
              >
                <span className="material-symbols-outlined text-[18px]">{b.icon}</span>
              </div>
              <span className="text-xs font-bold text-white truncate w-full">{b.title}</span>
              <span className="text-[10px] text-[#737373]">{b.subtitle}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Segmented Content Tabs */}
      <div className="px-4 mt-4">
        <div className="bg-[#161616] border border-[#262626] p-1 rounded-xl flex items-center gap-1">
          <Button
            variant={activeTab === 'history' ? 'primary' : 'ghost'}
            size="sm"
            radius="md"
            onClick={() => setActiveTab('history')}
            className={`flex-1 font-bold ${
              activeTab === 'history' ? 'text-white' : 'text-[#a3a3a3] hover:text-white'
            }`}
            leftIcon={<span className="material-symbols-outlined text-[15px]">history</span>}
          >
            Gesehen
          </Button>

          <Button
            variant={activeTab === 'watchlist' ? 'primary' : 'ghost'}
            size="sm"
            radius="md"
            onClick={() => setActiveTab('watchlist')}
            className={`flex-1 font-bold ${
              activeTab === 'watchlist' ? 'text-white' : 'text-[#a3a3a3] hover:text-white'
            }`}
            leftIcon={<span className="material-symbols-outlined text-[15px]">bookmark</span>}
          >
            Watchlist
          </Button>

          <Button
            variant={activeTab === 'reviews' ? 'primary' : 'ghost'}
            size="sm"
            radius="md"
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 font-bold ${
              activeTab === 'reviews' ? 'text-white' : 'text-[#a3a3a3] hover:text-white'
            }`}
            leftIcon={<span className="material-symbols-outlined text-[15px]">rate_review</span>}
          >
            Reviews
          </Button>
        </div>
      </div>

      {/* Tab Content: Recently Watched List */}
      <div className="px-4 mt-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between pb-1">
          <span className="text-xs font-bold text-white">
            {activeTab === 'history'
              ? 'Zuletzt gesehen'
              : activeTab === 'watchlist'
              ? 'Gespeicherte Titel'
              : 'Veröffentlichte Reviews'}
          </span>
          <span className="text-[10px] text-[#a3a3a3] font-mono">
            {profile.recentWatches.length} Titel
          </span>
        </div>

        {profile.recentWatches.map((item, idx) => (
          <div
            key={idx}
            onClick={() => onOpenMovieDetails && onOpenMovieDetails(item.movieId)}
            className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-xl p-2.5 flex gap-3 items-center cursor-pointer transition-colors shadow-sm"
          >
            <div className="relative w-16 h-22 rounded-lg overflow-hidden shrink-0 bg-black">
              <img
                src={item.poster}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1 left-1 bg-black/85 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                {item.provider}
              </span>
              <span className="absolute bottom-1 left-1 bg-black/80 text-[#a3a3a3] text-[8px] px-1 py-0.2 rounded font-mono">
                {item.audio}
              </span>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div>
                <div className="flex items-start justify-between gap-1">
                  <h3 className="text-xs font-bold text-white truncate">{item.title}</h3>
                  <div className="flex items-center gap-0.5 text-[#ffd405] shrink-0 font-bold text-xs">
                    <span className="material-symbols-outlined text-[14px] icon-filled">star</span>
                    <span>{item.rating}</span>
                  </div>
                </div>
                <p className="text-[10px] text-[#a3a3a3] mt-0.5">{item.info}</p>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#737373] mt-2">
                <span>{item.watchedAgo}</span>
                <span className="text-white font-mono">{item.quality}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Load more button */}
        <Button
          variant="outline"
          size="sm"
          radius="md"
          fullWidth
          onClick={() => showToast('Weitere Titel aus der Historie geladen')}
          rightIcon={<span className="material-symbols-outlined text-[16px]">expand_more</span>}
          className="mt-1 text-[#a3a3a3] hover:text-white"
        >
          Vollständige Historie laden (139 weitere)
        </Button>
      </div>

      {/* Settings & Subscriptions Direct Footer Banner */}
      {isMyProfile && (
        <div className="px-4 mt-4">
          <div
            onClick={onOpenSettings}
            className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[#a3a3a3]">
                <span className="material-symbols-outlined text-[20px]">tune</span>
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  Einstellungen & Streaming-Abos
                </span>
                <span className="text-[10px] text-[#737373]">
                  Streaming-Dienste und Audio-Präferenzen verwalten
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#737373] text-[20px]">
              chevron_right
            </span>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#2a2a2a] border border-[#3a3a3a] text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 z-50 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="material-symbols-outlined text-[16px] text-[#ffd405]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
