import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { AlertCircle, X } from 'lucide-react';
import { SidebarNavigation } from '../components/layout/SidebarNavigation';
import { MobileNavigationDrawer } from '../components/layout/MobileNavigationDrawer';
import { DashboardHeader } from '../components/layout/DashboardHeader';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';

export const PortalLayout: React.FC = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const location = useLocation();
  const [dismissedAlert, setDismissedAlert] = useState(false);

  const unauthorizedMessage = location.state?.unauthorized
    ? location.state?.message || 'You are not authorized to access this portal. Please log in through your assigned portal.'
    : null;

  return (
    <div className="min-h-screen flex bg-forest-50 text-ink">
      {/* Desktop Deep Forest Green Sidebar */}
      <SidebarNavigation />

      {/* Mobile Responsive Navigation Drawer */}
      <MobileNavigationDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {import.meta.env.VITE_DEMO_MODE==='true'&&<div className="bg-amber-100 text-amber-950 px-5 py-3 text-sm flex flex-wrap justify-between gap-3"><span>DEMO · Synthetic data only / కల్పిత సమాచారం మాత్రమే</span><Link className="font-bold underline" to="/login">Choose another demo role / మరో పాత్రను ఎంచుకోండి →</Link></div>}
        {/* Sticky Dashboard Header */}
        <DashboardHeader
          onToggleSidebar={() => setMobileDrawerOpen(true)}
        />

        {/* Unauthorized Redirection Alert Banner */}
        {unauthorizedMessage && !dismissedAlert && (
          <div className="bg-amber-500 text-forest-950 px-4 py-3 shadow-md border-b border-amber-600 flex items-center justify-between transition-all">
            <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold max-w-7xl mx-auto w-full">
              <AlertCircle className="w-5 h-5 shrink-0 text-forest-950" />
              <span>{unauthorizedMessage}</span>
            </div>
            <button
              onClick={() => setDismissedAlert(true)}
              className="p-1 rounded-lg hover:bg-amber-600/30 text-forest-950"
              aria-label="Dismiss message"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content Container with Breadcrumbs */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex flex-col justify-between">
          <div className="flex-1">
            <Breadcrumbs />
            <Link to="/care" className="block p-4 mb-4 bg-forest-800 text-white rounded-xl font-bold">Connected care journey / సమగ్ర ఆరోగ్య సేవలు →</Link>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
