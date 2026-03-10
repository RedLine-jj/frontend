import http, { unwrap } from './http';
import type { BrandDto } from '@/types/api';

/** GET /api/brands */
export function getBrands() {
  return unwrap<BrandDto[]>(http.get('/api/brands'));
}
