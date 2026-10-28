import React from 'react';

interface WatchMatchLogoProps {
  variant?: 'full' | 'icon' | 'wordmark';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  className?: string;
  onClick?: () => void;
}

export const WatchMatchIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 36,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      {/* Tilted Pink Film Card (Background) */}
      <g transform="rotate(14 68 58)">
        <rect
          x="38"
          y="14"
          width="54"
          height="82"
          rx="12"
          fill="#d80b69"
        />
        {/* Pink card right sprocket holes */}
        <rect x="78" y="24" width="7" height="5" rx="1.5" fill="#ffffff" fillOpacity="0.4" />
        <rect x="78" y="34" width="7" height="5" rx="1.5" fill="#ffffff" fillOpacity="0.4" />
        <rect x="78" y="44" width="7" height="5" rx="1.5" fill="#ffffff" fillOpacity="0.4" />
        <rect x="78" y="54" width="7" height="5" rx="1.5" fill="#ffffff" fillOpacity="0.4" />
        <rect x="78" y="64" width="7" height="5" rx="1.5" fill="#ffffff" fillOpacity="0.4" />
        <rect x="78" y="74" width="7" height="5" rx="1.5" fill="#ffffff" fillOpacity="0.4" />
      </g>

      {/* Foreground Yellow Film Card */}
      <g>
        {/* Dark body with Electric Yellow Border */}
        <rect
          x="18"
          y="18"
          width="58"
          height="84"
          rx="14"
          fill="#1c1b1b"
          stroke="#ffd405"
          strokeWidth="6"
        />

        {/* Left sprocket holes */}
        <rect x="25" y="28" width="6" height="5" rx="1.5" fill="#ffd405" />
        <rect x="25" y="38" width="6" height="5" rx="1.5" fill="#ffd405" />
        <rect x="25" y="48" width="6" height="5" rx="1.5" fill="#ffd405" />
        <rect x="25" y="58" width="6" height="5" rx="1.5" fill="#ffd405" />
        <rect x="25" y="68" width="6" height="5" rx="1.5" fill="#ffd405" />
        <rect x="25" y="78" width="6" height="5" rx="1.5" fill="#ffd405" />
        <rect x="25" y="88" width="6" height="5" rx="1.5" fill="#ffd405" />

        {/* Right sprocket holes */}
        <rect x="63" y="28" width="6" height="5" rx="1.5" fill="#ffd405" />
        <rect x="63" y="38" width="6" height="5" rx="1.5" fill="#ffd405" />
        <rect x="63" y="48" width="6" height="5" rx="1.5" fill="#ffd405" />
        <rect x="63" y="58" width="6" height="5" rx="1.5" fill="#ffd405" />
        <rect x="63" y="68" width="6" height="5" rx="1.5" fill="#ffd405" />
        <rect x="63" y="78" width="6" height="5" rx="1.5" fill="#ffd405" />
        <rect x="63" y="88" width="6" height="5" rx="1.5" fill="#ffd405" />

        {/* Play Triangle Symbol in Center */}
        <polygon
          points="41,47 57,59 41,71"
          fill="#ffd405"
        />
      </g>
    </svg>
  );
};

export const WatchMatchLogo: React.FC<WatchMatchLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  onClick,
}) => {
  // Height configurations
  const heightMap = {
    sm: 24,
    md: 32,
    lg: 42,
    xl: 56,
    custom: undefined,
  };

  const iconSizeMap = {
    sm: 26,
    md: 34,
    lg: 46,
    xl: 60,
    custom: undefined,
  };

  const textClassMap = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl',
    custom: '',
  };

  if (variant === 'icon') {
    return <WatchMatchIcon size={iconSizeMap[size]} className={className} />;
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={size !== 'custom' ? { height: heightMap[size] } : undefined}
    >
      {variant !== 'wordmark' && <WatchMatchIcon size={iconSizeMap[size]} />}
      <div className={`font-black tracking-tight leading-none flex items-baseline font-sans ${textClassMap[size]}`}>
        <span className="text-white">Watch</span>
        <span className="text-[#d80b69]">Match</span>
        <span className="text-[#ffd405] text-[1.25em] leading-none ml-0.5 font-black">.</span>
      </div>
    </div>
  );
};
