/**
 * Contexte d'authentification global.
 * - Stocke le user courant + token dans localStorage.
 * - Expose login(), register(), logout(), et le rôle normalisé.
 */
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import * as authApi from '../api/auth';
import { AuthRequest, AuthResponse, RegisterRequest, Role, normalizeRole } from '../types';

interface AuthContextValue {
  user: AuthResponse | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (req: AuthRequest) => Promise<void>;
  register: (req: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_USER = 'assigame_user';
const STORAGE_TOKEN = 'assigame_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null);

  // Au montage : on relit la session depuis localStorage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_USER);
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        // Ignorer les sessions corrompues
      }
    }
  }, []);

  const persist = (u: AuthResponse) => {
    localStorage.setItem(STORAGE_TOKEN, u.token);
    localStorage.setItem(STORAGE_USER, JSON.stringify(u));
    setUser(u);
  };

  const login = async (req: AuthRequest) => {
    const res = await authApi.login(req);
    persist(res);
  };

  const register = async (req: RegisterRequest) => {
    const res = await authApi.register(req);
    persist(res);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_TOKEN);
    localStorage.removeItem(STORAGE_USER);
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role: normalizeRole(user?.typeUtilisateur),
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé à l\'intérieur de <AuthProvider>');
  return ctx;
}
