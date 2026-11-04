import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Button } from './ui/button';

export interface MobileFrameContextType {
  scale: number;
  useFrame: boolean;
}

export const MobileFrameContext = createContext<MobileFrameContextType>({
  scale: 1,
  useFrame: true,
});

export const useMobileFrame = () => useContext(MobileFrameContext);

interface MobileFrameProps {
  children: React.ReactNode;
  activeScreenName?: string;
  onQuickJump?: (screen: string) => void;
}

// Canonical physical smartphone logical baseline resolution (iPhone 14 standard: 390 x 844)
export const LOGICAL_SCREEN_WIDTH = 390;
export const LOGICAL_SCREEN_HEIGHT = 844;

// Physical phone bezel outer dimensions (including 8px border on all sides)
export const BEZEL_BORDER_WIDTH = 8;
export const FRAME_OUTER_WIDTH = LOGICAL_SCREEN_WIDTH + BEZEL_BORDER_WIDTH * 2; // 406px
export const FRAME_OUTER_HEIGHT = LOGICAL_SCREEN_HEIGHT + BEZEL_BORDER_WIDTH * 2; // 860px

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  activeScreenName = 'Match Deck',
  onQuickJump,
}) => {
  const [useFrame, setUseFrame] = useState(true);
  const [currentTime, setCurrentTime] = useState('09:41');

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? Math.max(window.innerHeight - 64, 400) : 800,
  });

  // Keep simulated mobile clock updated
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

  // Measure available container dimensions with ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setContainerSize({ width, height });
        }
      }
    });

    observer.observe(container);
    window.addEventListener('resize', updateDimensions);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Compute baseline dimensions depending on whether frame bezel is shown
  const baseWidth = useFrame ? FRAME_OUTER_WIDTH : LOGICAL_SCREEN_WIDTH;
  const baseHeight = useFrame ? FRAME_OUTER_HEIGHT : LOGICAL_SCREEN_HEIGHT;

  // Reserved breathing room padding around phone (e.g. 16px on all sides)
  const marginPadding = 24;
  const availableWidth = Math.max(containerSize.width - marginPadding, 100);
  const availableHeight = Math.max(containerSize.height - marginPadding, 100);

  // Canvas scale factor: min(availableWidth / baseWidth, availableHeight / baseHeight, 1.0)
  const rawScale = Math.min(availableWidth / baseWidth, availableHeight / baseHeight, 1.0);
  const scaleFactor = Math.max(rawScale, 0.25);

  // Exact scaled visual footprint dimensions to reserve in the document flow
  const scaledWidth = Math.round(baseWidth * scaleFactor);
  const scaledHeight = Math.round(baseHeight * scaleFactor);

  return (
    <MobileFrameContext.Provider value={{ scale: scaleFactor, useFrame }}>
      <div className="h-screen max-h-screen w-screen max-w-full bg-[#070707] text-[#e5e2e1] flex flex-col items-center justify-between p-2 sm:p-2.5 select-none overflow-hidden box-border">
        {/* Top Floating Control Bar for Testing & Screen Jumping */}
        <div className="w-full max-w-xl shrink-0 mb-1.5 flex items-center justify-between gap-2 px-3.5 py-1.5 bg-[#161616]/95 border border-[#2a2a2a] rounded-xl shadow-lg backdrop-blur-md z-50">
          <div className="flex items-center gap-2 min-w-0">
            <img src="/watchmatch-icon.svg" alt="" className="w-4.5 h-4.5 object-contain shrink-0" />
            <span className="text-xs font-bold text-white tracking-tight hidden xs:inline">WatchMatch</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ffd405]/15 text-[#ffd405] font-bold truncate max-w-[130px]">
              {activeScreenName}
            </span>
            <span className="text-[10px] text-[#737373] hidden md:inline ml-1">
              Canvas: {Math.round(scaleFactor * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onQuickJump && (
              <select
                aria-label="Schnellansicht wählen"
                value={activeScreenName}
                onChange={(e) => onQuickJump(e.target.value)}
                className="bg-[#201f1f] border border-[#333333] text-[11px] font-semibold text-white px-2 py-1 rounded-lg outline-none cursor-pointer hover:border-[#ffd405] max-w-[150px] sm:max-w-none"
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
              className="h-7 text-[11px] px-2.5 py-0.5"
              title="Zwischen Smartphone-Rahmen und Vollbild umschalten"
            >
              <span className="hidden sm:inline">{useFrame ? 'Vollbild' : 'Smartphone'}</span>
            </Button>
          </div>
        </div>

        {/* Scaled Canvas Container Area */}
        <div
          ref={containerRef}
          className="flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden py-1"
        >
          {/* Reserved Layout Footprint Wrapper - occupies exact scaled dimensions */}
          <div
            className="relative shrink-0 flex items-center justify-center select-none"
            style={{
              width: `${scaledWidth}px`,
              height: `${scaledHeight}px`,
            }}
          >
            {/* Scaled Device Frame / Screen Canvas */}
            <div
              style={{
                width: `${baseWidth}px`,
                height: `${baseHeight}px`,
                transform: `scale(${scaleFactor})`,
                transformOrigin: 'center center',
              }}
              className={`absolute flex flex-col overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.95)] will-change-transform ${
                useFrame
                  ? 'bg-[#131313] rounded-[48px] border-[8px] border-[#222222] ring-1 ring-[#3a3a3a]'
                  : 'bg-[#131313] rounded-2xl border border-[#2a2a2a]'
              }`}
            >
              {useFrame && (
                /* iOS-style Status Bar with Dynamic Island */
                <div className="h-11 w-full bg-[#131313] px-7 flex items-center justify-between text-xs text-white font-semibold z-40 shrink-0 select-none">
                  {/* Clock */}
                  <span className="text-[13px] tracking-tight font-bold">{currentTime}</span>

                  {/* Dynamic Island Pill */}
                  <div className="w-24 h-6 bg-black rounded-full flex items-center justify-center gap-2 shadow-inner border border-[#222222]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#111111] ring-1 ring-[#333333]"></span>
                    <span className="w-2 h-2 rounded-full bg-[#1a1a2e]"></span>
                  </div>

                  {/* Icons: Cellular, Wi-Fi, Battery */}
                  <div className="flex items-center gap-2 text-[12px]">
                    <span className="material-symbols-outlined text-[15px]">signal_cellular_alt</span>
                    <span className="material-symbols-outlined text-[15px]">wifi</span>
                    <div className="w-5 h-3 border border-white/80 rounded-sm p-0.5 flex items-center">
                      <div className="w-full h-full bg-white rounded-2xs"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Fixed Logical Resolution Screen Canvas (390px x 776px with bezel or 390px x 844px in fullscreen) */}
              <div className="flex-1 min-h-0 w-full overflow-hidden relative flex flex-col bg-[#131313]">
                {children}
              </div>

              {useFrame && (
                /* iOS Home Indicator Bar */
                <div className="h-6 w-full bg-[#131313] flex items-center justify-center shrink-0 z-40 pointer-events-none">
                  <div className="w-34 h-1.5 bg-white/40 rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MobileFrameContext.Provider>
  );
};