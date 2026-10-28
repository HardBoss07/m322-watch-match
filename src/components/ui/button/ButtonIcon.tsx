import React from 'react';
import { cn } from '../../../utils/cn';
import { ButtonIconProps } from './types';
import { ICON_CONTAINER_SIZES } from './button.variants';

export const ButtonIcon: React.FC<ButtonIconProps> = ({
  position = 'only',
  size = 'md',
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center pointer-events-none select-none',
        ICON_CONTAINER_SIZES[size],
        position === 'left' && 'mr-1',
        position === 'right' && 'ml-1',
        className
      )}
      aria-hidden="true"
      {...props}
    >
      {children}
    </span>
  );
};
