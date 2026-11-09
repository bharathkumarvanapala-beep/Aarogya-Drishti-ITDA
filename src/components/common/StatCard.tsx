import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from '../../i18n';

export interface StatCardProps {
  label: string;
  labelTe?: string;
  value: string | number;
  icon: LucideIcon;
  subtext?: string;
  subtextTe?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  variant?: 'forest' | 'blue' | 'amber' | 'emerald' | 'default';
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  labelTe,
  value,
  icon: Icon,
  subtext,
  subtextTe,
  trend,
  variant = 'default',
  onClick,
  className = '',
}) => {
  const { language } = useTranslation();

  const variantStyles = {
    default: {
      card: 'bg-white border border-forest-100/90 shadow-nature hover:border-forest-700/40',
      iconBox: 'bg-forest-100 text-forest-900',
    },
    forest: {
      card: 'bg-gradient-to-br from-forest-900 to-forest-800 text-white shadow-nature-lg border border-forest-700',
      iconBox: 'bg-white/15 text-white',
      textMain: 'text-white',
      textMuted: 'text-forest-100/80',
    },
    blue: {
      card: 'bg-white border border-blue-100 shadow-nature hover:border-blue-300',
      iconBox: 'bg-blue-50 text-status-info',
    },
    amber: {
      card: 'bg-white border border-amber-100 shadow-nature hover:border-amber-300',
      iconBox: 'bg-amber-50 text-status-warning',
    },
    emerald: {
      card: 'bg-white border border-emerald-100 shadow-nature hover:border-emerald-300',
      iconBox: 'bg-emerald-50 text-status-success',
    },
  };

  const style = variantStyles[variant] || variantStyles.default;
  const isDark = variant === 'forest';

  return (
    <div
      onClick={onClick}
      className={`relative p-5 sm:p-6 rounded-2xl transition-all duration-200 ${style.card} ${
        onClick ? 'cursor-pointer active:scale-[0.99]' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`text-xs sm:text-sm font-medium tracking-wide uppercase ${isDark ? 'text-forest-100/80' : 'text-ink-muted'}`}>
            {language === 'te' && labelTe ? labelTe : label}
          </p>
          {language !== 'te' && labelTe && (
            <p className="text-xs font-telugu text-forest-700 font-medium mt-0.5">
              {labelTe}
            </p>
          )}

          <div className="mt-2.5 flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-ink'}`}>
              {value}
            </span>

            {trend && (
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  trend.isPositive
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {trend.value}
              </span>
            )}
          </div>

          {(subtext || subtextTe) && (
            <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-forest-100/70' : 'text-ink-muted'}`}>
              {language === 'te' && subtextTe ? subtextTe : subtext}
            </p>
          )}
        </div>

        <div className={`p-3.5 rounded-xl shrink-0 ${style.iconBox}`}>
          <Icon className="w-6 h-6" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};
