import { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { modelsApi, brandsApi } from '@/api';
import { useCursorPagination } from '@/hooks/useCursorPagination';
import Header from '@/components/Header';
import SummaryCards from '@/components/SummaryCards';
import SearchFilter from '@/components/SearchFilter';
import ModelCard from '@/components/ModelCard';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [brandId, setBrandId] = useState<number | undefined>(undefined);
  const queryClient = useQueryClient();

  // 브랜드 목록 (필터용)
  const { data: brands } = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandsApi.getBrands(),
  });

  // 전체 모델 수
  const { data: modelCount } = useQuery({
    queryKey: ['models', 'count'],
    queryFn: () => modelsApi.getModelCount(),
  });

  // 모델 목록 (커서 페이징)
  const {
    data: modelsData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCursorPagination(
    ['models', brandId],
    (cursor) => modelsApi.getModels({ brandId, cursor, size: 20 }),
  );

  const allModels = modelsData?.pages.flatMap(p => p.content) ?? [];

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['models'] });
    queryClient.invalidateQueries({ queryKey: ['brands'] });
  }, [queryClient]);

  const handleBrandChange = useCallback((id: number | undefined) => {
    setBrandId(id);
  }, []);

  // 무한 스크롤: sentinel 요소가 뷰포트에 들어오면 다음 페이지 로드
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="min-h-screen bg-background bg-noise">
      <Header onRefresh={handleRefresh} />

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
          totalModels={modelCount ?? 0}
          totalBrands={brands?.length ?? 0}
        />
        <SearchFilter
          brands={brands ?? []}
          selectedBrandId={brandId}
          onBrandChange={handleBrandChange}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="glass-card rounded-xl p-8 text-center">
            <p className="text-destructive font-medium text-sm">데이터를 불러올 수 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {allModels.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
              {allModels.length === 0 && (
                <div className="col-span-full py-16 text-center text-muted-foreground text-sm">
                  검색 결과가 없습니다.
                </div>
              )}
            </div>

            {/* 무한 스크롤 트리거 */}
            <div ref={sentinelRef} className="flex justify-center py-4">
              {isFetchingNextPage && (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
