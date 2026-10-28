import React from 'react';
import { cn } from '../../utils/cn';

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'provider' | 'audio' | 'quality' | 'accent' | 'neutral';
  dotColor?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Standardized Pill component for streaming tags, audio indicators,
 * and media metadata badges across the MatchDeck and app views.
 * Standard dimensions: h-6, px-2.5, text-[11px] font-semibold, rounded-full.
 */
export const Pill: React.FC<PillProps> = ({
  variant = 'default',
  dotColor,
  icon,
  children,
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 h-6 px-2.5 py-0 rounded-full text-[11px] font-medium leading-none whitespace-nowrap select-none shrink-0 border border-[#333333] bg-[#201f1f]/90 text-white shadow-none transition-colors',
        variant === 'accent' && 'border-[#ffd405]/40 text-[#ffd405] bg-[#201f1f]',
        variant === 'audio' && 'border-[#333333] text-[#ffd405] bg-[#201f1f]',
        variant === 'quality' && 'border-[#333333] text-[#a3a3a3] bg-[#201f1f]',
        variant === 'neutral' && 'border-[#2a2a2a] text-[#a3a3a3] bg-[#1c1b1b]',
        className
      )}
      {...props}
    >
      {dotColor && (
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: dotColor }}
        />
      )}
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      <span className="truncate">{children}</span>
    </span>
  );
};
