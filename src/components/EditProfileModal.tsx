import React, { useState } from "react";
import { UserProfile } from "../types";
import { Button, IconButton } from "./ui/button";

interface EditProfileModalProps {
  profile: UserProfile;
  onSave: (updated: Partial<UserProfile>) => void;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  profile,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(profile.name);
  const [handle, setHandle] = useState(profile.handle);
  const [bio, setBio] = useState(profile.bio);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      handle,
      bio,
    });
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 bg-surface overflow-y-auto flex flex-col animate-in fade-in duration-150">
      {/* Header */}
      <header className="sticky top-0 inset-x-0 z-30 bg-surface/90 backdrop-blur-xl border-b border-surface-bright h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconButton
            onClick={onClose}
            aria-label="Zurück"
            variant="ghost"
            size="md"
            radius="full"
            className="-ml-2 text-white hover:text-primary-container"
          >
            <span className="material-symbols-outlined text-[24px]">
              arrow_back
            </span>
          </IconButton>
          <h1 className="text-sm font-bold text-white">Profil bearbeiten</h1>
        </div>

        <Button
          variant="primary"
          size="sm"
          radius="md"
          onClick={handleSubmit}
          className="font-bold shadow"
        >
          Speichern
        </Button>
      </header>

      {/* Form Content */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 flex flex-col max-w-lg mx-auto w-full p-4 gap-4 pb-20"
      >
        {/* Avatar Upload Container */}
        <div className="flex flex-col items-center justify-center py-2">
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-24 h-24 rounded-full object-cover ring-2 ring-secondary"
            />
            <IconButton
              type="button"
              aria-label="Profilbild ändern"
              variant="primary"
              size="sm"
              radius="full"
              className="absolute bottom-0 right-0 shadow-md"
            >
              <span className="material-symbols-outlined text-[16px]">
                photo_camera
              </span>
            </IconButton>
          </div>
          <span className="text-[11px] text-tertiary mt-2">
            Tippe auf das Symbol, um dein Bild zu ändern
          </span>
        </div>

        {/* Name Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-white">Anzeigename</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-surface-300 text-xs text-white outline-none focus:border-primary-container"
          />
        </div>

        {/* Handle Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-white">Benutzername</label>
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-surface-300 text-xs text-white outline-none focus:border-primary-container"
          />
        </div>

        {/* Bio Textarea */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-white">Biografie</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Beschreibe deinen Seriengeschmack..."
            className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-300 text-xs text-white outline-none focus:border-primary-container resize-none leading-relaxed"
          ></textarea>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          radius="md"
          fullWidth
          leftIcon={
            <span className="material-symbols-outlined text-[18px]">check</span>
          }
          className="mt-2 font-bold shadow-lg shadow-primary-container/30"
        >
          Änderungen speichern
        </Button>
      </form>
    </div>
  );
};
