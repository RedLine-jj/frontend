import { useEffect, useState } from 'react';
import { api } from '@/api/client';
import { RestockEvent } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Bell } from 'lucide-react';

export default function EventsToast() {
  const { toast } = useToast();
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  useEffect(() => {
    const poll = async () => {
      try {
        const events = await api.getEvents(5);
        if (events.length > 0 && events[0].occurredAt !== lastChecked) {
          setLastChecked(events[0].occurredAt);
          // Only show toast on subsequent polls, not on mount
          if (lastChecked) {
            toast({
              title: '재입고 알림',
              description: `${events[0].productName} / ${events[0].displayLabel} 재입고`,
            });
          }
        }
      } catch {
        // silent
      }
    };

    poll();
    const interval = setInterval(poll, 30000);
    return () => clearInterval(interval);
  }, [lastChecked, toast]);

  return null; // renders nothing, just polls
}
