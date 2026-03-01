import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import Header from '@/components/Header';
import SummaryCards from '@/components/SummaryCards';
import SearchFilter from '@/components/SearchFilter';
import ProductCard from '@/components/ProductCard';
import EventsToast from '@/components/EventsToast';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
        toast({ title: '구독 완료!' });
      }
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    } catch {
      toast({ title: '오류 발생', variant: 'destructive' });
    }
  }, [subscribedKeys, queryClient, toast]);

  const totalSoldOut = data?.items.reduce((sum, p) => sum + p.optionsSummary.soldOutCount, 0) ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <Header onRefresh={handleRefresh} />
      <EventsToast />
      <main className="container py-6 space-y-6">
        <SummaryCards
          totalProducts={data?.total ?? 0}
          soldOutOptions={totalSoldOut}
          updatedAt={data?.updatedAt ?? ''}
        />
        <SearchFilter query={query} filter={filter} onQueryChange={setQuery} onFilterChange={setFilter} />

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center text-destructive">
            데이터를 불러올 수 없습니다. 다시 시도해주세요.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.items.map(product => (
              <ProductCard
                key={product.productKey}
                product={product}
                isSubscribed={subscribedKeys.has(product.productKey)}
                onToggleSubscribe={handleToggleSubscribe}
              />
            ))}
            {data?.items.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                검색 결과가 없습니다.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
