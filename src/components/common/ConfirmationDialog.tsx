import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';
import { useTranslation } from '../../i18n';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  titleTe?: string;
  message: string;
  messageTe?: string;
  confirmText?: string;
  confirmTextTe?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  loading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  titleTe,
  message,
  messageTe,
  confirmText,
  cancelText,
  variant = 'primary',
  loading = false,
}) => {
  const { language, t } = useTranslation();

  const icons = {
    danger: AlertCircle,
    warning: AlertTriangle,
    primary: HelpCircle,
  };

  const iconColors = {
    danger: 'bg-red-100 text-status-danger',
    warning: 'bg-amber-100 text-status-warning',
    primary: 'bg-forest-100 text-forest-900',
  };

  const buttonVariants = {
    danger: 'danger' as const,
    warning: 'primary' as const,
    primary: 'primary' as const,
  };

  const Icon = icons[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      titleTe={titleTe}
      maxWidth="sm"
      footer={
        <>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText || t('cancel')}
          </Button>
          <Button
            variant={buttonVariants[variant]}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText || t('confirm')}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-2xl shrink-0 ${iconColors[variant]}`}>
          <Icon className="w-6 h-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm text-ink leading-relaxed">
            {language === 'te' && messageTe ? messageTe : message}
          </p>
          {language !== 'te' && messageTe && (
            <p className="text-xs font-telugu text-forest-800 mt-1">
              {messageTe}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};
