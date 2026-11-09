import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  titleTe?: string;
  subtitle?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'nature' | 'accent' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  titleTe,
  subtitle,
  action,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3.5 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const variantStyles = {
    default: 'bg-white border border-[#B6CFC4]/50 shadow-[0_4px_20px_-4px_rgba(7,94,78,0.06)] rounded-2xl',
    nature: 'bg-gradient-to-br from-white via-[#E7F2EF]/30 to-[#F7F8F5] border border-[#B6CFC4]/60 shadow-[0_4px_24px_-4px_rgba(7,94,78,0.07)] rounded-2xl',
    accent: 'bg-white border-2 border-[#075E4E]/30 shadow-[0_8px_30px_-4px_rgba(7,94,78,0.1)] rounded-2xl',
    flat: 'bg-[#F7F8F5] border border-[#B6CFC4]/40 rounded-2xl',
  };

  const interactiveStyles = onClick ? 'cursor-pointer hover:border-[#075E4E]/50 hover:shadow-[0_8px_30px_-4px_rgba(7,94,78,0.12)] transition-all duration-200' : '';

  return (
    <div
      className={`${variantStyles[variant]} ${paddingStyles[padding]} ${interactiveStyles} ${className}`}
      onClick={onClick}
    >
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-forest-100/60">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-ink leading-snug">
              {title}
            </h3>
            {titleTe && (
              <p className="text-sm font-telugu text-forest-800 font-medium mt-0.5">
                {titleTe}
              </p>
            )}
            {subtitle && (
              <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
