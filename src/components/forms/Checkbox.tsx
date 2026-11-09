import React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelTe?: string;
  description?: string;
  descriptionTe?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  labelTe,
  description,
  descriptionTe,
  error,
  className = '',
  id,
  ...props
}, ref) => {
  const checkboxId = id || `check-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`relative flex items-start gap-3 p-3 rounded-xl hover:bg-forest-50/60 transition-colors ${className}`}>
      <div className="flex items-center h-6">
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          className="w-5 h-5 rounded-lg border-2 border-slate-300 text-forest-900 focus:ring-forest-700 focus:ring-offset-1 transition duration-150 cursor-pointer"
          {...props}
        />
      </div>

      <div className="text-sm select-none cursor-pointer flex-1" onClick={() => {
        const el = document.getElementById(checkboxId);
        if (el) el.click();
      }}>
        <label htmlFor={checkboxId} className="font-semibold text-ink cursor-pointer block">
          {label}
          {labelTe && (
            <span className="ml-1.5 text-xs font-telugu text-forest-800 font-medium">
              ({labelTe})
            </span>
          )}
        </label>

        {(description || descriptionTe) && (
          <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
            {description} {descriptionTe && <span className="font-telugu">({descriptionTe})</span>}
          </p>
        )}

        {error && (
          <p className="text-xs text-status-danger font-medium mt-1">
            {error}
          </p>
        )}
      </div>
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
