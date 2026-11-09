import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
  labelTe?: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  labelTe?: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
  required?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  labelTe,
  options,
  helperText,
  error,
  required = false,
  className = '',
  disabled,
  id,
  ...props
}, ref) => {
  const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-1.5">
        <label
          htmlFor={selectId}
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
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={`block w-full rounded-xl border bg-white px-4 py-3 text-base text-ink min-h-[48px] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed appearance-none ${
            error
              ? 'border-status-danger focus:border-status-danger focus:ring-red-400'
              : 'border-slate-300 focus:border-forest-700 focus:ring-forest-700/30 hover:border-slate-400'
          } ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label} {opt.labelTe ? `(${opt.labelTe})` : ''}
            </option>
          ))}
        </select>

        {/* Custom Chevron Indicator */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-ink-muted">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
          </svg>
        </div>
      </div>

      {error ? (
        <p id={`${selectId}-error`} className="mt-1.5 text-xs sm:text-sm text-status-danger font-medium">
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-ink-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
