import axios from 'axios';
import type { ApiResponse } from '@/types/api';

// ── Axios 인스턴스 ──

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

// ── 토큰 관리 (AuthContext 밖에서도 접근 가능하도록) ──

const TOKEN_KEY = 'redline_access_token';
const REFRESH_KEY = 'redline_refresh_token';

export const tokenStore = {
  getAccess: () => localStorage.getItem(TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set(access: string, refresh: string) {
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

// ── Request Interceptor: Bearer 토큰 자동 주입 ──

http.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response Interceptor: 응답 언래핑 + 401 처리 ──

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401이고 refresh 시도 안 한 요청이면 토큰 갱신 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = tokenStore.getRefresh();

      // refresh 토큰 없으면 로그아웃
      if (!refreshToken) {
        tokenStore.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // 이미 갱신 중이면 큐에 넣고 대기
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(http(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // refresh 엔드포인트 호출 (추후 API 확인 필요)
        const { data } = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          { refreshToken },
        );

        if (data.success && data.data) {
          tokenStore.set(data.data.accessToken, data.data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;

          // 대기 중이던 요청들 재실행
          refreshQueue.forEach((cb) => cb(data.data.accessToken));
          refreshQueue = [];

          return http(originalRequest);
        }
      } catch {
        // refresh 실패 → 로그아웃
        tokenStore.clear();
        window.location.href = '/login';
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// ── 헬퍼: API 응답에서 data만 추출 ──

/** ApiResponse 래퍼를 벗기고 data만 반환. success=false면 throw */
export async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const { data: res } = await promise;
  if (!res.success) {
    throw new Error(res.message ?? '요청에 실패했습니다.');
  }
  return res.data;
}

export default http;
