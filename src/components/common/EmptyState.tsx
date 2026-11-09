import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';
import { useTranslation } from '../../i18n';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  titleTe?: string;
  description: string;
  descriptionTe?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  titleTe,
  description,
  descriptionTe,
  action,
  className = '',
}) => {
  const { language } = useTranslation();

  return (
    <div className={`p-8 sm:p-12 rounded-2xl bg-white border border-forest-100 text-center flex flex-col items-center justify-center max-w-md mx-auto shadow-nature ${className}`}>
      <div className="p-4 rounded-2xl bg-forest-50 text-forest-700 mb-4">
        <Icon className="w-8 h-8 sm:w-10 sm:h-10" aria-hidden="true" />
      </div>

      <h3 className="text-base sm:text-lg font-bold text-ink">
        {language === 'te' && titleTe ? titleTe : title}
      </h3>
      {language !== 'te' && titleTe && (
        <p className="text-sm font-telugu text-forest-700 font-medium mt-0.5">
          {titleTe}
        </p>
      )}

      <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-relaxed">
        {language === 'te' && descriptionTe ? descriptionTe : description}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
