import {navigationCopy} from '../../i18n/navigation';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserPlus, 
  Camera, 
  FileText, 
  RotateCw, 
  Wifi, 
  Stethoscope, 
  Send, 
  Video, 
  Building2, 
  Calendar, 
  Microscope, 
  Compass, 
  Map, 
  BarChart3, 
  Server, 
  Users, 
  CreditCard, 
  HeartHandshake, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../../context';
import { useTranslation } from '../../i18n';
import type { UserRole } from '../../types';

interface NavItem {
  path: string;
  label: string;
  labelTe: string;
  icon: LucideIcon;
  badge?: string;
}

export const SidebarNavigation: React.FC = () => {
  const { currentUser, role, logout } = useAuth();
  const { language, t } = useTranslation();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Role-specific navigation hierarchies
  const navItemsByRole: Record<UserRole, NavItem[]> = {
    health_worker: [
      { path: '/health-worker', label: navigationCopy.en.nav0, labelTe: navigationCopy.te.nav0, icon: LayoutDashboard },
      { path: '/health-worker/patients', label: navigationCopy.en.nav1, labelTe: navigationCopy.te.nav1, icon: Users },
      { path: '/health-worker/register', label: navigationCopy.en.nav2, labelTe: navigationCopy.te.nav2, icon: UserPlus },
      { path: '/health-worker/screening/new', label: navigationCopy.en.nav3, labelTe: navigationCopy.te.nav3, icon: Camera },
      { path: '/health-worker/medgemma', label: 'MedGemma AI', labelTe: 'MedGemma AI · అభివృద్ధిలో ఉంది', icon: Camera },
      { path: '/health-worker/referrals', label: navigationCopy.en.nav4, labelTe: navigationCopy.te.nav4, icon: Send },
      { path: '/health-worker/follow-ups', label: navigationCopy.en.nav5, labelTe: navigationCopy.te.nav5, icon: RotateCw, badge: undefined },
      { path: '/health-worker/sync', label: navigationCopy.en.nav6, labelTe: navigationCopy.te.nav6, icon: Wifi },
    ],
    asha: [
      { path: '/health-worker', label: navigationCopy.en.nav7, labelTe: navigationCopy.te.nav7, icon: LayoutDashboard },
      { path: '/health-worker/patients', label: navigationCopy.en.nav8, labelTe: navigationCopy.te.nav8, icon: Users },
      { path: '/health-worker/register', label: navigationCopy.en.nav9, labelTe: navigationCopy.te.nav9, icon: UserPlus },
      { path: '/health-worker/screening/new', label: navigationCopy.en.nav10, labelTe: navigationCopy.te.nav10, icon: Camera },
      { path: '/health-worker/medgemma', label: 'MedGemma AI', labelTe: 'MedGemma AI · అభివృద్ధిలో ఉంది', icon: Camera },
      { path: '/health-worker/referrals', label: navigationCopy.en.nav11, labelTe: navigationCopy.te.nav11, icon: Send },
      { path: '/health-worker/follow-ups', label: navigationCopy.en.nav12, labelTe: navigationCopy.te.nav12, icon: RotateCw, badge: undefined },
      { path: '/health-worker/sync', label: navigationCopy.en.nav13, labelTe: navigationCopy.te.nav13, icon: Wifi },
    ],
    anm: [
      { path: '/health-worker', label: navigationCopy.en.nav14, labelTe: navigationCopy.te.nav14, icon: LayoutDashboard },
      { path: '/health-worker/patients', label: navigationCopy.en.nav15, labelTe: navigationCopy.te.nav15, icon: Users },
      { path: '/health-worker/register', label: navigationCopy.en.nav16, labelTe: navigationCopy.te.nav16, icon: UserPlus },
      { path: '/health-worker/screening/new', label: navigationCopy.en.nav17, labelTe: navigationCopy.te.nav17, icon: Camera },
      { path: '/health-worker/medgemma', label: 'MedGemma AI', labelTe: 'MedGemma AI · అభివృద్ధిలో ఉంది', icon: Camera },
      { path: '/health-worker/referrals', label: navigationCopy.en.nav18, labelTe: navigationCopy.te.nav18, icon: Send },
      { path: '/health-worker/follow-ups', label: navigationCopy.en.nav19, labelTe: navigationCopy.te.nav19, icon: RotateCw, badge: undefined },
      { path: '/health-worker/sync', label: navigationCopy.en.nav20, labelTe: navigationCopy.te.nav20, icon: Wifi },
    ],
    doctor: [
      { path: '/doctor', label: navigationCopy.en.nav21, labelTe: navigationCopy.te.nav21, icon: LayoutDashboard },
      { path: '/doctor/cases', label: navigationCopy.en.nav22, labelTe: navigationCopy.te.nav22, icon: Stethoscope, badge: undefined },
      { path: '/doctor/referrals', label: navigationCopy.en.nav23, labelTe: navigationCopy.te.nav23, icon: Send },
      { path: '/doctor/telemedicine', label: navigationCopy.en.nav24, labelTe: navigationCopy.te.nav24, icon: Video },
    ],
    specialist: [
      { path: '/specialist', label: navigationCopy.en.nav25, labelTe: navigationCopy.te.nav25, icon: LayoutDashboard },
      { path: '/specialist/cases', label: navigationCopy.en.nav26, labelTe: navigationCopy.te.nav26, icon: Stethoscope },
      { path: '/specialist/telemedicine', label: navigationCopy.en.nav27, labelTe: navigationCopy.te.nav27, icon: Video },
    ],
    hospital_coordinator: [
      { path: '/navigator', label: navigationCopy.en.nav28, labelTe: navigationCopy.te.nav28, icon: LayoutDashboard },
      { path: '/navigator/referrals', label: navigationCopy.en.nav29, labelTe: navigationCopy.te.nav29, icon: Building2, badge: undefined },
      { path: '/navigator/appointments', label: navigationCopy.en.nav30, labelTe: navigationCopy.te.nav30, icon: Calendar },
      { path: '/navigator/investigations', label: navigationCopy.en.nav31, labelTe: navigationCopy.te.nav31, icon: Microscope },
      { path: '/navigator/navigation', label: navigationCopy.en.nav32, labelTe: navigationCopy.te.nav32, icon: Compass },
    ],
    admin: [
      { path: '/admin', label: navigationCopy.en.nav33, labelTe: navigationCopy.te.nav33, icon: LayoutDashboard },
      { path: '/admin/map', label: navigationCopy.en.nav34, labelTe: navigationCopy.te.nav34, icon: Map },
      { path: '/admin/reports', label: navigationCopy.en.nav35, labelTe: navigationCopy.te.nav35, icon: BarChart3 },
      { path: '/admin/system', label: navigationCopy.en.nav36, labelTe: navigationCopy.te.nav36, icon: Server },
      { path: '/admin/users', label: navigationCopy.en.nav37, labelTe: navigationCopy.te.nav37, icon: Users },
    ],
    patient: [
      { path: '/patient/portal', label: navigationCopy.en.nav38, labelTe: navigationCopy.te.nav38, icon: FileText },
      { path: '/patient/card-preview', label: navigationCopy.en.nav39, labelTe: navigationCopy.te.nav39, icon: CreditCard },
      { path: '/patient/assisted-guide', label: navigationCopy.en.nav40, labelTe: navigationCopy.te.nav40, icon: HeartHandshake },
      { path: '/patient/screenings', label: navigationCopy.en.nav41, labelTe: navigationCopy.te.nav41, icon: ShieldCheck },
      { path: '/patient/journey', label: navigationCopy.en.nav42, labelTe: navigationCopy.te.nav42, icon: RotateCw },
      { path: '/patient/caregiver', label: navigationCopy.en.nav43, labelTe: navigationCopy.te.nav43, icon: Users },
    ],
  };

  const currentRole = role || 'health_worker';
  const navItems = navItemsByRole[currentRole] || navItemsByRole.health_worker;

  const isActive = (itemPath: string) => {
    return location.pathname === itemPath;
  };

  return (
    <aside
      className={`hidden lg:flex flex-col bg-forest-900 text-white transition-all duration-300 relative border-r border-forest-800 z-20 shrink-0 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Sidebar Header */}
      <div className="p-4 border-b border-forest-800/80 flex items-center justify-between h-20">
        {!collapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className="w-5 h-5" fill="none">
                <path d="M20 7C14 7 10 12 10 18C10 25 15 31 19 33.5C19.6 33.8 20.4 33.8 21 33.5C25 31 30 25 30 18C30 12 26 7 20 7Z" fill="#E8F5EF" stroke="#398F72" strokeWidth="2" />
                <path d="M15 20C17 23 23 23 25 20" stroke="#075B4D" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="truncate">
              <span className="text-sm font-bold tracking-tight text-white block truncate">
                AAROGYA DRISHTI
              </span>
              <span className="text-[10px] text-forest-200 block truncate font-mono">
                ITDA Paderu
              </span>
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-forest-200 hover:text-white hover:bg-forest-800/80 transition-colors mx-auto focus:outline-none"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Role Badge Indicator */}
      {!collapsed && currentUser && (
        <div className="px-4 py-3 bg-forest-950/40 border-b border-forest-800/60">
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block font-mono">
            Active Portal
          </span>
          <p className="text-xs font-semibold text-white truncate">
            {language === 'te' ? currentUser.roleTitleTe : currentUser.roleTitle}
          </p>
          <p className="text-[10px] text-forest-200/80 truncate">
            {currentUser.facility}
          </p>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? (language === 'te' ? item.labelTe : item.label) : undefined}
              className={`group flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-forest-700/80 text-white shadow-md shadow-forest-950/20 font-bold border-l-4 border-emerald-400 pl-3'
                  : 'text-forest-100 hover:text-white hover:bg-forest-800/60'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-emerald-300' : 'text-forest-200 group-hover:text-white'}`} />
              
              {!collapsed && (
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <div className="truncate">
                    <span className="block truncate leading-tight">{item.label}</span>
                    <span className="text-[10px] font-telugu text-forest-200 block truncate -mt-0.5">
                      {item.labelTe}
                    </span>
                  </div>

                  {item.badge && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-forest-950">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions: Public Website Link & Logout */}
      <div className="p-3 border-t border-forest-800/80 space-y-1 bg-forest-950/30">
        <Link
          to="/"
          title={collapsed ? 'Public Website' : undefined}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-forest-200 hover:text-white hover:bg-forest-800/60 transition-colors"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Public Website (హోమ్)</span>}
        </Link>

        <button
          onClick={logout}
          title={collapsed ? t('logout') : undefined}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>{t('logout')}</span>}
        </button>
      </div>
    </aside>
  );
};
