import React, { useState } from "react";
import { UserProfile } from "../../types";
import { Button, IconButton } from "../../components/ui/button";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileXpBar } from "./ProfileXpBar";
import { ProfileStats } from "./ProfileStats";
import { ProfileHistoryList } from "./ProfileHistoryList";

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
  audioLanguage = "DE-Audio",
}) => {
  const [activeTab, setActiveTab] = useState<
    "history" | "watchlist" | "reviews"
  >("history");

  const notify = (msg: string) => {
    if (showToast) showToast(msg);
  };

  return (
    <div className="flex flex-col w-full pb-24 max-w-lg mx-auto">
      {/* Top Bar Navigation */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        {!isMyProfile ? (
          <IconButton
            onClick={onBack}
            aria-label="Zurück zum eigenen Profil"
            variant="secondary"
            size="md"
            radius="full"
            className="min-w-[44px] min-h-[44px]"
          >
            <span className="material-symbols-outlined text-[22px]">
              arrow_back
            </span>
          </IconButton>
        ) : (
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Mein Profil
          </span>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <IconButton
            onClick={() => {
              if (onShareProfile) onShareProfile();
              else notify("Profillink in die Zwischenablage kopiert!");
            }}
            aria-label="Profil teilen"
            variant="secondary"
            size="md"
            radius="full"
            className="min-w-[44px] min-h-[44px]"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
          </IconButton>
          {isMyProfile && (
            <IconButton
              onClick={onOpenSettings}
              aria-label="Einstellungen und Streaming-Filter öffnen"
              variant="secondary"
              size="md"
              radius="full"
              className="min-w-[44px] min-h-[44px]"
            >
              <span className="material-symbols-outlined text-[18px]">
                settings
              </span>
            </IconButton>
          )}
        </div>
      </div>

      {/* Main Profile Info Card */}
      <div className="px-4">
        <div className="bg-surface-100 border border-surface-300 rounded-2xl p-4 shadow-md flex flex-col gap-3 relative overflow-hidden">
          <ProfileHeader
            profile={profile}
            isMyProfile={isMyProfile}
            audioLanguage={audioLanguage}
            onEditProfile={onEditProfile}
            onOpenSettings={onOpenSettings}
            onOpenChatWithUser={onOpenChatWithUser}
            onToggleFollow={onToggleFollow}
            notify={notify}
          />

          <ProfileXpBar
            currentXp={profile.currentXp}
            targetXp={profile.targetXp}
            level={profile.level}
          />

          <ProfileStats profile={profile} />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-4">
        <div
          role="tablist"
          aria-label="Profil-Bereiche"
          className="flex bg-surface-100 p-1 rounded-xl border border-surface-300 gap-1"
        >
          <Button
            role="tab"
            aria-selected={activeTab === "history"}
            variant={activeTab === "history" ? "primary" : "ghost"}
            size="sm"
            radius="md"
            onClick={() => setActiveTab("history")}
            className={`flex-1 font-bold min-h-[44px] ${
              activeTab === "history"
                ? "text-white"
                : "text-[#d6d4d3] hover:text-white"
            }`}
            leftIcon={
              <span className="material-symbols-outlined text-[16px]">
                history
              </span>
            }
          >
            Historie
          </Button>

          <Button
            role="tab"
            aria-selected={activeTab === "watchlist"}
            variant={activeTab === "watchlist" ? "primary" : "ghost"}
            size="sm"
            radius="md"
            onClick={() => setActiveTab("watchlist")}
            className={`flex-1 font-bold min-h-[44px] ${
              activeTab === "watchlist"
                ? "text-white"
                : "text-[#d6d4d3] hover:text-white"
            }`}
            leftIcon={
              <span className="material-symbols-outlined text-[16px]">
                bookmark
              </span>
            }
          >
            Watchlist
          </Button>

          <Button
            role="tab"
            aria-selected={activeTab === "reviews"}
            variant={activeTab === "reviews" ? "primary" : "ghost"}
            size="sm"
            radius="md"
            onClick={() => setActiveTab("reviews")}
            className={`flex-1 font-bold min-h-[44px] ${
              activeTab === "reviews"
                ? "text-white"
                : "text-[#d6d4d3] hover:text-white"
            }`}
            leftIcon={
              <span className="material-symbols-outlined text-[16px]">
                rate_review
              </span>
            }
          >
            Reviews
          </Button>
        </div>
      </div>

      {/* Tab Content: History List */}
      <ProfileHistoryList
        watches={profile.recentWatches}
        activeTab={activeTab}
        onOpenMovieDetails={onOpenMovieDetails}
        notify={notify}
      />

      {/* Settings & Subscriptions Direct Footer Banner (without placeholder chevron) */}
      {isMyProfile && (
        <div className="px-4 mt-4">
          <button
            type="button"
            onClick={onOpenSettings}
            className="w-full bg-surface-100 border border-surface-300 hover:border-secondary rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition-all shadow-sm group min-h-[56px] text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container group-hover:bg-secondary-container/20 flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[20px]">
                  tune
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-white block group-hover:text-secondary transition-colors">
                  Einstellungen & Streaming-Abos
                </span>
                <span className="text-[11px] text-[#d6d4d3]">
                  Streaming-Dienste und Audio-Präferenzen verwalten
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-secondary px-2.5 py-1 rounded bg-surface-container border border-surface-300">
              Öffnen
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
