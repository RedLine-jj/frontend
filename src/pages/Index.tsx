import { useState, useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { modelsApi, brandsApi, subscriptionsApi } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import { useCursorPagination } from "@/hooks/useCursorPagination";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import SummaryCards from "@/components/SummaryCards";
import SearchFilter from "@/components/SearchFilter";
import ModelGrid from "@/components/ModelGrid";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";

export default function Dashboard() {
  const [brandIds, setBrandIds] = useState<number[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const { isLoggedIn } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // --- API 데이터 조회 ---
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: () => brandsApi.getBrands(),
    staleTime: 1000 * 60 * 5,
  });

  const { data: modelTypes } = useQuery({
    queryKey: ["modelTypes"],
    queryFn: () => modelsApi.getModelTypes(),
    staleTime: Infinity, // 앱 전체에서 거의 변하지 않는 데이터
  });

  const { data: modelCount } = useQuery({
    queryKey: ["models", "count"],
    queryFn: () => modelsApi.getModelCount(),
    staleTime: 1000 * 60,
  });

  // --- 필터링된 모델 목록 조회 ---
  const brandQueryKey = useMemo(() => brandIds.sort().join(","), [brandIds]);
  const typeQueryKey = useMemo(() => types.sort().join(","), [types]);

  const {
    data: modelsData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCursorPagination(["models", brandQueryKey, typeQueryKey], (cursor) =>
    modelsApi.getModels({ brandIds, types, cursor, size: 20 }),
  );

  const allModels = useMemo(
    () => modelsData?.pages.flatMap((p) => p.content) ?? [],
    [modelsData],
  );

  // --- 구독 데이터 ---
  const { data: subscriptions } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => subscriptionsApi.getSubscriptions(),
    enabled: isLoggedIn,
  });

  // modelId → subscriptionId 매핑 (해제 시 필요)
  const subscriptionMap = useMemo(() => {
    const map = new Map<number, number>();
    subscriptions?.content.forEach((s) => map.set(s.modelId, s.id));
    return map;
  }, [subscriptions]);

  const subscribedModelIds = useMemo(
    () => new Set(subscriptionMap.keys()),
    [subscriptionMap],
  );

  const handleToggleSubscribe = useCallback(
    async (modelId: number) => {
      try {
        const subId = subscriptionMap.get(modelId);
        if (subId != null) {
          await subscriptionsApi.unsubscribe(subId);
          toast({ title: '구독 해제됨' });
        } else {
          await subscriptionsApi.subscribe({ modelId });
          toast({ title: '구독 완료' });
        }
        queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      } catch {
        toast({ title: '오류 발생', variant: 'destructive' });
      }
    },
    [subscriptionMap, queryClient, toast],
  );

  // --- 이벤트 핸들러 ---
  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["models"] });
    queryClient.invalidateQueries({ queryKey: ["brands"] });
    queryClient.invalidateQueries({ queryKey: ["modelTypes"] });
  }, [queryClient]);

  const handleBrandToggle = useCallback((brandId: number) => {
    setBrandIds((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId],
    );
  }, []);

  const handleClearBrands = useCallback(() => setBrandIds([]), []);

  const handleTypeToggle = useCallback((typeCode: string) => {
    setTypes((prev) =>
      prev.includes(typeCode)
        ? prev.filter((c) => c !== typeCode)
        : [...prev, typeCode],
    );
  }, []);

  const handleClearTypes = useCallback(() => setTypes([]), []);

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
          modelTypes={modelTypes ?? []}
          selectedTypes={types}
          onTypeToggle={handleTypeToggle}
          onClearTypes={handleClearTypes}
        />

        <ModelGrid
          models={allModels}
          isLoading={isLoading}
          error={error}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          subscribedModelIds={isLoggedIn ? subscribedModelIds : undefined}
          onToggleSubscribe={isLoggedIn ? handleToggleSubscribe : undefined}
        />
      </main>
      <ScrollToTopButton />
    </div>
  );
}
