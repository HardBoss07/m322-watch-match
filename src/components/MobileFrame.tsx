import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';

interface MobileFrameProps {
  children: React.ReactNode;
  activeScreenName?: string;
  onQuickJump?: (screen: string) => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  activeScreenName = 'Match Deck',
  onQuickJump,
}) => {
  const [useFrame, setUseFrame] = useState(true);
  const [currentTime, setCurrentTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen bg-[#070707] text-[#e5e2e1] flex flex-col items-center justify-start p-3 select-none overflow-hidden">
      {/* Top Floating Control Bar for Testing & Screen Jumping */}
      <div className="w-full max-w-xl mb-3 flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[#161616]/90 border border-[#2a2a2a] rounded-2xl shadow-xl backdrop-blur-md z-50 shrink-0">
        <div className="flex items-center gap-2">
          <img src="/watchmatch-icon.svg" alt="" className="w-5 h-5 object-contain" />
          <span className="text-xs font-bold text-white tracking-tight">WatchMatch</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ffd405]/15 text-[#ffd405] font-bold">
            {activeScreenName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onQuickJump && (
            <select
              aria-label="Schnellansicht wählen"
              value={activeScreenName}
              onChange={(e) => onQuickJump(e.target.value)}
              className="bg-[#201f1f] border border-[#333333] text-[11px] font-semibold text-white px-2 py-1 rounded-lg outline-none cursor-pointer hover:border-[#ffd405]"
            >
              <option value="Match Deck">🔥 Match-Deck</option>
              <option value="Title Detail">🎬 Titel-Detail (Cyberpunk)</option>
              <option value="Quick Review">✍️ Quick Review</option>
              <option value="Community Feed">👥 Community-Feed</option>
              <option value="Chat Dario">💬 Direkt-Chat (Dario M.)</option>
              <option value="Friend Profile">⭐ Dario M. (88% Match)</option>
              <option value="My Profile">👤 Mein Profil (Ottavio Lv. 8)</option>
              <option value="Streaming Filters">⚙️ Streaming-Abos & Filter</option>
              <option value="Send Recommendation">🎁 Filmtipp empfehlen</option>
              <option value="Onboarding & Login">🔐 Onboarding & Setup</option>
            </select>
          )}

          {/* Toggle Device Frame Button */}
          <Button
            variant="secondary"
            size="sm"
            radius="md"
            onClick={() => setUseFrame(!useFrame)}
            leftIcon={
              <span className="material-symbols-outlined text-[14px]">
                {useFrame ? 'fullscreen' : 'smartphone'}
              </span>
            }
            className="h-8 text-[11px] px-2.5 py-1"
            title="Zwischen Smartphone-Rahmen und Vollbild umschalten"
          >
            <span className="hidden sm:inline">{useFrame ? 'Vollbild' : 'Smartphone'}</span>
          </Button>
        </div>
      </div>

      {/* Frame Container */}
      {useFrame ? (
        <div className="relative h-[calc(100vh-80px)] w-auto aspect-[9/16] max-w-full bg-[#131313] rounded-[48px] border-[6px] border-[#222222] shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col ring-1 ring-[#3a3a3a] shrink-0 my-auto">
          {/* Smartphone Status Bar with Dynamic Island */}
          <div className="h-10 w-full bg-[#131313] px-6 flex items-center justify-between text-xs text-white font-semibold z-50 shrink-0 select-none">
            {/* Clock */}
            <span className="text-[12px] tracking-tight font-bold">{currentTime}</span>

            {/* Dynamic Island Pill */}
            <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center gap-2 shadow-inner border border-[#222222]">
              <span className="w-2 h-2 rounded-full bg-[#111111] ring-1 ring-[#333333]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a1a2e]"></span>
            </div>

            {/* Icons: Signal, Wi-Fi, Battery */}
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="material-symbols-outlined text-[13px]">signal_cellular_alt</span>
              <span className="material-symbols-outlined text-[13px]">wifi</span>
              <div className="w-5 h-2.5 border border-white/80 rounded-sm p-0.5 flex items-center">
                <div className="w-full h-full bg-white rounded-2xs"></div>
              </div>
            </div>
          </div>

          {/* Screen Content Wrapper */}
          <div className="flex-1 w-full overflow-hidden relative flex flex-col">
            {children}
          </div>

          {/* Home Swipe Indicator Bar */}
          <div className="h-4 w-full bg-[#131313] flex items-center justify-center shrink-0 z-50 pointer-events-none">
            <div className="w-32 h-1 bg-white/40 rounded-full"></div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-lg flex-1 overflow-y-auto bg-[#131313] flex flex-col shadow-2xl relative rounded-2xl">
          {children}
        </div>
      )}
    </div>
  );
};