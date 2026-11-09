import React from 'react';
import type { LucideIcon } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  // Base styles: 48px min touch target on mobile for primary actions
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none btn-transition';

  const sizeStyles = {
    sm: 'text-sm px-3.5 py-2 min-h-[38px] gap-1.5',
    md: 'text-base px-5 py-2.5 min-h-[46px] gap-2',
    lg: 'text-lg px-6 py-3.5 min-h-[52px] gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary: 'bg-[#075E4E] text-white hover:bg-[#064B40] active:bg-[#075E4E] focus:ring-[#075E4E] shadow-sm shadow-[#075E4E]/20',
    secondary: 'bg-[#E7F2EF] text-[#064B40] hover:bg-[#d8ece7] active:bg-[#E7F2EF] focus:ring-[#075E4E]',
    outline: 'border-2 border-[#075E4E]/40 bg-white text-[#064B40] hover:bg-[#E7F2EF] hover:border-[#075E4E] active:bg-[#E7F2EF] focus:ring-[#075E4E]',
    danger: 'bg-status-danger text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500 shadow-sm shadow-red-700/20',
    ghost: 'text-[#064B40] hover:bg-[#E7F2EF]/70 active:bg-[#E7F2EF] focus:ring-[#075E4E]',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />
      ) : null}
      
      <span>{children}</span>

      {!loading && Icon && iconPosition === 'right' && (
        <Icon className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />
      )}
    </button>
  );
};
