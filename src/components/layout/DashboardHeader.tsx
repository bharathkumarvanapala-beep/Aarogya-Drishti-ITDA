import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, LogOut, WifiOff, UserCheck, ChevronDown, CheckCircle2, RotateCw, HardDrive, ArrowLeft } from 'lucide-react';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { NotificationPanel } from './NotificationPanel';
import { useAuth, useSync } from '../../context';
import { useTranslation } from '../../i18n';

export interface DashboardHeaderProps {
  onToggleSidebar?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onToggleSidebar }) => {
  const { currentUser, logout } = useAuth();
  const { language, t } = useTranslation();
  const { syncState, pendingCount } = useSync();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-forest-100 shadow-sm transition-all h-16 sm:h-20 flex items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full flex items-center justify-between gap-4">
        
        {/* Left Side: Mobile Menu Button & Brand Identity */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-forest-900 hover:bg-forest-50 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-forest-700"
              aria-label="Toggle navigation drawer"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}

          {/* Go to Previous / Portal Gateway Arrow Button */}
          <button
            type="button"
            onClick={() => {
              if (window.history.state && window.history.state.idx > 0) {
                navigate(-1);
              } else {
                navigate('/login');
              }
            }}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-forest-800 bg-forest-50 hover:bg-forest-100 border border-forest-200 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer group"
            aria-label={language === 'te' ? 'మునుపటి పేజీకి వెళ్లండి' : 'Go to previous page'}
            title={language === 'te' ? 'మునుపటి పేజీకి వెళ్లండి' : 'Go to previous page'}
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">{language === 'te' ? 'మునుపటి' : 'Previous'}</span>
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-forest-900 flex items-center justify-center text-white shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className="w-6 h-6" fill="none">
                <path d="M20 7C14 7 10 12 10 18C10 25 15 31 19 33.5C19.6 33.8 20.4 33.8 21 33.5C25 31 30 25 30 18C30 12 26 7 20 7Z" fill="#E8F5EF" stroke="#398F72" strokeWidth="2" />
                <path d="M15 20C17 23 23 23 25 20" stroke="#075B4D" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold text-ink leading-tight block">
                AAROGYA DRISHTI
              </span>
              <span className="text-[10px] sm:text-xs font-telugu text-forest-700 font-semibold block -mt-0.5">
                {currentUser ? (language === 'te' ? currentUser.roleTitleTe : currentUser.roleTitle) : 'Portal'}
              </span>
            </div>
          </Link>
        </div>

        {/* Right Side: Sync status, Notifications, Language, Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Offline Sync Status Badge / Pill */}
          <Link
            to="/health-worker/sync"
            className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all hover:shadow-sm ${
              syncState === 'SYNCED'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : syncState === 'SYNCING'
                ? 'bg-blue-50 text-blue-800 border-blue-300 animate-pulse'
                : syncState === 'SAVED_LOCALLY'
                ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                : 'bg-red-50 text-red-800 border-red-300 hover:bg-red-100'
            }`}
            title="Click to open Offline Synchronization Hub"
          >
            {syncState === 'SYNCED' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Synced • 0 Drafts</span>
              </>
            ) : syncState === 'SYNCING' ? (
              <>
                <RotateCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                <span>Syncing Records...</span>
              </>
            ) : syncState === 'SAVED_LOCALLY' ? (
              <>
                <HardDrive className="w-3.5 h-3.5 text-amber-700" />
                <span>{pendingCount} Saved Locally (Ready to Sync)</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-red-600" />
                <span>Offline Mode ({pendingCount} Cached)</span>
              </>
            )}
          </Link>

          {/* Notifications */}
          <NotificationPanel />

          {/* Language Switcher */}
          <LanguageSwitcher variant="compact" />

          {/* User Profile Dropdown */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-forest-50 border border-transparent hover:border-forest-100 transition-colors focus:outline-none focus:ring-2 focus:ring-forest-700 min-h-[44px]"
                aria-expanded={profileOpen}
                aria-label="User profile menu"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover border border-forest-200"
                />
                <div className="hidden lg:block text-left">
                  <span className="text-xs font-bold text-ink block leading-tight">
                    {language === 'te' ? currentUser.nameTe : currentUser.name}
                  </span>
                  <span className="text-[10px] text-ink-muted block">
                    {currentUser.facility}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-ink-muted hidden sm:block" />
              </button>

              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                    aria-hidden="true"
                  />

                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-nature-lg border border-forest-100 z-50 overflow-hidden animate-fadeIn p-2 space-y-1">
                    <div className="p-3 bg-forest-50/70 rounded-xl mb-1">
                      <span className="text-xs font-bold text-ink block">
                        {language === 'te' ? currentUser.nameTe : currentUser.name}
                      </span>
                      <span className="text-[11px] font-telugu text-forest-800 block">
                        {language === 'te' ? currentUser.roleTitleTe : currentUser.roleTitle}
                      </span>
                      <span className="text-[10px] text-ink-muted block mt-1 font-mono">
                        {currentUser.facility} • {currentUser.district}
                      </span>
                    </div>

                    <Link
                      to="/login"
                      onClick={() => setProfileOpen(false)}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-ink hover:bg-forest-50 rounded-lg flex items-center gap-2"
                    >
                      <UserCheck className="w-4 h-4 text-forest-700" />
                      <span>Switch Demo Role (రోల్ మార్చండి)</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-status-danger hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
