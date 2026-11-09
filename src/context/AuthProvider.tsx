import React, { useState, useEffect } from 'react';
import type { UserAccount, UserRole, AccountStatus } from '../types';
import { AuthContext } from './AuthContext';
import { DEMO_USERS } from './demoUsers';
import { authErrorMessage } from '../services/authErrors';

const STORAGE_ROLE_KEY = 'aarogya_active_user_role';
const STORAGE_USER_KEY = 'aarogya_active_user_data';
const STORAGE_REGISTERED_USERS_KEY = 'aarogya_registered_users';
const BACKEND_API_BASE = '/api/v1';

const getInitialRegisteredUsers = (): UserAccount[] => {
  try {
    const saved = localStorage.getItem(STORAGE_REGISTERED_USERS_KEY);
    if (saved) {
      const parsed: UserAccount[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Auto-approve any accounts that were previously in pending verification
        const upgraded = parsed.map((u) => ({
          ...u,
          accountStatus: u.accountStatus || 'PENDING_VERIFICATION',
        }));
        try {
          localStorage.setItem(STORAGE_REGISTERED_USERS_KEY, JSON.stringify(upgraded));
        } catch {
          // ignore
        }
        return upgraded;
      }
    }
  } catch {
    // ignore
  }

  // Prepopulate standard approved demo accounts into registry so they persist
  const defaultList: UserAccount[] = Object.values(DEMO_USERS);
  try {
    localStorage.setItem(STORAGE_REGISTERED_USERS_KEY, JSON.stringify(defaultList));
  } catch {
    // ignore
  }
  return defaultList;
};

