import {navigationCopy} from '../../i18n/navigation';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context';
import { useTranslation } from '../../i18n';
import type { UserRole } from '../../types';

export interface MobileNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavigationDrawer: React.FC<MobileNavigationDrawerProps> = ({ isOpen, onClose }) => {
  const { currentUser, role, logout } = useAuth();
  const { language, t } = useTranslation();
  const location = useLocation();

  if (!isOpen) return null;

  const currentRole: UserRole = role || 'health_worker';

  // Navigation items definition
  const roleNavItems: Record<UserRole, Array<{ path: string; label: string; labelTe: string }>> = {
    health_worker: [
      { path: '/health-worker', label: navigationCopy.en.nav44, labelTe: navigationCopy.te.nav44 },
      { path: '/health-worker/patients', label: navigationCopy.en.nav45, labelTe: navigationCopy.te.nav45 },
      { path: '/health-worker/register', label: navigationCopy.en.nav46, labelTe: navigationCopy.te.nav46 },
      { path: '/health-worker/screening/new', label: navigationCopy.en.nav47, labelTe: navigationCopy.te.nav47 },
      { path: '/health-worker/medgemma', label: 'MedGemma AI', labelTe: 'MedGemma AI · అభివృద్ధిలో ఉంది' },
      { path: '/health-worker/referrals', label: navigationCopy.en.nav48, labelTe: navigationCopy.te.nav48 },
      { path: '/health-worker/follow-ups', label: navigationCopy.en.nav49, labelTe: navigationCopy.te.nav49 },
      { path: '/health-worker/sync', label: navigationCopy.en.nav50, labelTe: navigationCopy.te.nav50 },
    ],
    asha: [
      { path: '/health-worker', label: navigationCopy.en.nav51, labelTe: navigationCopy.te.nav51 },
      { path: '/health-worker/patients', label: navigationCopy.en.nav52, labelTe: navigationCopy.te.nav52 },
      { path: '/health-worker/register', label: navigationCopy.en.nav53, labelTe: navigationCopy.te.nav53 },
      { path: '/health-worker/screening/new', label: navigationCopy.en.nav54, labelTe: navigationCopy.te.nav54 },
      { path: '/health-worker/medgemma', label: 'MedGemma AI', labelTe: 'MedGemma AI · అభివృద్ధిలో ఉంది' },
      { path: '/health-worker/referrals', label: navigationCopy.en.nav55, labelTe: navigationCopy.te.nav55 },
      { path: '/health-worker/follow-ups', label: navigationCopy.en.nav56, labelTe: navigationCopy.te.nav56 },
      { path: '/health-worker/sync', label: navigationCopy.en.nav57, labelTe: navigationCopy.te.nav57 },
    ],
    anm: [
      { path: '/health-worker', label: navigationCopy.en.nav58, labelTe: navigationCopy.te.nav58 },
      { path: '/health-worker/patients', label: navigationCopy.en.nav59, labelTe: navigationCopy.te.nav59 },
      { path: '/health-worker/register', label: navigationCopy.en.nav60, labelTe: navigationCopy.te.nav60 },
      { path: '/health-worker/screening/new', label: navigationCopy.en.nav61, labelTe: navigationCopy.te.nav61 },
      { path: '/health-worker/medgemma', label: 'MedGemma AI', labelTe: 'MedGemma AI · అభివృద్ధిలో ఉంది' },
      { path: '/health-worker/referrals', label: navigationCopy.en.nav62, labelTe: navigationCopy.te.nav62 },
      { path: '/health-worker/follow-ups', label: navigationCopy.en.nav63, labelTe: navigationCopy.te.nav63 },
      { path: '/health-worker/sync', label: navigationCopy.en.nav64, labelTe: navigationCopy.te.nav64 },
    ],
    doctor: [
      { path: '/doctor', label: navigationCopy.en.nav65, labelTe: navigationCopy.te.nav65 },
      { path: '/doctor/cases', label: navigationCopy.en.nav66, labelTe: navigationCopy.te.nav66 },
      { path: '/doctor/referrals', label: navigationCopy.en.nav67, labelTe: navigationCopy.te.nav67 },
      { path: '/doctor/telemedicine', label: navigationCopy.en.nav68, labelTe: navigationCopy.te.nav68 },
    ],
    specialist: [
      { path: '/specialist', label: navigationCopy.en.nav69, labelTe: navigationCopy.te.nav69 },
      { path: '/specialist/cases', label: navigationCopy.en.nav70, labelTe: navigationCopy.te.nav70 },
      { path: '/specialist/telemedicine', label: navigationCopy.en.nav71, labelTe: navigationCopy.te.nav71 },
    ],
    hospital_coordinator: [
      { path: '/navigator', label: navigationCopy.en.nav72, labelTe: navigationCopy.te.nav72 },
      { path: '/navigator/referrals', label: navigationCopy.en.nav73, labelTe: navigationCopy.te.nav73 },
      { path: '/navigator/appointments', label: navigationCopy.en.nav74, labelTe: navigationCopy.te.nav74 },
      { path: '/navigator/investigations', label: navigationCopy.en.nav75, labelTe: navigationCopy.te.nav75 },
      { path: '/navigator/navigation', label: navigationCopy.en.nav76, labelTe: navigationCopy.te.nav76 },
    ],
    admin: [
      { path: '/admin', label: navigationCopy.en.nav77, labelTe: navigationCopy.te.nav77 },
      { path: '/admin/map', label: navigationCopy.en.nav78, labelTe: navigationCopy.te.nav78 },
      { path: '/admin/reports', label: navigationCopy.en.nav79, labelTe: navigationCopy.te.nav79 },
      { path: '/admin/system', label: navigationCopy.en.nav80, labelTe: navigationCopy.te.nav80 },
      { path: '/admin/users', label: navigationCopy.en.nav81, labelTe: navigationCopy.te.nav81 },
    ],
    patient: [
      { path: '/patient/portal', label: navigationCopy.en.nav82, labelTe: navigationCopy.te.nav82 },
      { path: '/patient/card-preview', label: navigationCopy.en.nav83, labelTe: navigationCopy.te.nav83 },
      { path: '/patient/assisted-guide', label: navigationCopy.en.nav84, labelTe: navigationCopy.te.nav84 },
      { path: '/patient/screenings', label: navigationCopy.en.nav85, labelTe: navigationCopy.te.nav85 },
      { path: '/patient/journey', label: navigationCopy.en.nav86, labelTe: navigationCopy.te.nav86 },
      { path: '/patient/caregiver', label: navigationCopy.en.nav87, labelTe: navigationCopy.te.nav87 },
    ],
  };

