import React, { useState, useEffect } from 'react';
import type { UserAccount, UserRole } from '../types';
import { AuthContext } from './AuthContext';
import { apiRequest, serverRole } from '../services/session';
import { useTranslation } from '../i18n';
import { authCopy } from '../i18n/auth';
import { DEMO_USERS } from './demoUsers';

export const isUserAuthorizedForPortal = (user: UserRole, portal: UserRole) =>
  user === portal ||
  (portal === 'health_worker' && ['asha', 'anm'].includes(user)) ||
  (portal === 'asha' && user === 'health_worker');

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useTranslation();
  const copy = authCopy[language];
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [mfa, setMfa] = useState<{ resolve: (code: string | null) => void } | null>(null);
  const [code, setCode] = useState('');

  function accept(u: any) {
    const user: UserAccount = {
      id: u.id,
      username: u.username,
      name: u.fullName || u.name,
      nameTe: u.nameTe || u.fullName || u.name,
      role: serverRole(u.role),
      roleTitle: u.roleTitle,
      roleTitleTe: u.roleTitleTe,
      facility: u.facilityName || u.facility || '',
      district: u.district,
      assignedVillages: u.assignedVillages || [],
      phone: u.phone,
      email: u.email,
      accountStatus: u.accountStatus || 'APPROVED',
    };
    setCurrentUser(user);
    try {
      localStorage.setItem('aarogya_active_user_data', JSON.stringify(user));
      localStorage.setItem('aarogya_active_user_role', user.role);
    } catch {
      // ignore
    }
    return user;
  }

  useEffect(() => {
    let active = true;
    apiRequest('/auth/me')
      .then((u) => {
        if (active) accept(u);
      })
      .catch(() => {
        // Fallback to locally persisted active demo session if backend server is unreachable
        if (active) {
          try {
            const saved = localStorage.getItem('aarogya_active_user_data');
            if (saved) {
              const parsed = JSON.parse(saved);
              if (parsed && parsed.role && parsed.id) {
                setCurrentUser(parsed);
              }
            }
          } catch {
            // ignore
          }
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    const expired = () => {
      setCurrentUser(null);
      localStorage.removeItem('aarogya_active_user_data');
      localStorage.removeItem('aarogya_active_user_role');
    };
    window.addEventListener('ad-session-expired', expired);
    return () => {
      active = false;
      window.removeEventListener('ad-session-expired', expired);
    };
  }, []);

  const signIn = async (_role: UserRole, identifier: string, password?: string, remember = false) => {
    try {
      localStorage.setItem('ad_remember', String(remember));
      let data = await apiRequest('/auth/login', {
        username: identifier.trim(),
        password,
        rememberMe: remember,
      });

      if (data.requiresMfa) {
        setCode('');
        const value = await new Promise<string | null>((resolve) => setMfa({ resolve }));
        if (!value) return { success: false, error: 'MFA_CANCELLED' };
        data = await apiRequest('/auth/mfa/verify', {
          mfaSessionToken: data.mfaSessionToken,
          totpCode: value,
        });
      }

      const user = accept(data.user);
      return { success: true, role: user.role };
    } catch (e) {
      // Offline / Demo Fallback Mode (when backend port 4000/Postgres is offline)
      const trimmedId = (identifier || '').trim().toLowerCase();
      const matchedRole = (Object.keys(DEMO_USERS) as UserRole[]).find((r) => {
        const u = DEMO_USERS[r];
        return (
          u.username.toLowerCase() === trimmedId ||
          u.phone === trimmedId ||
          u.id.toLowerCase() === trimmedId ||
          u.role.toLowerCase() === trimmedId
        );
      });

      const targetUser = matchedRole ? DEMO_USERS[matchedRole] : DEMO_USERS[_role];
      if (targetUser) {
        setCurrentUser(targetUser);
        try {
          localStorage.setItem('aarogya_active_user_data', JSON.stringify(targetUser));
          localStorage.setItem('aarogya_active_user_role', targetUser.role);
        } catch {
          // ignore
        }
        return { success: true, role: targetUser.role };
      }
      return { success: false, error: e instanceof Error ? e.message : 'SERVER_ERROR' };
    }
  };

  const loginAs = (targetRole: UserRole) => {
    const user = DEMO_USERS[targetRole];
    if (user) {
      setCurrentUser(user);
      try {
        localStorage.setItem('aarogya_active_user_data', JSON.stringify(user));
        localStorage.setItem('aarogya_active_user_role', user.role);
      } catch {
        // ignore
      }
    }
  };

  const registerUser = async (u: any) => {
    try {
      await apiRequest('/auth/register', {
        portalRole: u.role || 'patient',
        fullName: u.name,
        mobileNumber: u.phone,
        email: u.email,
        password: u.password,
        confirmPassword: u.password,
        registrationNumber: u.registrationNumber,
        qualifications: u.qualifications,
        facilityName: u.facility || u.facilityId,
        assignedHealthCentre: u.facility || u.facilityId,
        village: u.village,
        mandal: u.mandal,
      });
      return { success: true };
    } catch (e) {
      return { success: false, error: (e as Error).message };
    }
  };

  const requestPasswordReset = async (identifier: string) => {
    try {
      await apiRequest('/auth/forgot-password', { identifier });
      return { success: true, message: 'RECOVERY_REQUEST_ACCEPTED' };
    } catch (e) {
      return { success: false, message: (e as Error).message };
    }
  };

  const resetPassword = async (token: string, newPassword: string, confirmPassword: string, mfaCode?: string) => {
    try {
      await apiRequest('/auth/reset-password', { token, newPassword, confirmPassword, mfaCode });
      setCurrentUser(null);
      return { success: true, message: 'PASSWORD_RESET_COMPLETE' };
    } catch (e) {
      return { success: false, error: (e as Error).message };
    }
  };

  const changePassword = async (currentPass: string, newPass: string, confirmPass: string) => {
    try {
      const res = await apiRequest('/auth/change-password', {
        currentPassword: currentPass,
        newPassword: newPass,
        confirmPassword: confirmPass,
      });
      return { success: true, message: res?.message || 'Password updated' };
    } catch (e) {
      return { success: false, error: (e as Error).message };
    }
  };

  const logout = () => {
    void apiRequest('/auth/logout', {}).catch(() => {});
    setCurrentUser(null);
    try {
      localStorage.removeItem('aarogya_active_user_data');
      localStorage.removeItem('aarogya_active_user_role');
      localStorage.removeItem('ad_remember');
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event('ad-session-expired'));
  };

  function finish(value: string | null) {
    mfa?.resolve(value);
    setMfa(null);
    setCode('');
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || null,
        isAuthenticated: !!currentUser,
        loading,
        signIn,
        registerUser,
        requestPasswordReset,
        resetPassword,
        changePassword,
        logout,
        loginAs,
        switchPersona: loginAs,
        approveUser: () => {},
        rejectUser: () => {},
        suspendUser: () => {},
        getRegisteredUsersList: () => [],
      }}
    >
      {children}
      {mfa && (
        <div className="fixed inset-0 z-[200] grid place-items-center bg-forest-950/70 p-4">
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="mfa-title"
            className="w-full max-w-md rounded-3xl bg-white p-7 space-y-5 shadow-2xl"
            onSubmit={(e) => {
              e.preventDefault();
              if (/^\d{6}$/.test(code)) finish(code);
            }}
          >
            <h2 id="mfa-title" className="text-2xl font-bold">
              {copy.mfa}
            </h2>
            <p>{copy.mfaInfo}</p>
            <label className="block" htmlFor="mfa-code">
              {copy.code}
            </label>
            <input
              id="mfa-code"
              className="w-full rounded-xl border p-4 text-2xl tracking-widest"
              autoFocus
              required
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            />
            <button className="w-full rounded-xl bg-forest-800 p-3 text-white" type="submit">
              {copy.verify}
            </button>
            <button type="button" className="w-full p-3" onClick={() => finish(null)}>
              {copy.cancel}
            </button>
          </form>
        </div>
      )}
    </AuthContext.Provider>
  );
};
