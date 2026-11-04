import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { EXTENDED_WATCH_HISTORY } from './useProfile';
import { Button, IconButton } from '../../components/ui/button';

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
  showToast?: (msg: string) => void;
  audioLanguage?: string;
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
  showToast,
  audioLanguage = 'DE-Audio',
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'watchlist' | 'reviews'>('history');
  const [isHistoryExpanded, setIsHistoryExpanded] = useState<boolean>(false);

  const notify = (msg: string) => {
    if (showToast) showToast(msg);
  };

  const xpPercent = Math.min(Math.round((profile.currentXp / profile.targetXp) * 100), 100);
  const xpRemaining = Math.max(profile.targetXp - profile.currentXp, 0);

  // Combine initial recent watches with extended history if expanded
  const displayedWatches = isHistoryExpanded
    ? [...profile.recentWatches, ...EXTENDED_WATCH_HISTORY]
    : profile.recentWatches;

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
              else notify('Profillink in die Zwischenablage kopiert!');
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
              <div className="flex flex-col gap-2 items-end">
                <Button
                  variant="secondary"
                  size="sm"
                  radius="md"
                  onClick={onEditProfile}
                  leftIcon={<span className="material-symbols-outlined text-[16px]">edit</span>}
                  className="font-bold text-xs"
                >
                  Profil bearbeiten
                </Button>

                <div className="flex items-center gap-1.5">
                  {/* Language / Tonspur Switcher Button */}
                  <button
                    type="button"
                    onClick={onOpenSettings}
                    title="Audio-Sprache & Synchronisation anpassen"
                    className="h-8 px-2.5 rounded-lg border border-[#3a3a3a] bg-[#1c1b1b] hover:border-[#ffd405] text-[#ffd405] text-xs font-bold flex items-center gap-1 transition-all cursor-pointer active:scale-95 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[15px]">record_voice_over</span>
                    <span>{audioLanguage}</span>
                  </button>

                  {/* High-Contrast Active "Streaming-Abos" Button */}
                  <button
                    type="button"
                    onClick={onOpenSettings}
                    className="h-8 px-3 rounded-lg border-2 border-[#ffd405] bg-[#221f15] hover:bg-[#2f2a15] text-[#ffd405] font-black text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#ffd405]">tune</span>
                    <span>Streaming-Abos</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant={profile.isFollowing ? 'secondary' : 'primary'}
                  size="sm"
                  radius="md"
                  onClick={() => {
                    if (onToggleFollow) onToggleFollow();
                    notify(profile.isFollowing ? `${profile.name} entfolgt` : `Du folgst jetzt ${profile.name}`);
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
              <h2 className="text-base font-bold text-white">{profile.name}</h2>
              <span className="text-xs text-[#a3a3a3] font-mono">{profile.handle}</span>
            </div>
            <p className="text-xs text-[#d80b69] font-medium mt-0.5">{profile.bio}</p>
          </div>

          {/* XP Progress Bar */}
          <div className="flex flex-col gap-1.5 pt-1 border-t border-[#262626]">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#a3a3a3] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#ffd405] icon-filled">
                  bolt
                </span>
                XP Fortschritt
              </span>
              <span className="text-white font-mono text-xs">
                {profile.currentXp} / {profile.targetXp} XP{' '}
                <span className="text-[#a3a3a3]">({xpRemaining} bis Lv. {profile.level + 1})</span>
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#121212] overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#ffd405] to-[#d80b69] transition-all duration-300"
                style={{ width: `${xpPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Profile Stats Grid */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#262626] text-center">
            <div className="flex flex-col">
              <span className="text-sm font-black text-white">{profile.seenCount}</span>
              <span className="text-[10px] text-[#737373]">Gesehen</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-white">{profile.watchlistCount}</span>
              <span className="text-[10px] text-[#737373]">Watchlist</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-[#ffd405]">{profile.matchPercentWithMe || 88}%</span>
              <span className="text-[10px] text-[#737373]">Match-Rate</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-white">{profile.followersCount}</span>
              <span className="text-[10px] text-[#737373]">Follower</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-4">
        <div className="flex bg-[#1a1a1a] p-1 rounded-xl border border-[#2a2a2a] gap-1">
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
            Historie
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

      {/* Tab Content: History List */}
      <div className="px-4 mt-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between pb-1">
          <span className="text-xs font-bold text-white">
            {activeTab === 'history'
              ? 'Zuletzt gesehen'
              : activeTab === 'watchlist'
              ? 'Gespeicherte Titel'
              : 'Veröffentlichte Reviews'}
          </span>
          <span className="text-[10px] text-[#ffd405] font-mono font-bold">
            {displayedWatches.length} {activeTab === 'history' ? 'Einträge' : 'Titel'}
          </span>
        </div>

        {displayedWatches.map((item, idx) => (
          <div
            key={`${item.movieId}-${idx}`}
            onClick={() => onOpenMovieDetails && onOpenMovieDetails(item.movieId)}
            className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-xl p-2.5 flex gap-3 items-center cursor-pointer transition-colors shadow-sm animate-in fade-in duration-200"
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

        {/* Functional Full History Toggle Button (Resolves hanging bug) */}
        {activeTab === 'history' && (
          <Button
            variant="outline"
            size="sm"
            radius="md"
            fullWidth
            onClick={() => {
              setIsHistoryExpanded(!isHistoryExpanded);
              notify(
                !isHistoryExpanded
                  ? 'Vollständige Historie geöffnet (+4 weitere Titel)'
                  : 'Historie reduziert'
              );
            }}
            rightIcon={
              <span className="material-symbols-outlined text-[16px]">
                {isHistoryExpanded ? 'expand_less' : 'expand_more'}
              </span>
            }
            className="mt-1 border-[#3a3a3a] text-white hover:border-[#ffd405] hover:text-[#ffd405] font-bold"
          >
            {isHistoryExpanded
              ? 'Weniger Titel anzeigen'
              : `Vollständige Historie laden (${EXTENDED_WATCH_HISTORY.length} weitere)`}
          </Button>
        )}
      </div>

      {/* Settings & Subscriptions Direct Footer Banner */}
      {isMyProfile && (
        <div className="px-4 mt-4">
          <div
            onClick={onOpenSettings}
            className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#ffd405] rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all shadow-sm group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2a2a2a] group-hover:bg-[#ffd405]/20 flex items-center justify-center text-[#ffd405]">
                <span className="material-symbols-outlined text-[20px]">tune</span>
              </div>
              <div>
                <span className="text-xs font-bold text-white block group-hover:text-[#ffd405] transition-colors">
                  Einstellungen & Streaming-Abos
                </span>
                <span className="text-[10px] text-[#737373]">
                  Streaming-Dienste und Audio-Präferenzen verwalten
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#737373] group-hover:text-white text-[20px]">
              chevron_right
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
