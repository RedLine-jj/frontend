import http, { unwrap } from './http';
import type { NotificationDto } from '@/types/api';

export function getNotifications() {
  return unwrap<NotificationDto[]>(http.get('/api/notifications'));
}

export function getUnreadCount() {
  return unwrap<number>(http.get('/api/notifications/unread-count'));
}

export function markAsRead(id: number) {
  return unwrap<null>(http.patch(`/api/notifications/${id}/read`));
}

export function markAllAsRead() {
  return unwrap<null>(http.patch('/api/notifications/read-all'));
}
