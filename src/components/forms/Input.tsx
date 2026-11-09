import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelTe?: string;
  helperText?: string;
  helperTextTe?: string;
  error?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  labelTe,
  helperText,
  helperTextTe,
  error,
  icon: Icon,
  iconPosition = 'left',
  required = false,
  className = '',
  disabled,
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-1.5">
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-ink"
        >
          {label} {required && <span className="text-status-danger">*</span>}
          {labelTe && (
            <span className="ml-1.5 text-xs font-telugu text-forest-800 font-medium">
              ({labelTe})
            </span>
          )}
        </label>
      </div>

      <div className="relative rounded-xl shadow-sm">
        {Icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
            <Icon className="w-5 h-5" aria-hidden="true" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`block w-full rounded-xl border bg-white px-4 py-3 text-base text-ink placeholder:text-slate-400 min-h-[48px] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
            Icon && iconPosition === 'left' ? 'pl-11' : ''
          } ${Icon && iconPosition === 'right' ? 'pr-11' : ''} ${
            error
              ? 'border-status-danger focus:border-status-danger focus:ring-red-400'
              : 'border-slate-300 focus:border-forest-700 focus:ring-forest-700/30 hover:border-slate-400'
          } ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />

        {Icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-ink-muted">
            <Icon className="w-5 h-5" aria-hidden="true" />
          </div>
        )}
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs sm:text-sm text-status-danger font-medium flex items-center gap-1">
          <span>{error}</span>
        </p>
      ) : (helperText || helperTextTe) ? (
        <p className="mt-1.5 text-xs text-ink-muted leading-relaxed">
          {helperText} {helperTextTe && <span className="font-telugu">({helperTextTe})</span>}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
