import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '@/api/client';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { BellOff, Eye, Package } from 'lucide-react';
import { useEffect } from 'react';

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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        <h1 className="text-2xl font-bold">내 구독</h1>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
          </div>
        ) : subs && subs.length > 0 ? (
          <div className="space-y-3">
            {subs.map(sub => (
              <Card key={sub.productKey} className="animate-fade-in">
                <CardContent className="flex items-center gap-4 p-4">
                  {sub.productImage && (
                    <img src={sub.productImage} alt="" className="h-16 w-16 rounded-md object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{sub.brand}</p>
                    <p className="truncate font-semibold text-sm">{sub.productName}</p>
                    <div className="mt-1 flex gap-1.5">
                      <Badge variant="outline" className="text-xs">
                        {sub.mode === 'ALL_OPTIONS' ? '전체 옵션' : `선택 ${sub.selectedOptionIds.length}개`}
                      </Badge>
                      {sub.optionsSummary && (
                        <>
                          {sub.optionsSummary.availableCount > 0 && (
                            <Badge variant="outline" className="status-available text-xs">재고 {sub.optionsSummary.availableCount}</Badge>
                          )}
                          {sub.optionsSummary.soldOutCount > 0 && (
                            <Badge variant="outline" className="status-soldout text-xs">품절 {sub.optionsSummary.soldOutCount}</Badge>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/product/${sub.productKey}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleUnsubscribe(sub.productKey)}>
                      <BellOff className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-16 text-muted-foreground">
            <Package className="mb-3 h-12 w-12" />
            <p>구독한 상품이 없습니다.</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate('/')}>
              상품 둘러보기
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
