import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Button, IconButton, ButtonIcon } from './ui/button';

interface HeaderProps {
  user: UserProfile;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  audioLanguage?: string;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenProfile,
  onOpenSettings,
  audioLanguage = 'DE-Audio'
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    {
      id: '1',
      title: 'Dario M. hat deine Rezension geliked',
      subtitle: 'Interstellar • vor 10 Min.',
      unread: true,
    },
    {
      id: '2',
      title: 'Neues Streaming-Match!',
      subtitle: 'Cyberpunk: Edgerunners läuft jetzt auf Netflix',
      unread: true,
    },
    {
      id: '3',
      title: '+20 XP erhalten',
      subtitle: 'Deine Review zu The Batman wurde veröffentlicht',
      unread: false,
    }
  ]);

  return (
    <header className="sticky top-0 inset-x-0 z-40 bg-[#131313]/90 backdrop-blur-xl border-b border-[#262626] transition-colors">
      <div className="h-16 px-4 flex items-center justify-between gap-3 max-w-lg mx-auto">
        {/* WatchMatch Official Logo (Icon + Wordart) */}
        <div className="flex items-center min-w-0 shrink-0">
          <img
            src="/watchmatch-logo.svg"
            alt="WatchMatch"
            className="h-8 w-auto object-contain select-none cursor-pointer"
          />
        </div>

        {/* Right Action Icons: DE-Audio Pill, Notification Bell, User Avatar */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* DE Audio Indicator Pill */}
          <Button
            variant="secondary"
            size="sm"
            radius="full"
            onClick={onOpenSettings}
            className="h-7 px-2.5 py-0 bg-[#1c1b1b] border-[#2a2a2a] text-[#c8c6c5] hover:border-[#ffd405]/50 gap-1.5 font-normal"
            title="Audio-Filter anpassen"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#d80b69]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#113ccf]"></span>
            <span className="font-semibold text-[11px] text-[#e5e2e1]">{audioLanguage}</span>
          </Button>

          {/* Notifications Button with Dropdown */}
          <div className="relative">
            <IconButton
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Benachrichtigungen"
              variant="ghost"
              size="md"
              radius="full"
              className="relative text-[#a3a3a3] hover:text-white hover:bg-[#201f1f]"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#d80b69] ring-2 ring-[#131313]"></span>
            </IconButton>

            {/* Notifications Flyout */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-72 bg-[#1a1a1a] border border-[#333333] rounded-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2a2a2a]">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Benachrichtigungen</span>
                  <span className="text-[10px] text-[#ffd405] bg-[#ffd405]/10 px-1.5 py-0.5 rounded font-semibold">2 Neu</span>
                </div>
                <div className="flex flex-col gap-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 rounded-lg bg-[#201f1f] hover:bg-[#2a2a2a] transition-colors text-left text-xs cursor-pointer">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#d80b69]"></span>}
                        {n.title}
                      </div>
                      <div className="text-[11px] text-[#a3a3a3] mt-0.5">{n.subtitle}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar */}
          <IconButton
            onClick={onOpenProfile}
            aria-label="Profil öffnen"
            variant="ghost"
            size="md"
            radius="full"
            className="p-0 hover:bg-transparent"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#3a3a3a] hover:ring-[#ffd405] transition-all"
            />
          </IconButton>
        </div>
      </div>
    </header>
  );
};
