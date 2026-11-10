import { createContext } from 'react';
import type { UserAccount, UserRole, AccountStatus } from '../types';

export interface AuthContextType {
  loading?: boolean;
  currentUser: UserAccount | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  loginAs: (role: UserRole) => void;
  signIn: (
    role: UserRole,
    identifier: string,
    password?: string,
    remember?: boolean,
  ) => Promise<{ success: boolean; error?: string; role?: UserRole; status?: AccountStatus }>;
  registerUser: (
    userData: Partial<UserAccount> & { role: UserRole; name: string },
  ) => Promise<{ success: boolean; user?: UserAccount; error?: string }>;
  requestPasswordReset: (
    identifier: string,
    portal?: UserRole,
  ) => Promise<{ success: boolean; message: string; resetToken?: string }>;
  resetPassword: (
    token: string,
    newPass: string,
    confirmPass: string,
    mfaCode?: string,
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  changePassword: (
    currentPass: string,
    newPass: string,
    confirmPass: string,
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  approveUser: (userId: string) => void;
  rejectUser: (userId: string, reason?: string) => void;
  suspendUser: (userId: string) => void;
  getRegisteredUsersList: () => UserAccount[];
  logout: () => void;
  switchPersona: (role: UserRole) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
