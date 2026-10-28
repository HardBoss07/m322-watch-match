import React, { forwardRef } from 'react';
import { IconButtonProps } from './types';
import { getIconButtonClasses } from './button.variants';
import { ButtonIcon } from './ButtonIcon';

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      'aria-label': ariaLabel,
      variant = 'secondary',
      size = 'md',
      radius = 'full',
      isLoading = false,
      icon,
      className,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isButtonDisabled = disabled || isLoading;
    const content = icon || children;

    return (
      <button
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        disabled={isButtonDisabled}
        aria-busy={isLoading}
        className={getIconButtonClasses({
          variant,
          size,
          radius,
          className,
        })}
        {...props}
      >
        {isLoading ? (
          <ButtonIcon position="only" size={size} className="animate-spin">
            <svg
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </ButtonIcon>
        ) : (
          <ButtonIcon position="only" size={size}>
            {content}
          </ButtonIcon>
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
