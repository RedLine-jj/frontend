import { useEffect, useRef, useCallback } from 'react';
import { tokenStore } from '@/api/http';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import type { RestockSseEvent } from '@/types/api';

const SSE_URL = `${import.meta.env.VITE_API_URL}/api/notifications/stream`;
const RECONNECT_DELAY = 5_000;

export function useNotificationStream() {
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const abortRef = useRef<AbortController | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>();

  const connect = useCallback(() => {
    const token = tokenStore.getAccess();
    if (!token) return;

    const controller = new AbortController();
    abortRef.current = controller;

    fetch(SSE_URL, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok || !response.body) return;

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let eventName = '';
        let eventData = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (line.startsWith('event:')) {
              eventName = line.slice(6).trim();
            } else if (line.startsWith('data:')) {
              eventData = line.slice(5).trim();
            } else if (line === '' && eventName && eventData) {
              if (eventName === 'restock') {
                try {
                  const event: RestockSseEvent = JSON.parse(eventData);
                  toast({
                    title: '재입고 알림',
                    description: `${event.brandName} ${event.modelName} 재입고`,
                  });
                  queryClient.invalidateQueries({ queryKey: ['notifications'] });
                  queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
                } catch {}
              }
              eventName = '';
              eventData = '';
            }
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isLoggedIn) {
          reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY);
        }
      });
  }, [isLoggedIn, toast, queryClient]);

  useEffect(() => {
    if (!isLoggedIn) {
      abortRef.current?.abort();
      clearTimeout(reconnectTimer.current);
      return;
    }

    connect();

    return () => {
      abortRef.current?.abort();
      clearTimeout(reconnectTimer.current);
    };
  }, [isLoggedIn, connect]);
}
