import { useState, useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { modelsApi, brandsApi } from "@/api";
import { useCursorPagination } from "@/hooks/useCursorPagination";
import Header from "@/components/Header";
import SummaryCards from "@/components/SummaryCards";
import SearchFilter from "@/components/SearchFilter";
import ModelGrid from "@/components/ModelGrid";

export default function Dashboard() {
  const [brandIds, setBrandIds] = useState<number[]>([]);
  const queryClient = useQueryClient();

  // 브랜드 목록 (필터용)
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: () => brandsApi.getBrands(),
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });

  // 전체 모델 수
  const { data: modelCount } = useQuery({
    queryKey: ["models", "count"],
    queryFn: () => modelsApi.getModelCount(),
    staleTime: 1000 * 60, // 1분간 캐시 유지
  });

  // 안정적인 쿼리 키를 위해 ID를 정렬하고 문자열로 변환
  const brandQueryKey = useMemo(() => brandIds.sort().join(","), [brandIds]);

  // 모델 목록 (커서 페이징)
  const {
    data: modelsData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCursorPagination(["models", brandQueryKey], (cursor) =>
    modelsApi.getModels({ brandIds, cursor, size: 20 }),
  );

  // useMemo를 사용해 페이지 데이터가 변경될 때만 allModels 배열을 새로 계산
  const allModels = useMemo(
    () => modelsData?.pages.flatMap((p) => p.content) ?? [],
    [modelsData],
  );

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["models"] });
    queryClient.invalidateQueries({ queryKey: ["brands"] });
  }, [queryClient]);

  const handleBrandToggle = useCallback((brandId: number) => {
    setBrandIds((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId],
    );
  }, []);

  const handleClearBrands = useCallback(() => {
    setBrandIds([]);
  }, []);

  return (
    <div className="min-h-screen bg-background bg-noise">
      <Header onRefresh={handleRefresh} />

      <main className="container py-6 space-y-6 relative z-10">
        <SummaryCards
          totalModels={modelCount ?? 0}
          totalBrands={brands?.length ?? 0}
        />
        <SearchFilter
          brands={brands ?? []}
          selectedBrandIds={brandIds}
          onBrandToggle={handleBrandToggle}
          onClearBrands={handleClearBrands}
        />

        <ModelGrid
          models={allModels}
          isLoading={isLoading}
          error={error}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
        />
      </main>
    </div>
  );
}
