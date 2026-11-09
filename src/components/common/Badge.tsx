import React from 'react';
import type { LucideIcon } from 'lucide-react';

export type BadgeVariant = 'info' | 'warning' | 'success' | 'danger' | 'neutral' | 'forest';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  label: string;
  labelTe?: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: LucideIcon;
  showDot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  labelTe,
  variant = 'info',
  size = 'md',
  icon: Icon,
  showDot = true,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 gap-1.5 font-medium',
    md: 'text-xs sm:text-sm px-3 py-1 gap-2 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2.5 font-semibold',
  };

  const variantStyles = {
    info: 'bg-blue-50 text-status-info border border-blue-200/80',
    warning: 'bg-amber-50 text-status-warning border border-amber-300/80',
    success: 'bg-emerald-50 text-status-success border border-emerald-200/80',
    danger: 'bg-red-50 text-status-danger border border-red-200/80',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    forest: 'bg-forest-100 text-forest-900 border border-forest-200',
  };

  const dotColors = {
    info: 'bg-status-info',
    warning: 'bg-status-warning',
    success: 'bg-status-success',
    danger: 'bg-status-danger',
    neutral: 'bg-slate-400',
    forest: 'bg-forest-800',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {showDot && (
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${dotColors[variant]} animate-pulse`}
          aria-hidden="true"
        />
      )}
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
      <span className="leading-none">{label}</span>
      {labelTe && (
        <span className="text-xs opacity-85 font-telugu border-l border-current/25 pl-1.5 leading-none">
          {labelTe}
        </span>
      )}
    </span>
  );
};
