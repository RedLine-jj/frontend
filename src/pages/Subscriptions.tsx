import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { subscriptionsApi } from '@/api';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BellOff, Eye, Package, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SubscriptionsPage() {
  const { isLoggedIn, isInitialized } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (isInitialized && !isLoggedIn) navigate('/login');
  }, [isLoggedIn, isInitialized, navigate]);

  const { data: subs, isLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => subscriptionsApi.getSubscriptions(),
    enabled: isLoggedIn,
  });

  const handleUnsubscribe = async (id: number) => {
    try {
      await subscriptionsApi.unsubscribe(id);
      toast({ title: '구독 해제됨' });
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['top-subscriptions'] });
    } catch {
      toast({ title: '오류 발생', variant: 'destructive' });
    }
  };

  const items = subs?.content ?? [];

  return (
    <div className="min-h-screen bg-background bg-noise">
      <Header />
      <div className="border-b border-border bg-grid">
        <div className="container py-8">
          <h1 className="text-2xl font-bold font-display text-foreground">내 구독</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">관심 상품의 재입고 알림을 관리하세요.</p>
        </div>
      </div>
      <main className="container py-6 space-y-4 relative z-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-2">
            {items.map((sub, i) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card rounded-xl flex items-center gap-4 p-4"
              >
                {sub.imageUrl && (
                  <img src={sub.imageUrl} alt="" className="h-14 w-14 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-primary">{sub.brandName}</p>
                  <p className="truncate font-semibold font-display text-sm text-foreground">{sub.modelName}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => navigate(`/model/${sub.modelId}`)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleUnsubscribe(sub.id)}>
                    <BellOff className="h-4 w-4" />
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
            <Package className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="font-display font-semibold text-foreground">구독한 상품이 없습니다</p>
            <p className="text-sm mt-1">관심 있는 데님을 구독해보세요.</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/')}>
              상품 둘러보기
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
