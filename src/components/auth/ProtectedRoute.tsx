import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context';
import { isUserAuthorizedForPortal } from '../../context/AuthProvider';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  portalName?: string;
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  portalName = 'Portal',
  children,
}) => {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  // 1. Unauthenticated users must log in first
  if (!isAuthenticated || !currentUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          unauthorized: true,
          message: `Please log in with your credentials to access the ${portalName}.`,
          from: location.pathname,
        }}
      />
    );
  }

  // 2. Account status check (Suspended or rejected accounts cannot view portals)
  if (currentUser.accountStatus === 'SUSPENDED' || currentUser.accountStatus === 'REJECTED') {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          unauthorized: true,
          message:
            currentUser.accountStatus === 'SUSPENDED'
              ? 'Your account has been suspended. Please contact ITDA Paderu Administration.'
              : 'Your account registration was rejected. Please contact ITDA Paderu Administration.',
          from: location.pathname,
        }}
      />
    );
  }

  // 3. Strict Role-Based Portal Access Control (Server/Client RBAC Mirror)
  // Check if current user's role can access ANY of the allowedRoles
  const isAuthorized = allowedRoles.some((role) =>
    isUserAuthorizedForPortal(currentUser.role, role),
  );

  if (!isAuthorized) {
    // Find the user's appropriate portal path to redirect them safely
    let targetRedirect = '/login';
    if (currentUser.role === 'doctor' || currentUser.role === 'specialist') {
      targetRedirect = '/doctor';
    } else if (currentUser.role === 'asha' || currentUser.role === 'health_worker') {
      targetRedirect = '/health-worker';
    } else if (currentUser.role === 'anm') {
      targetRedirect = '/health-worker';
    } else if (currentUser.role === 'hospital_coordinator') {
      targetRedirect = '/hospital';
    } else if (currentUser.role === 'admin') {
      targetRedirect = '/admin';
    } else if (currentUser.role === 'patient') {
      targetRedirect = '/patient/portal';
    }

    return (
      <Navigate
        to={targetRedirect}
        replace
        state={{
          unauthorized: true,
          message: 'You are not authorized to access this portal. Please log in through your assigned portal.',
          from: location.pathname,
        }}
      />
    );
  }

  return children ? <>{children}</> : null;
};

