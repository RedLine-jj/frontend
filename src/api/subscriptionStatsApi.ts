import http, { unwrap } from './http';

export interface TopSubscription {
  modelId: number;
  modelName: string;
  count: number;
}

export const subscriptionStatsApi = {
  /** GET /api/subscriptions/top — 구독 수 TOP 10 모델 */
  getTopSubscriptions: () =>
    unwrap<TopSubscription[]>(http.get('/api/subscriptions/top')),
};
