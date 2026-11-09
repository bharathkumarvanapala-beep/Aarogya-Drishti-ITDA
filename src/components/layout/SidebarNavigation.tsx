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
      { path: '/health-worker', label: 'Field Dashboard', labelTe: 'ఫీల్డ్ డాష్‌బోర్డ్', icon: LayoutDashboard },
      { path: '/health-worker/patients', label: 'Patient Directory', labelTe: 'రోగుల రిజిస్టర్', icon: Users },
      { path: '/health-worker/register', label: 'Register Patient', labelTe: 'రోగి నమోదు', icon: UserPlus },
      { path: '/health-worker/screening/new', label: 'Guided Screening', labelTe: 'నోటి స్క్రీనింగ్', icon: Camera },
      { path: '/health-worker/referrals', label: 'Track Referrals', labelTe: 'రిఫరల్స్ పర్యవేక్షణ', icon: Send },
      { path: '/health-worker/follow-ups', label: 'Due Follow-ups', labelTe: 'తక్షణ పర్యవేక్షణ', icon: RotateCw, badge: '3' },
      { path: '/health-worker/sync', label: 'Offline Sync Hub', labelTe: 'ఆఫ్‌లైన్ సింక్', icon: Wifi },
    ],
    asha: [
      { path: '/health-worker', label: 'Field Dashboard', labelTe: 'ఫీల్డ్ డాష్‌బోర్డ్', icon: LayoutDashboard },
      { path: '/health-worker/patients', label: 'Patient Directory', labelTe: 'రోగుల రిజిస్టర్', icon: Users },
      { path: '/health-worker/register', label: 'Register Patient', labelTe: 'రోగి నమోదు', icon: UserPlus },
      { path: '/health-worker/screening/new', label: 'Guided Screening', labelTe: 'నోటి స్క్రీనింగ్', icon: Camera },
      { path: '/health-worker/referrals', label: 'Track Referrals', labelTe: 'రిఫరల్స్ పర్యవేక్షణ', icon: Send },
      { path: '/health-worker/follow-ups', label: 'Due Follow-ups', labelTe: 'తక్షణ పర్యవేక్షణ', icon: RotateCw, badge: '3' },
      { path: '/health-worker/sync', label: 'Offline Sync Hub', labelTe: 'ఆఫ్‌లైన్ సింక్', icon: Wifi },
    ],
    anm: [
      { path: '/health-worker', label: 'Sub-Centre Dashboard', labelTe: 'సబ్-సెంటర్ డాష్‌బోర్డ్', icon: LayoutDashboard },
      { path: '/health-worker/patients', label: 'Patient Directory', labelTe: 'రోగుల రిజిస్టర్', icon: Users },
      { path: '/health-worker/register', label: 'Register Patient', labelTe: 'రోగి నమోదు', icon: UserPlus },
      { path: '/health-worker/screening/new', label: 'Guided Screening', labelTe: 'నోటి స్క్రీనింగ్', icon: Camera },
      { path: '/health-worker/referrals', label: 'Track Referrals', labelTe: 'రిఫరల్స్ పర్యవేక్షణ', icon: Send },
      { path: '/health-worker/follow-ups', label: 'Due Follow-ups', labelTe: 'తక్షణ పర్యవేక్షణ', icon: RotateCw, badge: '3' },
      { path: '/health-worker/sync', label: 'Offline Sync Hub', labelTe: 'ఆఫ్‌లైన్ సింక్', icon: Wifi },
    ],
    doctor: [
      { path: '/doctor', label: 'Clinical Dashboard', labelTe: 'క్లినికల్ డాష్‌బోర్డ్', icon: LayoutDashboard },
      { path: '/doctor/cases', label: 'Case Review Queue', labelTe: 'పరిశీలన జాబితా', icon: Stethoscope, badge: '5' },
      { path: '/doctor/referrals', label: 'Specialist Referrals', labelTe: 'స్పెషలిస్ట్ రిఫరల్స్', icon: Send },
      { path: '/doctor/telemedicine', label: 'Telemedicine Hub', labelTe: 'వీడియో సంప్రదింపు', icon: Video },
    ],
    specialist: [
      { path: '/doctor', label: 'Specialist Dashboard', labelTe: 'స్పెషలిస్ట్ డాష్‌బోర్డ్', icon: LayoutDashboard },
      { path: '/doctor/cases', label: 'Referred Oral Cases', labelTe: 'రిఫర్డ్ కేసులు', icon: Stethoscope },
      { path: '/doctor/telemedicine', label: 'Teleconsultations', labelTe: 'వీడియో సంప్రదింపు', icon: Video },
    ],
    hospital_coordinator: [
      { path: '/hospital', label: 'Hospital Dashboard', labelTe: 'ఆసుపత్రి డాష్‌బోర్డ్', icon: LayoutDashboard },
      { path: '/hospital/referrals', label: 'Inbound Referrals', labelTe: 'వచ్చిన రిఫరల్స్', icon: Building2, badge: '8' },
      { path: '/hospital/appointments', label: 'Specialist OPD Clinic', labelTe: 'ఓపీడీ అపాయింట్‌మెంట్లు', icon: Calendar },
      { path: '/hospital/investigations', label: 'Biopsy & Diagnostics', labelTe: 'బయాప్సీ & ల్యాబ్', icon: Microscope },
      { path: '/hospital/navigation', label: 'Patient Navigation', labelTe: 'పేషెంట్ నావిగేషన్', icon: Compass },
    ],
    admin: [
      { path: '/admin', label: 'District Health Overview', labelTe: 'జిల్లా సమగ్ర నివేదిక', icon: LayoutDashboard },
      { path: '/admin/map', label: 'Coverage & Village Map', labelTe: 'గ్రామ కవరేజ్ మ్యాప్', icon: Map },
      { path: '/admin/reports', label: 'Programme Analytics', labelTe: 'విశ్లేషణ నివేదికలు', icon: BarChart3 },
      { path: '/admin/system', label: 'System & Sync Health', labelTe: 'సిస్టమ్ & సింక్ స్థితి', icon: Server },
      { path: '/admin/users', label: 'Staff Management', labelTe: 'సిబ్బంది నిర్వహణ', icon: Users },
    ],
    patient: [
      { path: '/patient/portal', label: 'My Health Profile', labelTe: 'నా ఆరోగ్య వివరాలు', icon: FileText },
      { path: '/patient/card-preview', label: 'Physical Health Card', labelTe: 'హెల్త్ కార్డ్ ప్రివ్యూ', icon: CreditCard },
      { path: '/patient/assisted-guide', label: 'Assisted Access Guide', labelTe: 'ఉచిత సేవల మార్గదర్శి', icon: HeartHandshake },
      { path: '/patient/screenings', label: 'My Screenings History', labelTe: 'నా స్క్రీనింగ్ రికార్డులు', icon: ShieldCheck },
      { path: '/patient/journey', label: 'Care Journey Timeline', labelTe: 'ఆరోగ్య ప్రయాణం', icon: RotateCw },
      { path: '/patient/caregiver', label: 'Family Caregiver Access', labelTe: 'కుటుంబ సంరక్షకులు', icon: Users },
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
