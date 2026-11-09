import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '../../i18n';

export interface BackButtonProps {
  label?: string;
  labelTe?: string;
  fallbackPath?: string;
  variant?: 'outline' | 'ghost' | 'pill' | 'primary';
  size?: 'sm' | 'md';
  className?: string;
  showIconOnlyOnMobile?: boolean;
  onClick?: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({
  label,
  labelTe,
  fallbackPath = '/',
  variant = 'outline',
  size = 'sm',
  className = '',
  showIconOnlyOnMobile = false,
  onClick,
}) => {
  const navigate = useNavigate();
  const { language } = useTranslation();

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    // If browser history has a previous entry, navigate back; otherwise fallback
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  const displayText =
    language === 'te'
      ? labelTe || 'మునుపటి పేజీకి (వెనుకకు)'
      : label || 'Go to Previous';

  const baseStyles =
    'inline-flex items-center gap-2 font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#075E4E] select-none cursor-pointer group';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 min-h-[38px]',
    md: 'text-sm px-4 py-2.5 min-h-[44px]',
  };

  const variantStyles = {
    outline:
      'border-2 border-[#075E4E]/30 bg-white text-[#064B40] hover:bg-[#E7F2EF] hover:border-[#075E4E] shadow-sm',
    ghost:
      'text-[#064B40] hover:bg-[#E7F2EF] hover:text-[#075E4E]',
    pill:
      'bg-[#E7F2EF] text-[#064B40] hover:bg-[#d8ece7] border border-[#075E4E]/25 shadow-sm rounded-full',
    primary:
      'bg-[#075E4E] text-white hover:bg-[#064B40] shadow-md shadow-[#075E4E]/15',
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={displayText}
      title={displayText}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      <ArrowLeft className="w-4 h-4 transition-transform duration-150 group-hover:-translate-x-1" />
      <span className={showIconOnlyOnMobile ? 'hidden sm:inline font-semibold' : 'font-semibold'}>
        {displayText}
      </span>
    </button>
  );
};

