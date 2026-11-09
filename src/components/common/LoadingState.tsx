import React from 'react';
import { Spinner } from './Spinner';
import { useTranslation } from '../../i18n';

export interface LoadingStateProps {
  message?: string;
  messageTe?: string;
  submessage?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message,
  messageTe,
  submessage,
  className = '',
}) => {
  const { language, t } = useTranslation();

  const primaryMessage = language === 'te' && messageTe ? messageTe : (message || t('loading'));
  const secondaryMessage = language !== 'te' && messageTe ? messageTe : submessage;

  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center ${className}`}>
      <div className="p-4 rounded-2xl bg-forest-100/60 mb-4 animate-pulse">
        <Spinner size="lg" color="text-forest-800" />
      </div>
      <h4 className="text-base sm:text-lg font-semibold text-ink">
        {primaryMessage}
      </h4>
      {secondaryMessage && (
        <p className="text-xs sm:text-sm text-ink-muted mt-1 font-telugu">
          {secondaryMessage}
        </p>
      )}
    </div>
  );
};
