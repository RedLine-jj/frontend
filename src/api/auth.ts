import http, { unwrap } from './http';
import type { LoginRequest, LoginResponse, SignupRequest } from '@/types/api';

/** POST /api/auth/login */
export function login(body: LoginRequest) {
  return unwrap<LoginResponse>(http.post('/api/auth/login', body));
}

/** POST /api/auth/signup — 성공 시 메시지만 반환 (자동 로그인 안 됨) */
export function signup(body: SignupRequest) {
  return unwrap<null>(http.post('/api/auth/signup', body));
}