  const navItems = roleNavItems[currentRole] || roleNavItems.health_worker;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-forest-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="relative w-80 max-w-[85vw] bg-forest-900 text-white flex flex-col h-full shadow-2xl z-10 animate-slideRight">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-forest-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className="w-5 h-5" fill="none">
                <path d="M20 7C14 7 10 12 10 18C10 25 15 31 19 33.5C19.6 33.8 20.4 33.8 21 33.5C25 31 30 25 30 18C30 12 26 7 20 7Z" fill="#E8F5EF" stroke="#398F72" strokeWidth="2" />
                <path d="M15 20C17 23 23 23 25 20" stroke="#075B4D" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-bold text-white block">AAROGYA DRISHTI</span>
              <span className="text-[10px] text-forest-200 block font-mono">ITDA Paderu</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-forest-200 hover:text-white rounded-lg focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close navigation drawer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Card */}
        {currentUser && (
          <div className="p-4 bg-forest-950/40 border-b border-forest-800/80 flex items-center gap-3">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-10 h-10 rounded-xl object-cover border border-forest-700"
            />
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-white block truncate">
                {language === 'te' ? currentUser.nameTe : currentUser.name}
              </span>
              <span className="text-[11px] font-telugu text-emerald-300 block truncate">
                {language === 'te' ? currentUser.roleTitleTe : currentUser.roleTitle}
              </span>
              <span className="text-[10px] text-forest-200/80 block truncate font-mono">
                {currentUser.facility}
              </span>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all min-h-[48px] ${
                  active
                    ? 'bg-forest-700 text-white font-bold border-l-4 border-emerald-400 pl-3'
                    : 'text-forest-100 hover:text-white hover:bg-forest-800/60'
                }`}
              >
                <span>{item.label}</span>
                <span className="text-xs font-telugu text-forest-200 font-semibold">
                  {item.labelTe}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-forest-800/80 space-y-2 bg-forest-950/40">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-forest-200 hover:text-white hover:bg-forest-800/60 transition-colors"
          >
            <span>Public Website</span>
            <ExternalLink className="w-4 h-4" />
          </Link>

          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/40 hover:bg-rose-950/60 transition-colors min-h-[46px]"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('logout')}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
