import React from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'pink'
  | 'accent';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  radius?: ButtonRadius;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string; // Strictly enforce accessible name for icon-only buttons
  variant?: ButtonVariant;
  size?: ButtonSize | 'xs' | 'xl';
  radius?: ButtonRadius;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export interface ButtonIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  position?: 'left' | 'right' | 'only';
  size?: ButtonSize | 'xs' | 'xl';
  children: React.ReactNode;
}
