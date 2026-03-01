import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '@/api/client';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BellOff, Eye, Package, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SubscriptionsPage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoggedIn) navigate('/login');
  }, [isLoggedIn, navigate]);

  const { data: subs, isLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => api.getSubscriptions(),
    enabled: isLoggedIn,
  });

  const handleUnsubscribe = async (productKey: string) => {
    try {
      await api.unsubscribe(productKey);
      toast({ title: '구독 해제됨' });
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    } catch {
      toast({ title: '오류 발생', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background bg-noise">
      <Header />
      <div className="border-b border-border/30 bg-grid">
        <div className="container py-8">
          <h1 className="text-3xl font-bold font-display text-gradient">내 구독</h1>
          <p className="mt-2 text-sm text-muted-foreground">관심 상품의 재입고 알림을 관리하세요.</p>
        </div>
      </div>
      <main className="container py-6 space-y-4 relative z-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : subs && subs.length > 0 ? (
          <div className="space-y-3">
            {subs.map((sub, i) => (
              <motion.div
                key={sub.productKey}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card glow-border rounded-xl flex items-center gap-4 p-4"
              >
                {sub.productImage && (
                  <img src={sub.productImage} alt="" className="h-16 w-16 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-primary">{sub.brand}</p>
                  <p className="truncate font-bold font-display text-sm">{sub.productName}</p>
                  <div className="mt-1.5 flex gap-1.5 flex-wrap">
                    <Badge variant="outline" className="text-[10px] font-semibold border-border/50 text-muted-foreground">
                      {sub.mode === 'ALL_OPTIONS' ? '전체 옵션' : `선택 ${sub.selectedOptionIds.length}개`}
                    </Badge>
                    {sub.optionsSummary && sub.optionsSummary.availableCount > 0 && (
                      <Badge variant="outline" className="status-available text-[10px] font-semibold">재고 {sub.optionsSummary.availableCount}</Badge>
                    )}
                    {sub.optionsSummary && sub.optionsSummary.soldOutCount > 0 && (
                      <Badge variant="outline" className="status-soldout text-[10px] font-semibold">품절 {sub.optionsSummary.soldOutCount}</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <Button size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-secondary" onClick={() => navigate(`/product/${sub.productKey}`)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => handleUnsubscribe(sub.productKey)}>
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
            <Package className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <p className="font-display font-semibold">구독한 상품이 없습니다</p>
            <p className="text-sm mt-1">관심 있는 데님을 구독해보세요.</p>
            <Button variant="outline" size="sm" className="mt-4 border-border/60 hover:bg-secondary" onClick={() => navigate('/')}>
              상품 둘러보기
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
