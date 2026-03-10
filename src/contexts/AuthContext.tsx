import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User } from '@/types';
import { authApi } from '@/api';
import { tokenStore } from '@/api/http';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (userId: string, password: string) => Promise<void>;
  signup: (userId: string, password: string, userName: string) => Promise<string>;
  logout: () => void;
}

const USER_KEY = 'redline_user';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    // 토큰이 없으면 저장된 유저 정보도 무효
    if (!stored || !tokenStore.getAccess()) return null;
    return JSON.parse(stored);
  });

  const login = useCallback(async (userId: string, password: string) => {
    const res = await authApi.login({ userId, password });
    tokenStore.set(res.accessToken, res.refreshToken);
    const u: User = { userId };
    setUser(u);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  }, []);

  /** 회원가입 — 자동 로그인 안 됨. 성공 메시지 반환 */
  const signup = useCallback(async (userId: string, password: string, userName: string): Promise<string> => {
    await authApi.signup({ userId, password, userName });
    return '회원가입이 완료되었습니다. 로그인해주세요.';
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    tokenStore.clear();
    localStorage.removeItem(USER_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