const saveRegisteredUsers = (users: UserAccount[]) => {
  try {
    localStorage.setItem(STORAGE_REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save registered users to localStorage', e);
  }
};

/**
 * Validates if the user's role is authorized to access the specified portal
 */
export const isUserAuthorizedForPortal = (userRole: UserRole, portalRole: UserRole): boolean => {
  // District Admin has comprehensive system oversight
  if (userRole === 'admin') return portalRole === 'admin';

  if (portalRole === 'doctor') {
    return userRole === 'doctor' || userRole === 'specialist';
  }
  if (portalRole === 'specialist') {
    return userRole === 'specialist' || userRole === 'doctor';
  }
  if (portalRole === 'asha') {
    return userRole === 'asha' || userRole === 'health_worker';
  }
  if (portalRole === 'anm') {
    return userRole === 'anm';
  }
  if (portalRole === 'health_worker') {
    return userRole === 'health_worker' || userRole === 'asha' || userRole === 'anm';
  }
  if (portalRole === 'hospital_coordinator') {
    return userRole === 'hospital_coordinator';
  }
  if (portalRole === 'admin') {
    return false;
  }
  if (portalRole === 'patient') {
    return userRole === 'patient';
  }
  return false;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_USER_KEY);
      if (savedUser && localStorage.getItem('aarogya_jwt_token')) {
        return JSON.parse(savedUser);
      }
    } catch {
      // ignore
    }

    const savedRole = localStorage.getItem(STORAGE_ROLE_KEY) as UserRole | null;
    if (savedRole && DEMO_USERS[savedRole] && localStorage.getItem('aarogya_jwt_token')) {
      return DEMO_USERS[savedRole];
    }
    // Return null so users are initially unauthenticated unless previously logged in
    return null;
  });

  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>(getInitialRegisteredUsers);

  // Sync registeredUsers with localStorage
  const updateRegisteredUsers = (updated: UserAccount[]) => {
    setRegisteredUsers(updated);
    saveRegisteredUsers(updated);
  };

  const loginAs = (role: UserRole) => {
    const user = DEMO_USERS[role];
    if (user) {
      setCurrentUser(user);
      localStorage.setItem(STORAGE_ROLE_KEY, role);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    }
  };

  /**
   * Secure Sign-In Gateway with RBAC, Verification Status & Generic Error Handling
   */
  const signIn = async (
    portalRole: UserRole,
    identifier: string,
    password?: string,
  ): Promise<{ success: boolean; error?: string; status?: AccountStatus }> => {
    const cleanId = identifier.trim().toLowerCase();

    if (!cleanId) {
      return { success: false, error: 'Please enter your registered mobile number or ID.' };
    }
    if (!password || !password.trim()) {
      return { success: false, error: 'Please enter your password.' };
    }

    // Attempt backend API verification first if accessible
    try {
      const resp = await fetch(`${BACKEND_API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanId,
          password: password.trim(),
          requestedRole: portalRole,
        }),
      });

      let data = await resp.json();
      if (resp.ok && data.data?.requiresMfa) {
        const totpCode = window.prompt('Enter your six-digit verification code. Local synthetic demo: 123456');
        if (!totpCode) return { success: false, error: 'Verification cancelled.' };
        const verification = await fetch(BACKEND_API_BASE + '/auth/mfa/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mfaSessionToken: data.data.mfaSessionToken, totpCode }) });
        data = await verification.json();
        if (!verification.ok) return { success: false, error: 'Verification failed.' };
      }
      if (resp.ok && data.success && data.data?.user && data.data?.accessToken) {
        const u = data.data.user;
        const loggedUser: UserAccount = {
          id: u.id,
          username: u.username,
          name: u.fullName,
          nameTe: u.nameTe || u.fullName,
          role: portalRole,
          roleTitle: u.roleTitle,
          roleTitleTe: u.roleTitleTe,
          facility: u.facilityName || 'ASR Health Facility',
          district: u.district,
          assignedVillages: u.assignedVillages || [],
          phone: u.phone,
          email: u.email,
          accountStatus: u.accountStatus || 'APPROVED',
          registrationNumber: u.apmcRegNumber,
          employeeId: u.professionalIdNumber,
        };

        if (data.data.accessToken) {
          localStorage.setItem('aarogya_jwt_token', data.data.accessToken);
        }

        setCurrentUser(loggedUser);
        localStorage.setItem(STORAGE_ROLE_KEY, portalRole);
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(loggedUser));
        return { success: true };
      } else {
        // Explicit unauthorized role or pending/rejected status returned by backend
        return {
          success: false,
          error: authErrorMessage(data, resp.status),
        };
      }
    } catch {
      return { success: false, error: 'Cannot reach the server. Please retry when connected.' };
    }
  };

  /**
   * New User Registration (Saves with PENDING_VERIFICATION status)
   */
  const registerUser = async (
    userData: Partial<UserAccount> & { role: UserRole; name: string },
  ): Promise<{ success: boolean; user?: UserAccount; error?: string }> => {
    try {
      const response = await fetch(BACKEND_API_BASE + '/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portalRole: userData.role, fullName: userData.name, nameTe: userData.nameTe,
          mobileNumber: userData.phone, email: userData.email, password: userData.password, confirmPassword: userData.password,
          doctorId: userData.doctorId, medicalQualification: userData.qualification, specialization: userData.specialization,
          apmcRegNumber: userData.registrationNumber, ashaId: userData.ashaId, anmId: userData.anmId,
          assignedVillage: userData.assignedVillages?.[0], assignedHealthCentre: userData.subCentre || userData.facility,
          mandal: userData.mandal, district: userData.district }),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, error: data.error?.message || data.message || 'Registration failed' };
      return { success: true };
    } catch { return { success: false, error: 'Server unavailable. Registration has not been submitted.' }; }
  };

  /**
   * Password Reset Request
   */
  const requestPasswordReset = async (
    identifier: string,
    portal?: UserRole,
  ): Promise<{ success: boolean; message: string; resetToken?: string }> => {
    try {
      const resp = await fetch(`${BACKEND_API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, portal }),
      });
      if (resp.ok) {
        const data = await resp.json();
        return {
          success: true,
          message: data.message || 'Password recovery instructions have been dispatched to your mobile number.',
          resetToken: data.data?.resetToken,
        };
      }
    } catch {
      // offline
    }

    return {
      success: false,
      message: 'Password recovery could not reach the server. Please retry.',
    };
  };

  /**
   * Password Reset Confirmation
   */
  const resetPassword = async (
    token: string,
    newPass: string,
    confirmPass: string,
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    if (newPass !== confirmPass) {
      return { success: false, error: 'Password confirmation does not match.' };
    }
    if (newPass.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    try {
      const resp = await fetch(`${BACKEND_API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: newPass, confirmPassword: confirmPass }),
      });
      if (resp.ok) {
        return { success: true, message: 'Password has been successfully updated.' };
      }
    } catch {
      // offline
    }

    return { success: false, error: 'Password change was not confirmed by the server. Please retry.' };
  };

  /**
   * Administrator Approval Actions
   */
  const approveUser = (userId: string) => {
    const updated = registeredUsers.map((u) =>
      u.id === userId
        ? { ...u, accountStatus: 'APPROVED' as AccountStatus, approvedAt: new Date().toISOString() }
        : u,
    );
    updateRegisteredUsers(updated);
  };

  const rejectUser = (userId: string, reason?: string) => {
    const updated = registeredUsers.map((u) =>
      u.id === userId
        ? { ...u, accountStatus: 'REJECTED' as AccountStatus, rejectionReason: reason || 'Credentials could not be verified' }
        : u,
    );
    updateRegisteredUsers(updated);
  };

  const suspendUser = (userId: string) => {
    const updated = registeredUsers.map((u) =>
      u.id === userId ? { ...u, accountStatus: 'SUSPENDED' as AccountStatus } : u,
    );
    updateRegisteredUsers(updated);
  };

  const getRegisteredUsersList = (): UserAccount[] => {
    return registeredUsers;
  };

  const logout = () => {
    const token = localStorage.getItem('aarogya_jwt_token');
    if (token) void fetch(`${BACKEND_API_BASE}/auth/logout`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: '{}' }).catch(() => {});
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_ROLE_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    localStorage.removeItem('aarogya_jwt_token');
  };

  const switchPersona = (role: UserRole) => {
    loginAs(role);
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_ROLE_KEY, currentUser.role);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_ROLE_KEY);
      localStorage.removeItem(STORAGE_USER_KEY);
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser ? currentUser.role : null,
        isAuthenticated: !!currentUser,
        loginAs,
        signIn,
        registerUser,
        requestPasswordReset,
        resetPassword,
        approveUser,
        rejectUser,
        suspendUser,
        getRegisteredUsersList,
        logout,
        switchPersona,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
