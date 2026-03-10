import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { authApi } from '@/api';
import { tokenStore } from '@/api/http';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isInitialized: boolean;
  login: (userId: string, password: string) => Promise<void>;
  signup: (userId: string, password: string, userName: string) => Promise<string>;
  logout: () => void;
}

const USER_KEY = 'redline_user';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // 새로고침 시: refreshToken이 있으면 accessToken 재발급 시도
  useEffect(() => {
    const restore = async () => {
      const refreshToken = tokenStore.getRefresh();
      if (!user || !refreshToken) {
        // refreshToken 없으면 유저 정보도 정리
        if (!refreshToken && user) {
          setUser(null);
          localStorage.removeItem(USER_KEY);
        }
        setIsInitialized(true);
        return;
      }
      try {
        // 인터셉터의 refresh 로직과 동일한 엔드포인트
        const { default: axios } = await import('axios');
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          { refreshToken },
        );
        if (data.success && data.data) {
          tokenStore.set(data.data.accessToken, data.data.refreshToken);
        } else {
          throw new Error();
        }
      } catch {
        // refresh 실패 → 로그아웃 상태
        setUser(null);
        tokenStore.clear();
        localStorage.removeItem(USER_KEY);
      } finally {
        setIsInitialized(true);
      }
    };
    restore();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isInitialized, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
