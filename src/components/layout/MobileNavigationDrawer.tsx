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
      { path: '/health-worker', label: 'Field Dashboard', labelTe: 'ఫీల్డ్ డాష్‌బోర్డ్' },
      { path: '/health-worker/patients', label: 'Patient Directory', labelTe: 'రోగుల రిజిస్టర్' },
      { path: '/health-worker/register', label: 'Register Patient', labelTe: 'రోగి నమోదు' },
      { path: '/health-worker/screening/new', label: 'Guided Screening', labelTe: 'నోటి స్క్రీనింగ్' },
      { path: '/health-worker/referrals', label: 'Track Referrals', labelTe: 'రిఫరల్స్ పర్యవేక్షణ' },
      { path: '/health-worker/follow-ups', label: 'Due Follow-ups', labelTe: 'తక్షణ పర్యవేక్షణ' },
      { path: '/health-worker/sync', label: 'Offline Sync Hub', labelTe: 'ఆఫ్‌లైన్ సింక్' },
    ],
    asha: [
      { path: '/health-worker', label: 'Field Dashboard', labelTe: 'ఫీల్డ్ డాష్‌బోర్డ్' },
      { path: '/health-worker/patients', label: 'Patient Directory', labelTe: 'రోగుల రిజిస్టర్' },
      { path: '/health-worker/register', label: 'Register Patient', labelTe: 'రోగి నమోదు' },
      { path: '/health-worker/screening/new', label: 'Guided Screening', labelTe: 'నోటి స్క్రీనింగ్' },
      { path: '/health-worker/referrals', label: 'Track Referrals', labelTe: 'రిఫరల్స్ పర్యవేక్షణ' },
      { path: '/health-worker/follow-ups', label: 'Due Follow-ups', labelTe: 'తక్షణ పర్యవేక్షణ' },
      { path: '/health-worker/sync', label: 'Offline Sync Hub', labelTe: 'ఆఫ్‌లైన్ సింక్' },
    ],
    anm: [
      { path: '/health-worker', label: 'Sub-Centre Dashboard', labelTe: 'సబ్-సెంటర్ డాష్‌బోర్డ్' },
      { path: '/health-worker/patients', label: 'Patient Directory', labelTe: 'రోగుల రిజిస్టర్' },
      { path: '/health-worker/register', label: 'Register Patient', labelTe: 'రోగి నమోదు' },
      { path: '/health-worker/screening/new', label: 'Guided Screening', labelTe: 'నోటి స్క్రీనింగ్' },
      { path: '/health-worker/referrals', label: 'Track Referrals', labelTe: 'రిఫరల్స్ పర్యవేక్షణ' },
      { path: '/health-worker/follow-ups', label: 'Due Follow-ups', labelTe: 'తక్షణ పర్యవేక్షణ' },
      { path: '/health-worker/sync', label: 'Offline Sync Hub', labelTe: 'ఆఫ్‌లైన్ సింక్' },
    ],
    doctor: [
      { path: '/doctor', label: 'Clinical Dashboard', labelTe: 'క్లినికల్ డాష్‌బోర్డ్' },
      { path: '/doctor/cases', label: 'Case Review Queue', labelTe: 'పరిశీలన జాబితా' },
      { path: '/doctor/referrals', label: 'Specialist Referrals', labelTe: 'స్పెషలిస్ట్ రిఫరల్స్' },
      { path: '/doctor/telemedicine', label: 'Telemedicine Hub', labelTe: 'వీడియో సంప్రదింపు' },
    ],
    specialist: [
      { path: '/doctor', label: 'Specialist Dashboard', labelTe: 'స్పెషలిస్ట్ డాష్‌బోర్డ్' },
      { path: '/doctor/cases', label: 'Referred Oral Cases', labelTe: 'రిఫర్డ్ కేసులు' },
      { path: '/doctor/telemedicine', label: 'Teleconsultations', labelTe: 'వీడియో సంప్రదింపు' },
    ],
    hospital_coordinator: [
      { path: '/hospital', label: 'Hospital Dashboard', labelTe: 'ఆసుపత్రి డాష్‌బోర్డ్' },
      { path: '/hospital/referrals', label: 'Inbound Referrals', labelTe: 'వచ్చిన రిఫరల్స్' },
      { path: '/hospital/appointments', label: 'Specialist OPD Clinic', labelTe: 'ఓపీడీ అపాయింట్‌మెంట్లు' },
      { path: '/hospital/investigations', label: 'Biopsy & Diagnostics', labelTe: 'బయాప్సీ & ల్యాబ్' },
      { path: '/hospital/navigation', label: 'Patient Navigation', labelTe: 'పేషెంట్ నావిగేషన్' },
    ],
    admin: [
      { path: '/admin', label: 'District Health Overview', labelTe: 'జిల్లా సమగ్ర నివేదిక' },
      { path: '/admin/map', label: 'Coverage & Village Map', labelTe: 'గ్రామ కవరేజ్ మ్యాప్' },
      { path: '/admin/reports', label: 'Programme Analytics', labelTe: 'విశ్లేషణ నివేదికలు' },
      { path: '/admin/system', label: 'System & Sync Health', labelTe: 'సిస్టమ్ & సింక్ స్థితి' },
      { path: '/admin/users', label: 'Staff Management', labelTe: 'సిబ్బంది నిర్వహణ' },
    ],
    patient: [
      { path: '/patient/portal', label: 'My Health Profile', labelTe: 'నా ఆరోగ్య వివరాలు' },
      { path: '/patient/card-preview', label: 'Physical Health Card', labelTe: 'హెల్త్ కార్డ్ ప్రివ్యూ' },
      { path: '/patient/assisted-guide', label: 'Assisted Access Guide', labelTe: 'ఉచిత సేవల మార్గదర్శి' },
      { path: '/patient/screenings', label: 'My Screenings History', labelTe: 'నా స్క్రీనింగ్ రికార్డులు' },
      { path: '/patient/journey', label: 'Care Journey Timeline', labelTe: 'ఆరోగ్య ప్రయాణం' },
      { path: '/patient/caregiver', label: 'Family Caregiver Access', labelTe: 'కుటుంబ సంరక్షకులు' },
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
