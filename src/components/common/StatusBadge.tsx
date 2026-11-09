import React from 'react';
import type { WorkflowStatus } from '../../types';
import { Badge } from './Badge';
import type { BadgeVariant } from './Badge';
import { useTranslation } from '../../i18n';

export interface StatusBadgeProps {
  status: WorkflowStatus;
  label?: string;
  customLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  showBilingual?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  customLabel,
  size = 'md',
  showBilingual = false,
  className = '',
}) => {
  const { language } = useTranslation();

  const statusConfig: Record<WorkflowStatus, { labelEn: string; labelTe: string; variant: BadgeVariant }> = {
    NEW: {
      labelEn: 'New',
      labelTe: 'కొత్తది',
      variant: 'info',
    },
    PENDING: {
      labelEn: 'Pending',
      labelTe: 'పెండింగ్',
      variant: 'warning',
    },
    IN_PROGRESS: {
      labelEn: 'In Progress',
      labelTe: 'పురోగతిలో ఉంది',
      variant: 'info',
    },
    COMPLETED: {
      labelEn: 'Completed',
      labelTe: 'పూర్తయింది',
      variant: 'success',
    },
    NEEDS_ATTENTION: {
      labelEn: 'Needs Attention',
      labelTe: 'శ్రద్ధ అవసరం',
      variant: 'danger',
    },
    NOT_AVAILABLE: {
      labelEn: 'Unavailable',
      labelTe: 'అందుబాటులో లేదు',
      variant: 'neutral',
    },
  };

  const config = statusConfig[status] || statusConfig.NOT_AVAILABLE;

  const primaryLabel = label || customLabel || (language === 'te' ? config.labelTe : config.labelEn);
  const secondaryLabel = showBilingual ? (language === 'te' ? config.labelEn : config.labelTe) : undefined;

  return (
    <Badge
      label={primaryLabel}
      labelTe={secondaryLabel}
      variant={config.variant}
      size={size}
      showDot={true}
      className={className}
    />
  );
};
