import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import Header from '@/components/Header';
import SummaryCards from '@/components/SummaryCards';
import SearchFilter from '@/components/SearchFilter';
import ProductCard from '@/components/ProductCard';
import EventsToast from '@/components/EventsToast';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');
  const queryClient = useQueryClient();
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', query, filter],
    queryFn: () => api.getProducts({ query, filter }),
  });

  const { data: subs } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => api.getSubscriptions(),
    enabled: isLoggedIn,
  });

  const subscribedKeys = new Set(subs?.map(s => s.productKey) ?? []);

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  }, [queryClient]);

  const handleToggleSubscribe = useCallback(async (productKey: string) => {
    try {
      if (subscribedKeys.has(productKey)) {
        await api.unsubscribe(productKey);
        toast({ title: '구독 해제됨' });
      } else {
        await api.subscribe({ productKey, mode: 'ALL_OPTIONS', selectedOptionIds: [] });
        toast({ title: '구독 완료' });
      }
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    } catch {
      toast({ title: '오류 발생', variant: 'destructive' });
    }
  }, [subscribedKeys, queryClient, toast]);

  const totalSoldOut = data?.items.reduce((sum, p) => sum + p.optionsSummary.soldOutCount, 0) ?? 0;

  return (
    <div className="min-h-screen bg-background bg-noise">
      <Header onRefresh={handleRefresh} />
      <EventsToast />

      {/* Hero */}
      <div className="border-b border-border bg-grid">
        <div className="container py-8">
          <h1 className="text-2xl font-bold font-display text-foreground sm:text-3xl">
            재입고 레이더
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-md">
            데님 상품의 재고를 실시간으로 추적하고, 재입고 알림을 받아보세요.
          </p>
        </div>
      </div>

      <main className="container py-6 space-y-6 relative z-10">
        <SummaryCards
          totalProducts={data?.total ?? 0}
          soldOutOptions={totalSoldOut}
          updatedAt={data?.updatedAt ?? ''}
        />
        <SearchFilter query={query} filter={filter} onQueryChange={setQuery} onFilterChange={setFilter} />

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="glass-card rounded-xl p-8 text-center">
            <p className="text-destructive font-medium text-sm">데이터를 불러올 수 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {data?.items.map((product, i) => (
              <ProductCard
                key={product.productKey}
                product={product}
                isSubscribed={subscribedKeys.has(product.productKey)}
                onToggleSubscribe={handleToggleSubscribe}
                index={i}
              />
            ))}
            {data?.items.length === 0 && (
              <div className="col-span-full py-16 text-center text-muted-foreground text-sm">
                검색 결과가 없습니다.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
