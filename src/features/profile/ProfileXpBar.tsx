import React from "react";

interface ProfileXpBarProps {
  currentXp: number;
  targetXp: number;
  level: number;
}

export const ProfileXpBar: React.FC<ProfileXpBarProps> = ({
  currentXp,
  targetXp,
  level,
}) => {
  const xpPercent = Math.min(Math.round((currentXp / targetXp) * 100), 100);
  const xpRemaining = Math.max(targetXp - currentXp, 0);

  return (
    <div
      role="progressbar"
      aria-valuenow={currentXp}
      aria-valuemin={0}
      aria-valuemax={targetXp}
      aria-label={`Erfahrungspunkte: ${currentXp} von ${targetXp} XP (${xpPercent}%)`}
      className="flex flex-col gap-1.5 pt-1 border-t border-surface-bright"
    >
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-[#d6d4d3] font-semibold flex items-center gap-1">
          <span
            className="material-symbols-outlined text-[15px] text-secondary icon-filled"
            aria-hidden="true"
          >
            bolt
          </span>
          XP Fortschritt
        </span>
        <span className="text-white font-mono text-xs">
          {currentXp} / {targetXp} XP{" "}
          <span className="text-[#d6d4d3]">
            ({xpRemaining} bis Lv. {level + 1})
          </span>
        </span>
      </div>
      <div className="w-full h-2.5 rounded-full bg-surface-container-lowest overflow-hidden p-0.5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-secondary to-primary-container transition-all duration-300"
          style={{ width: `${xpPercent}%` }}
        ></div>
      </div>
    </div>
  );
};
