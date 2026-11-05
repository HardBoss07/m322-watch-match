import React from "react";
import { UserProfile } from "../../types";

interface ProfileStatsProps {
  profile: UserProfile;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ profile }) => {
  return (
    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-surface-bright text-center">
      <div className="flex flex-col">
        <span className="text-sm font-black text-white">
          {profile.seenCount}
        </span>
        <span className="text-[10px] text-[#d6d4d3] font-medium">Gesehen</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-black text-white">
          {profile.watchlistCount}
        </span>
        <span className="text-[10px] text-[#d6d4d3] font-medium">
          Watchlist
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-black text-secondary">
          {profile.matchPercentWithMe || 88}%
        </span>
        <span className="text-[10px] text-[#d6d4d3] font-medium">
          Match-Rate
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-black text-white">
          {profile.followersCount}
        </span>
        <span className="text-[10px] text-[#d6d4d3] font-medium">Follower</span>
      </div>
    </div>
  );
};
