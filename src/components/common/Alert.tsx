import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export type AlertType = 'info' | 'warning' | 'success' | 'danger';

export interface AlertProps {
  type?: AlertType;
  title: string;
  titleTe?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  titleTe,
  children,
  onClose,
  action,
  className = '',
}) => {
  const config = {
    info: {
      border: 'border-blue-200',
      bg: 'bg-blue-50/80',
      textTitle: 'text-status-info',
      icon: Info,
      iconColor: 'text-status-info',
    },
    warning: {
      border: 'border-amber-300',
      bg: 'bg-amber-50/90',
      textTitle: 'text-status-warning',
      icon: AlertTriangle,
      iconColor: 'text-status-warning',
    },
    success: {
      border: 'border-emerald-200',
      bg: 'bg-emerald-50/90',
      textTitle: 'text-status-success',
      icon: CheckCircle2,
      iconColor: 'text-status-success',
    },
    danger: {
      border: 'border-red-200',
      bg: 'bg-red-50/90',
      textTitle: 'text-status-danger',
      icon: AlertCircle,
      iconColor: 'text-status-danger',
    },
  };

  const style = config[type];
  const Icon = style.icon;

  return (
    <div
      role="alert"
      className={`relative p-4 sm:p-5 rounded-2xl border ${style.border} ${style.bg} transition-all duration-150 ${className}`}
    >
      <div className="flex items-start gap-3.5">
        <div className="shrink-0 mt-0.5">
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${style.iconColor}`} aria-hidden="true" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h4 className={`text-sm sm:text-base font-semibold ${style.textTitle}`}>
              {title}
            </h4>
            {titleTe && (
              <span className="text-xs sm:text-sm font-telugu text-ink-muted font-medium">
                ({titleTe})
              </span>
            )}
          </div>

          {children && (
            <div className="mt-1.5 text-xs sm:text-sm text-ink leading-relaxed">
              {children}
            </div>
          )}

          {action && <div className="mt-3">{action}</div>}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="shrink-0 -mr-1 -mt-1 p-1 rounded-lg text-ink-muted hover:text-ink hover:bg-black/5 transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
