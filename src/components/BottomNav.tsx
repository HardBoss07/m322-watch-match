import React from 'react';

export type NavTab = 'match' | 'discover' | 'community' | 'watchlist' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  communityBadge?: number;
  watchlistCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  communityBadge = 3,
}) => {
  const tabs = [
    { id: 'match' as NavTab, label: 'Match', icon: 'local_fire_department' },
    { id: 'discover' as NavTab, label: 'Discover', icon: 'explore' },
    { id: 'community' as NavTab, label: 'Community', icon: 'forum', badge: communityBadge },
    { id: 'watchlist' as NavTab, label: 'Watchlist', icon: 'bookmark' },
    { id: 'profile' as NavTab, label: 'Profil', icon: 'person' },
  ];

  return (
    <nav
      className="sticky bottom-0 inset-x-0 z-40 bg-[#131313]/95 backdrop-blur-xl border-t border-[#262626] shadow-[0_-1px_16px_rgba(0,0,0,0.6)] shrink-0"
      aria-label="Hauptnavigation"
    >
      <div className="flex justify-around items-center h-16 w-full px-2" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-label={tab.label}
              title={tab.label}
              aria-selected={isActive}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center justify-center min-w-[52px] h-13 px-2 transition-all duration-150 rounded-xl active:scale-95 cursor-pointer ${
                isActive
                  ? 'text-[#ffd405]'
                  : 'text-[#a3a3a3] hover:text-[#e5e2e1]'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span
                  className={`material-symbols-outlined text-[26px] ${
                    isActive ? 'icon-filled text-[#ffd405]' : ''
                  }`}
                >
                  {tab.icon}
                </span>
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-full bg-[#d80b69] text-white text-[10px] font-bold leading-tight">
                    {tab.badge}
                  </span>
                )}
              </div>
              {isActive && (
                <span className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-[#ffd405]"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
