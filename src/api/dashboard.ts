import http, { unwrap } from './http';
import type { PriceComparisonDto, PriceComparisonParams, PriceHistoryDto, PriceHistoryParams } from '@/types/api';

/** GET /api/dashboard/price-comparison — 아직 껍데기 API */
export function getPriceComparison(params: PriceComparisonParams) {
  return unwrap<PriceComparisonDto>(http.get('/api/dashboard/price-comparison', { params }));
}

/** GET /api/dashboard/price-history — 사이트별 가격 추이 */
export function getPriceHistory(params: PriceHistoryParams) {
  return unwrap<PriceHistoryDto>(http.get('/api/dashboard/price-history', { params }));
}
