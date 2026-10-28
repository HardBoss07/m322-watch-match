import { cn } from '../../../utils/cn';
import { ButtonVariant, ButtonSize, ButtonRadius } from './types';

export const BASE_BUTTON_CLASSES =
  'inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd405] focus-visible:ring-offset-2 focus-visible:ring-offset-[#131313] ' +
  'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98]';

export const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-[#d80b69] text-white hover:brightness-110 active:brightness-95 border border-transparent shadow-sm',
  pink:
    'bg-[#d80b69] text-white hover:brightness-110 active:brightness-95 border border-transparent shadow-sm',
  secondary:
    'bg-[#201f1f] text-white hover:bg-[#2a2a2a] active:bg-[#333333] border border-[#333333] shadow-sm',
  accent:
    'bg-[#ffd405] text-[#131313] font-bold hover:brightness-105 active:brightness-95 border border-transparent shadow-sm',
  outline:
    'bg-transparent text-[#e5e2e1] border border-[#3a3a3a] hover:bg-white/5 active:bg-white/10 hover:border-[#555555]',
  ghost:
    'bg-transparent text-[#a3a3a3] hover:text-white hover:bg-white/10 active:bg-white/15 border border-transparent',
  danger:
    'bg-[#dc2626] text-white hover:bg-[#b91c1c] active:bg-[#991b1b] border border-transparent shadow-sm',
};

export const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
  md: 'text-sm px-4 py-2 h-10 gap-2',
  lg: 'text-base px-5 py-2.5 h-12 gap-2.5',
};

export const BUTTON_RADII: Record<ButtonRadius, string> = {
  none: 'rounded-none',
  sm: 'rounded-md',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-full',
};

export const ICON_BUTTON_SIZES: Record<ButtonSize | 'xs' | 'xl', string> = {
  xs: 'w-7 h-7 min-w-[28px] min-h-[28px] text-xs p-0',
  sm: 'w-8 h-8 min-w-[32px] min-h-[32px] text-sm p-0',
  md: 'w-10 h-10 min-w-[40px] min-h-[40px] text-base p-0',
  lg: 'w-12 h-12 min-w-[48px] min-h-[48px] text-lg p-0',
  xl: 'w-15 h-15 min-w-[60px] min-h-[60px] text-2xl p-0',
};

export const ICON_CONTAINER_SIZES: Record<ButtonSize | 'xs' | 'xl', string> = {
  xs: 'w-3.5 h-3.5 text-[14px]',
  sm: 'w-4 h-4 text-[16px]',
  md: 'w-5 h-5 text-[18px]',
  lg: 'w-6 h-6 text-[22px]',
  xl: 'w-7 h-7 text-[28px]',
};

export interface ButtonClassOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  radius?: ButtonRadius;
  fullWidth?: boolean;
  className?: string;
}

export function getButtonClasses({
  variant = 'secondary',
  size = 'md',
  radius = 'md',
  fullWidth = false,
  className,
}: ButtonClassOptions): string {
  return cn(
    BASE_BUTTON_CLASSES,
    BUTTON_VARIANTS[variant],
    BUTTON_SIZES[size],
    BUTTON_RADII[radius],
    fullWidth && 'w-full',
    className
  );
}

export interface IconButtonClassOptions {
  variant?: ButtonVariant;
  size?: ButtonSize | 'xs' | 'xl';
  radius?: ButtonRadius;
  className?: string;
}

export function getIconButtonClasses({
  variant = 'secondary',
  size = 'md',
  radius = 'full',
  className,
}: IconButtonClassOptions): string {
  return cn(
    BASE_BUTTON_CLASSES,
    BUTTON_VARIANTS[variant],
    ICON_BUTTON_SIZES[size],
    BUTTON_RADII[radius],
    className
  );
}
