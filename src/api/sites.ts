import http, { unwrap } from './http';
import type { SiteDto } from '@/types/api';

/** GET /api/sites */
export function getSites() {
  return unwrap<SiteDto[]>(http.get('/api/sites'));
}
