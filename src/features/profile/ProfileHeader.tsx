import React from "react";
import { UserProfile } from "../../types";
import { Button, IconButton } from "../../components/ui/button";

interface ProfileHeaderProps {
  profile: UserProfile;
  isMyProfile: boolean;
  audioLanguage?: string;
  onEditProfile?: () => void;
  onOpenSettings?: () => void;
  onOpenChatWithUser?: () => void;
  onToggleFollow?: () => void;
  notify: (msg: string) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  isMyProfile,
  audioLanguage = "DE-Audio",
  onEditProfile,
  onOpenSettings,
  onOpenChatWithUser,
  onToggleFollow,
  notify,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Header Row: Avatar & Primary Actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-surface-300 shadow-md">
            <img
              src={profile.avatar}
              alt={`Profilbild von ${profile.name}`}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute -bottom-1 -right-1 bg-secondary text-surface font-bold text-[10px] px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
            <span
              className="material-symbols-outlined text-[12px] icon-filled"
              aria-hidden="true"
            >
              stars
            </span>
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
              leftIcon={
                <span className="material-symbols-outlined text-[16px]">
                  edit
                </span>
              }
              className="font-bold text-xs min-h-[44px]"
            >
              Profil bearbeiten
            </Button>

            <div className="flex items-center gap-2">
              {/* Language / Tonspur Switcher Button */}
              <button
                type="button"
                onClick={onOpenSettings}
                aria-label="Audio-Sprache und Synchronisation anpassen"
                className="min-h-[44px] px-3 rounded-lg border border-surface-300 bg-surface-container-low hover:border-secondary text-secondary text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                <span
                  className="material-symbols-outlined text-[16px]"
                  aria-hidden="true"
                >
                  record_voice_over
                </span>
                <span>{audioLanguage}</span>
              </button>

              {/* High-Contrast Active "Streaming-Abos" Button */}
              <button
                type="button"
                onClick={onOpenSettings}
                aria-label="Streaming-Abonnements verwalten"
                className="min-h-[44px] px-3.5 rounded-lg border-2 border-secondary bg-secondary-container/20 hover:bg-secondary-container/30 text-secondary font-black text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <span
                  className="material-symbols-outlined text-[16px] text-secondary"
                  aria-hidden="true"
                >
                  tune
                </span>
                <span>Streaming-Abos</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant={profile.isFollowing ? "secondary" : "primary"}
              size="sm"
              radius="md"
              onClick={() => {
                if (onToggleFollow) onToggleFollow();
                notify(
                  profile.isFollowing
                    ? `${profile.name} entfolgt`
                    : `Du folgst jetzt ${profile.name}`,
                );
              }}
              leftIcon={
                <span className="material-symbols-outlined text-[16px]">
                  {profile.isFollowing ? "check" : "person_add"}
                </span>
              }
              className="font-bold min-h-[44px]"
            >
              {profile.isFollowing ? "Folge ich" : "Folgen"}
            </Button>

            <IconButton
              onClick={onOpenChatWithUser}
              aria-label={`Nachricht an ${profile.name} senden`}
              variant="secondary"
              size="md"
              radius="md"
              className="min-w-[44px] min-h-[44px]"
            >
              <span className="material-symbols-outlined text-[18px]">
                chat
              </span>
            </IconButton>
          </div>
        )}
      </div>

      {/* Name & Title */}
      <div>
        <div className="flex items-center gap-1.5">
          <h2 className="text-base font-bold text-white">{profile.name}</h2>
          <span className="text-xs text-[#d6d4d3] font-mono">
            {profile.handle}
          </span>
        </div>
        <p className="text-xs text-primary font-medium mt-0.5">{profile.bio}</p>
      </div>
    </div>
  );
};
