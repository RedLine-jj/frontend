import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { notificationsApi } from '@/api';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BellOff, Eye, CheckCheck, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { NotificationDto } from '@/types/api';

export default function NotificationsPage() {
  const { isLoggedIn, isInitialized } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (isInitialized && !isLoggedIn) navigate('/login');
  }, [isLoggedIn, isInitialized, navigate]);

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.getNotifications,
    enabled: isLoggedIn,
  });

  const handleMarkAsRead = async (item: NotificationDto) => {
    if (item.readYn) return;
    try {
      await notificationsApi.markAsRead(item.id);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    } catch {
      toast({ title: '오류 발생', variant: 'destructive' });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
      toast({ title: '모두 읽음 처리됨' });
    } catch {
      toast({ title: '오류 발생', variant: 'destructive' });
    }
  };

  const unreadExists = notifications.some((n) => !n.readYn);

  return (
    <div className="min-h-screen bg-background bg-noise">
      <Header />
      <div className="border-b border-border bg-grid">
        <div className="container py-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">알림</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">구독한 상품의 재입고 알림을 확인하세요.</p>
          </div>
          {unreadExists && (
            <Button variant="outline" size="sm" className="text-xs" onClick={handleMarkAllAsRead}>
              <CheckCheck className="mr-1 h-3.5 w-3.5" />
              모두 읽음
            </Button>
          )}
        </div>
      </div>
      <main className="container py-6 space-y-4 relative z-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-2">
            {notifications.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`glass-card rounded-xl flex items-center gap-4 p-4 cursor-pointer transition-colors ${
                  item.readYn ? 'opacity-60' : 'border-l-2 border-l-primary'
                }`}
                onClick={() => {
                  handleMarkAsRead(item);
                  navigate(`/model/${item.modelId}`);
                }}
              >
                {item.imageUrl && (
                  <img src={item.imageUrl} alt="" className="h-14 w-14 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-primary">{item.brandName}</p>
                  <p className="truncate font-semibold font-display text-sm text-foreground">{item.modelName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(item.createdAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {!item.readYn && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/model/${item.modelId}`);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center py-20 text-muted-foreground"
          >
            <BellOff className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="font-display font-semibold text-foreground">알림이 없습니다</p>
            <p className="text-sm mt-1">구독한 상품이 재입고되면 알림을 보내드려요.</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/')}>
              상품 둘러보기
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
