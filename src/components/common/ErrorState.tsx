import React from 'react';
import { AlertOctagon, RotateCw } from 'lucide-react';
import { Button } from './Button';
import { useTranslation } from '../../i18n';

export interface ErrorStateProps {
  title?: string;
  titleTe?: string;
  message?: string;
  messageTe?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something needs attention',
  titleTe = 'దయచేసి గమనించండి',
  message = 'We could not complete this action. Your records remain safe on this device.',
  messageTe = 'ఈ చర్యను పూర్తి చేయడం సాధ్యం కాలేదు. మీ రికార్డులు ఈ పరికరంలో సురక్షితంగా ఉన్నాయి.',
  onRetry,
  className = '',
}) => {
  const { language, t } = useTranslation();

  return (
    <div className={`p-8 sm:p-10 rounded-2xl bg-red-50/70 border border-red-200 text-center flex flex-col items-center max-w-lg mx-auto ${className}`}>
      <div className="p-3.5 rounded-2xl bg-red-100 text-status-danger mb-4">
        <AlertOctagon className="w-8 h-8" aria-hidden="true" />
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-ink">
        {language === 'te' ? titleTe : title}
      </h3>
      {language !== 'te' && (
        <p className="text-sm font-telugu text-forest-800 font-medium mt-0.5">
          {titleTe}
        </p>
      )}

      <p className="text-xs sm:text-sm text-ink-muted mt-2.5 leading-relaxed max-w-md">
        {language === 'te' ? messageTe : message}
      </p>

      {onRetry && (
        <div className="mt-6">
          <Button
            variant="outline"
            size="md"
            icon={RotateCw}
            onClick={onRetry}
          >
            {t('retry')}
          </Button>
        </div>
      )}
    </div>
  );
};
