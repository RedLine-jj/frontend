import http, { unwrap } from './http';

export interface RecentRestock {
  modelId: number;
  modelName: string;
  siteName: string;
  restockedAt: string;
}

export const restocksApi = {
  /** GET /api/restocks/recent — 최근 재입고 목록 (최대 10개) */
  getRecentRestocks: () =>
    unwrap<RecentRestock[]>(http.get('/api/restocks/recent')),
};
