import http, { unwrap } from './http';
import type {
  CursorPage,
  CursorParams,
  SiteOptionDto,
  SiteOptionDetailDto,
  SiteOptionLogDto,
  SiteOptionsParams,
} from '@/types/api';

/** GET /api/site-options — 커서 페이징 */
export function getSiteOptions(params?: SiteOptionsParams) {
  return unwrap<CursorPage<SiteOptionDto>>(http.get('/api/site-options', { params }));
}

/** GET /api/site-options/:id */
export function getSiteOption(id: number) {
  return unwrap<SiteOptionDetailDto>(http.get(`/api/site-options/${id}`));
}

/** GET /api/site-options/:id/logs — 커서 페이징 */
export function getSiteOptionLogs(id: number, params?: CursorParams) {
  return unwrap<CursorPage<SiteOptionLogDto>>(http.get(`/api/site-options/${id}/logs`, { params }));
}
