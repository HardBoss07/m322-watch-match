import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';

export interface HeaderProps {
  user: UserProfile;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenRecommendation?: () => void;
  onEditProfile?: () => void;
  onLogoClick?: () => void;
  audioLanguage?: string;
  onSelectLanguage?: (langCode: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenProfile,
  onOpenSettings,
  onOpenRecommendation,
  onEditProfile,
  onLogoClick,
  audioLanguage = 'DE',
  onSelectLanguage,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const notifications = [
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
    },
  ];

  const availableLanguages = [
    { code: 'DE', label: 'DE', fullName: 'Deutsch' },
    { code: 'EN', label: 'EN', fullName: 'Englisch' },
    { code: 'JA', label: 'JA', fullName: 'Japanisch' },
    { code: 'FR', label: 'FR', fullName: 'Französisch' },
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setShowNotifications(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setShowProfileMenu(false);
      }
    };

    if (showNotifications || showProfileMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showNotifications, showProfileMenu]);

  return (
    <header className="sticky top-0 inset-x-0 z-40 bg-[#131313]/95 backdrop-blur-xl border-b border-[#262626] transition-colors select-none">
      <div className="h-14 px-4 flex items-center justify-between gap-3 max-w-lg mx-auto">
        {/* 1. Left: WatchMatch Logo + Brand text */}
        <div
          onClick={onLogoClick}
          className="flex items-center min-w-0 shrink-0 cursor-pointer active:opacity-80 transition-opacity"
          title="WatchMatch Home"
        >
          <img
            src="/watchmatch-logo.svg"
            alt="WatchMatch Logo"
            className="h-8 w-auto object-contain select-none pointer-events-none"
          />
        </div>

        {/* 2. Right: Notification Bell + User Profile Avatar (Min 44x44px touch targets) */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Notification Bell */}
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              onClick={() => {
                setShowNotifications((prev) => !prev);
                setShowProfileMenu(false);
              }}
              aria-label="Benachrichtigungen"
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-[#c8c6c5] hover:text-white hover:bg-[#201f1f] transition-colors relative cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {/* Unread indicator dot */}
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#d80b69] ring-2 ring-[#131313]"></span>
            </button>

            {/* Notifications Dropdown Flyout */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-72 bg-[#1a1a1a] border border-[#333333] rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2a2a2a]">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Benachrichtigungen</span>
                  <span className="text-[10px] text-[#ffd405] bg-[#ffd405]/10 px-2 py-0.5 rounded font-bold">2 Neu</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => setShowNotifications(false)}
                      className="p-2.5 rounded-xl bg-[#201f1f] hover:bg-[#2a2a2a] transition-colors text-left text-xs cursor-pointer"
                    >
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#d80b69] shrink-0"></span>}
                        <span className="truncate">{n.title}</span>
                      </div>
                      <div className="text-[11px] text-[#a3a3a3] mt-0.5">{n.subtitle}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar with Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => {
                setShowProfileMenu((prev) => !prev);
                setShowNotifications(false);
              }}
              aria-label="Profil und Einstellungen"
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center hover:bg-[#201f1f] transition-colors relative cursor-pointer active:scale-95"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#333333] hover:ring-[#ffd405] transition-all"
              />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 top-12 w-64 bg-[#1a1a1a] border border-[#333333] rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Profile Card Header */}
                <div
                  onClick={() => {
                    onOpenProfile();
                    setShowProfileMenu(false);
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-[#222] hover:bg-[#2a2a2a] cursor-pointer transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-[#ffd405]"
                  />
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                      <span>{user.name}</span>
                      <span className="text-[9px] bg-[#ffd405] text-black font-extrabold px-1 rounded">Lv.{user.level}</span>
                    </div>
                    <div className="text-[11px] text-[#a3a3a3] truncate">{user.handle}</div>
                  </div>
                  <span className="material-symbols-outlined text-[#737373] text-[18px]">chevron_right</span>
                </div>

                {/* Relocated Language Switcher Section */}
                <div className="mt-3 pt-2.5 border-t border-[#2a2a2a]">
                  <div className="flex items-center justify-between mb-1.5 px-1">
                    <span className="text-[10px] font-bold text-[#a3a3a3] uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#ffd405]">record_voice_over</span>
                      Tonspur & Sprache
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenSettings();
                        setShowProfileMenu(false);
                      }}
                      className="text-[10px] text-[#ffd405] hover:underline cursor-pointer"
                    >
                      Mehr
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {availableLanguages.map((lang) => {
                      const isActive = audioLanguage.toUpperCase().includes(lang.code);
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            if (onSelectLanguage) {
                              onSelectLanguage(lang.code);
                            } else {
                              onOpenSettings();
                            }
                            setShowProfileMenu(false);
                          }}
                          className={`h-7 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                            isActive
                              ? 'bg-[#ffd405] text-black shadow-sm font-black'
                              : 'bg-[#222] text-[#c8c6c5] hover:text-white hover:bg-[#2c2c2c] border border-[#333]'
                          }`}
                          title={lang.fullName}
                        >
                          {lang.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Actions List */}
                <div className="mt-2.5 pt-2 border-t border-[#2a2a2a] flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenSettings();
                      setShowProfileMenu(false);
                    }}
                    className="w-full h-8 px-2.5 rounded-lg flex items-center justify-between text-left text-xs font-semibold text-[#e5e2e1] hover:bg-[#262626] transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#ffd405]">tune</span>
                      <span>Streaming-Abos & Filter</span>
                    </span>
                    <span className="material-symbols-outlined text-[16px] text-[#737373]">chevron_right</span>
                  </button>

                  {onOpenRecommendation && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenRecommendation();
                        setShowProfileMenu(false);
                      }}
                      className="w-full h-8 px-2.5 rounded-lg flex items-center justify-between text-left text-xs font-semibold text-[#e5e2e1] hover:bg-[#262626] transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-[#d80b69]">send</span>
                        <span>Filmtipp an Freunde</span>
                      </span>
                      <span className="material-symbols-outlined text-[16px] text-[#737373]">chevron_right</span>
                    </button>
                  )}

                  {onEditProfile && (
                    <button
                      type="button"
                      onClick={() => {
                        onEditProfile();
                        setShowProfileMenu(false);
                      }}
                      className="w-full h-8 px-2.5 rounded-lg flex items-center justify-between text-left text-xs font-semibold text-[#e5e2e1] hover:bg-[#262626] transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-[#a3a3a3]">edit</span>
                        <span>Profil bearbeiten</span>
                      </span>
                      <span className="material-symbols-outlined text-[16px] text-[#737373]">chevron_right</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
