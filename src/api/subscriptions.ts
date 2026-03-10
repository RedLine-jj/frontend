import http, { unwrap } from './http';
import type { CursorPage, CursorParams, SubscriptionDto, SubscribeRequest } from '@/types/api';

/** GET /api/subscriptions — JWT 필수, 커서 페이징 */
export function getSubscriptions(params?: CursorParams) {
  return unwrap<CursorPage<SubscriptionDto>>(http.get('/api/subscriptions', { params }));
}

/** POST /api/subscriptions — JWT 필수 */
export function subscribe(body: SubscribeRequest) {
  return unwrap<null>(http.post('/api/subscriptions', body));
}

/** DELETE /api/subscriptions/:id — JWT 필수 */
export function unsubscribe(id: number) {
  return unwrap<null>(http.delete(`/api/subscriptions/${id}`));
}
