import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { modelsApi, brandsApi } from '@/api';
import { useCursorPagination } from '@/hooks/useCursorPagination';
import Header from '@/components/Header';
import SummaryCards from '@/components/SummaryCards';
import SearchFilter from '@/components/SearchFilter';
import ModelCard from '@/components/ModelCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [brandId, setBrandId] = useState<number | undefined>(undefined);
  const queryClient = useQueryClient();

  // 브랜드 목록 (필터용)
  const { data: brands } = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandsApi.getBrands(),
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
  const totalModels = allModels.length;

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['models'] });
    queryClient.invalidateQueries({ queryKey: ['brands'] });
  }, [queryClient]);

  const handleBrandChange = useCallback((id: number | undefined) => {
    setBrandId(id);
  }, []);

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
          totalModels={totalModels}
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
              {allModels.map((model, i) => (
                <ModelCard key={model.id} model={model} index={i} />
              ))}
              {allModels.length === 0 && (
                <div className="col-span-full py-16 text-center text-muted-foreground text-sm">
                  검색 결과가 없습니다.
                </div>
              )}
            </div>

            {hasNextPage && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="text-xs"
                >
                  {isFetchingNextPage ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : null}
                  더 보기
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
