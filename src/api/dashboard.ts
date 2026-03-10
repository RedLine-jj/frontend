import http, { unwrap } from './http';
import type { PriceComparisonDto, PriceComparisonParams } from '@/types/api';

/** GET /api/dashboard/price-comparison — 아직 껍데기 API */
export function getPriceComparison(params: PriceComparisonParams) {
  return unwrap<PriceComparisonDto>(http.get('/api/dashboard/price-comparison', { params }));
}
