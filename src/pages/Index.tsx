import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { modelsApi, brandsApi, subscriptionsApi } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import { useCursorPagination } from "@/hooks/useCursorPagination";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";

import Header from "@/components/Header";
import RecentRestockCard from "@/components/dashboard/RecentRestockCard";
import TopSubscriptionCard from "@/components/dashboard/TopSubscriptionCard";
import SearchFilter from "@/components/SearchFilter";
import ModelGrid from "@/components/ModelGrid";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoggedIn } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const brandIds = useMemo(() => {
    const raw = searchParams.get("brandIds");
    if (!raw) return [] as number[];
    return raw
      .split(",")
      .map(Number)
      .filter((n) => !isNaN(n));
  }, [searchParams]);

  const types = useMemo(() => {
    const raw = searchParams.get("types");
    if (!raw) return [] as string[];
    return raw.split(",").filter(Boolean);
  }, [searchParams]);

  // 브랜드 조회
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: () => brandsApi.getBrands(),
    staleTime: 1000 * 60 * 5,
  });

  // 모델 타입 조회
  const { data: modelTypes } = useQuery({
    queryKey: ["modelTypes"],
    queryFn: () => modelsApi.getModelTypes(),
    staleTime: Infinity,
  });

  // 모델 목록 조회
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

  // 구독 데이터
  const { data: subscriptions } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => subscriptionsApi.getSubscriptions(),
    enabled: isLoggedIn,
  });

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
          toast({ title: "구독 해제됨" });
        } else {
          await subscriptionsApi.subscribe({ modelId });
          toast({ title: "구독 완료" });
        }

        queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
        queryClient.invalidateQueries({ queryKey: ["top-subscriptions"] });
      } catch {
        toast({ title: "오류 발생", variant: "destructive" });
      }
    },
    [subscriptionMap, queryClient, toast],
  );

  const updateParams = useCallback(
    (key: string, value: string | null) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        if (value) next.set(key, value);
        else next.delete(key);

        return next;
      });
    },
    [setSearchParams],
  );

  const handleBrandToggle = useCallback(
    (brandId: number) => {
      const next = brandIds.includes(brandId)
        ? brandIds.filter((id) => id !== brandId)
        : [...brandIds, brandId];

      updateParams("brandIds", next.length ? next.join(",") : null);
    },
    [brandIds, updateParams],
  );

  const handleTypeToggle = useCallback(
    (typeCode: string) => {
      const next = types.includes(typeCode)
        ? types.filter((c) => c !== typeCode)
        : [...types, typeCode];

      updateParams("types", next.length ? next.join(",") : null);
    },
    [types, updateParams],
  );

  const handleClearBrands = () => updateParams("brandIds", null);
  const handleClearTypes = () => updateParams("types", null);

  const handleClearAllFilters = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("brandIds");
      next.delete("types");
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background bg-noise">
      <Header />

      <main className="container py-6 space-y-6 relative z-10">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RecentRestockCard />
          <TopSubscriptionCard />
        </div>

        {/* Filter */}
        <SearchFilter
          brands={brands ?? []}
          selectedBrandIds={brandIds}
          onBrandToggle={handleBrandToggle}
          onClearBrands={handleClearBrands}
          modelTypes={modelTypes ?? []}
          selectedTypes={types}
          onTypeToggle={handleTypeToggle}
          onClearTypes={handleClearTypes}
          onClearAll={handleClearAllFilters}
        />

        {/* Model Grid */}
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
