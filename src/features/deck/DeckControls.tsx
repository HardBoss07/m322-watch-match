import React from "react";
import { IconButton } from "../../components/ui/button";

interface DeckControlsProps {
  onPass: () => void;
  onFriendsInfo: () => void;
  onSuperlike: () => void;
  onLike: () => void;
  friendsCount?: number;
  onInteractionReset?: () => void;
}

/**
 * DeckControls component:
 * Dedicated decoupled dock for swipe deck actions.
 * Adheres to WCAG 2.1 AA:
 * - Minimum 44x44px touch targets on all interactive elements
 * - Explicit visible micro-copy labels beneath all action icons
 * - Clear, descriptive aria-labels for assistive technology
 * - Addresses "Icon 3 ohne Label" -> "3 gemeinsame Freunde"
 */
export const DeckControls: React.FC<DeckControlsProps> = ({
  onPass,
  onFriendsInfo,
  onSuperlike,
  onLike,
  friendsCount = 3,
  onInteractionReset,
}) => {
  const handleAction = (cb: () => void) => {
    if (onInteractionReset) onInteractionReset();
    cb();
  };

  return (
    <div
      role="toolbar"
      aria-label="Match-Deck Aktionen"
      className="flex items-end justify-center gap-3 sm:gap-4 py-2 shrink-0 select-none"
    >
      {/* 1. Pass / Ablehnen */}
      <div className="flex flex-col items-center gap-1">
        <IconButton
          type="button"
          onClick={() => handleAction(onPass)}
          onMouseEnter={onInteractionReset}
          aria-label="Titel ablehnen (Swipe nach links)"
          variant="secondary"
          size="lg"
          radius="full"
          className="w-12 h-12 min-w-[48px] min-h-[48px] border-surface-300 text-[#d6d4d3] hover:text-white hover:bg-surface-container-high transition-transform active:scale-90"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </IconButton>
        <span className="text-[10px] font-bold text-[#d6d4d3] tracking-wide">
          Ablehnen
        </span>
      </div>

      {/* 2. Gemeinsame Freunde / Match-Info */}
      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          onClick={() => handleAction(onFriendsInfo)}
          onMouseEnter={onInteractionReset}
          aria-label={`${friendsCount} gemeinsame Freunde haben diesen Titel gematcht`}
          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-surface-300 bg-surface-container hover:bg-surface-container-high text-white flex items-center justify-center transition-all active:scale-90 shadow-sm relative group cursor-pointer"
        >
          <div className="flex items-center justify-center">
            <span className="material-symbols-outlined text-[19px] text-secondary">
              group
            </span>
            <span className="text-[11px] font-black text-secondary ml-0.5">
              {friendsCount}
            </span>
          </div>
        </button>
        <span className="text-[10px] font-bold text-secondary tracking-wide">
          {friendsCount} Freunde
        </span>
      </div>

      {/* 3. Superlike / Favorit */}
      <div className="flex flex-col items-center gap-1">
        <IconButton
          type="button"
          onClick={() => handleAction(onSuperlike)}
          onMouseEnter={onInteractionReset}
          aria-label="Superlike: Als Favorit markieren (Swipe nach oben)"
          variant="secondary"
          size="md"
          radius="full"
          className="w-11 h-11 min-w-[44px] min-h-[44px] border-surface-300 text-secondary hover:bg-surface-container-high transition-transform active:scale-90"
        >
          <span className="material-symbols-outlined text-[20px] icon-filled">
            star
          </span>
        </IconButton>
        <span className="text-[10px] font-bold text-[#d6d4d3] tracking-wide">
          Superlike
        </span>
      </div>

      {/* 4. Match / Watchlist */}
      <div className="flex flex-col items-center gap-1">
        <IconButton
          type="button"
          onClick={() => handleAction(onLike)}
          onMouseEnter={onInteractionReset}
          aria-label="Gefällt mir und zur Watchlist hinzufügen (Swipe nach rechts)"
          variant="primary"
          size="xl"
          radius="full"
          className="w-14 h-14 min-w-[56px] min-h-[56px] shadow-lg shadow-[#d80b69]/40 transition-transform active:scale-90"
        >
          <span className="material-symbols-outlined text-[28px] icon-filled">
            favorite
          </span>
        </IconButton>
        <span className="text-[10px] font-bold text-white tracking-wide">
          Watchlist
        </span>
      </div>
    </div>
  );
};
