import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from '../../i18n';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface BreadcrumbsProps {
  customItems?: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  customItems,
  className = '',
}) => {
  const location = useLocation();
  const { t } = useTranslation();

  const pathSegments = location.pathname.split('/').filter(Boolean);

  const formatSegment = (seg: string) => {
    return seg
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const items: BreadcrumbItem[] = customItems || [
    { label: t('dashboard'), path: pathSegments.length > 0 ? `/${pathSegments[0]}` : '/' },
    ...pathSegments.slice(1).map((seg, idx) => {
      const fullPath = `/${pathSegments.slice(0, idx + 2).join('/')}`;
      return {
        label: formatSegment(seg),
        path: idx === pathSegments.length - 2 ? undefined : fullPath,
      };
    }),
  ];

  if (items.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-xs text-ink-muted mb-4 ${className}`}>
      <ol className="flex items-center gap-1.5 flex-wrap">
        <li>
          <Link
            to={items[0].path || '/'}
            className="hover:text-forest-900 transition-colors flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {item.path ? (
              <Link to={item.path} className="hover:text-forest-900 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-ink" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
