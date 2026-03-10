import http, { unwrap } from './http';
import type { CursorPage, CursorParams, SubscriptionDto, SubscribeRequest } from '@/types/api';

/** GET /api/subscriptions — JWT 필수, 커서 페이징 */
export function getSubscriptions(params?: CursorParams) {
  return unwrap<CursorPage<SubscriptionDto>>(http.get('/api/subscriptions', { params }));
}

/**
 * GET /api/subscriptions/count — JWT 필수
 * @description 사용자의 총 구독 수를 반환합니다.
 * @note 백엔드에 해당 API 엔드포인트 구현이 필요합니다.
 */
export function getSubscriptionCount() {
  return unwrap<number>(http.get('/api/subscriptions/count'));
}

/** POST /api/subscriptions — JWT 필수 */
export function subscribe(body: SubscribeRequest) {
  return unwrap<null>(http.post('/api/subscriptions', body));
}

/** DELETE /api/subscriptions/:id — JWT 필수 */
export function unsubscribe(id: number) {
  return unwrap<null>(http.delete(`/api/subscriptions/${id}`));
}
