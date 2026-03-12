import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { modelsApi, dashboardApi, subscriptionsApi } from "@/api";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  BarChart3,
  Bell,
  BellOff,
  Loader2,
  Store,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { SiteComparisonItemDto } from "@/types/api";
import PriceTrendChart from "@/components/PriceTrendChart";
import { cn } from "@/lib/utils";

/** 피벗: 사이트→옵션 구조를 옵션→사이트 구조로 변환 */
interface OptionGroup {
  optionLabel: string;
  sites: { siteName: string; price: number; status: boolean; url: string }[];
}

function pivotToOptionGroups(sites: SiteComparisonItemDto[]): OptionGroup[] {
  const map = new Map<string, OptionGroup>();
  for (const site of sites) {
    for (const opt of site.options) {
      let group = map.get(opt.optionLabel);
      if (!group) {
        group = { optionLabel: opt.optionLabel, sites: [] };
        map.set(opt.optionLabel, group);
      }
      group.sites.push({
        siteName: site.siteName,
        price: opt.price,
        status: opt.status,
        url: opt.url,
      });
    }
  }
  return Array.from(map.values());
}

export default function ModelDetailPage() {
  const { modelId } = useParams<{ modelId: string }>();
  const modelIdNum = Number(modelId);
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedOptionLabel, setSelectedOptionLabel] = useState<string | null>(
    null,
  );

  const { data: model, isLoading } = useQuery({
    queryKey: ["model", modelIdNum],
    queryFn: () => modelsApi.getModel(modelIdNum),
    enabled: !!modelId && !isNaN(modelIdNum),
  });

  const { data: priceComparison } = useQuery({
    queryKey: ["priceComparison", modelIdNum],
    queryFn: () => dashboardApi.getPriceComparison({ modelId: modelIdNum }),
    enabled: !!modelId && !isNaN(modelIdNum),
  });

  const { data: priceHistory } = useQuery({
    queryKey: ["priceHistory", modelIdNum],
    queryFn: () => dashboardApi.getPriceHistory({ modelId: modelIdNum }),
    enabled: !!modelId && !isNaN(modelIdNum),
  });

  const { data: subs } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => subscriptionsApi.getSubscriptions(),
    enabled: isLoggedIn,
  });

  const optionGroups = useMemo(
    () => pivotToOptionGroups(priceComparison?.sites ?? []),
    [priceComparison],
  );

  // 데이터 로드 후 첫 번째 옵션을 기본 선택
  useEffect(() => {
    if (optionGroups.length > 0 && !selectedOptionLabel) {
      setSelectedOptionLabel(optionGroups[0].optionLabel);
    }
  }, [optionGroups, selectedOptionLabel]);

  const selectedOption = useMemo(
    () =>
      optionGroups.find((g) => g.optionLabel === selectedOptionLabel) ?? null,
    [optionGroups, selectedOptionLabel],
  );

  const currentSub = subs?.content.find((s) => s.modelId === modelIdNum);
  const isSubscribed = !!currentSub;

  const handleSubscribe = async () => {
    try {
      await subscriptionsApi.subscribe({ modelId: modelIdNum });
      toast({ title: "구독 완료" });
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["top-subscriptions"] });
    } catch {
      toast({ title: "오류 발생", variant: "destructive" });
    }
  };

  const handleUnsubscribe = async () => {
    if (!currentSub) return;
    try {
      await subscriptionsApi.unsubscribe(currentSub.id);
      toast({ title: "구독 해제됨" });
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["top-subscriptions"] });
    } catch {
      toast({ title: "오류 발생", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container flex items-center justify-center py-32">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center text-muted-foreground text-sm">
          모델을 찾을 수 없습니다.
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-noise">
      <Header />
      <main className="container py-6 space-y-5 relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> 목록으로
        </Link>

        <div className="flex flex-col gap-6 lg:flex-row">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-xl lg:w-96 flex-shrink-0"
          >
            {model.imageUrl ? (
              <img
                src={model.imageUrl}
                alt={model.modelName}
                className="h-80 w-full object-cover lg:h-[420px]"
              />
            ) : (
              <div className="h-80 w-full flex items-center justify-center bg-secondary text-muted-foreground text-sm lg:h-[420px]">
                No Image
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="flex-1 space-y-5"
          >
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] uppercase text-primary">
                {model.brandNameKo || model.brandName}
              </p>
              <h1 className="text-2xl font-bold font-display mt-1 text-foreground">
                {model.modelName}
              </h1>
            </div>

            {/* 구독 */}
            {isLoggedIn && (
              <div className="flex gap-2">
                {isSubscribed ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleUnsubscribe}
                  >
                    <BellOff className="mr-1 h-3.5 w-3.5" /> 구독 해제
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="font-medium"
                    onClick={handleSubscribe}
                  >
                    <Bell className="mr-1 h-3.5 w-3.5" /> 구독하기
                  </Button>
                )}
              </div>
            )}

            {/* 옵션별 그룹 (개선된 칩 디자인) */}
            {optionGroups.length > 0 && (
              <div className="space-y-4">
                {/* 사이즈 선택 칩 그룹 */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {optionGroups.map((group) => {
                    const isSelected =
                      selectedOptionLabel === group.optionLabel;
                    const isAvailable = group.sites.some((s) => s.status);
                    return (
                      <button
                        key={group.optionLabel}
                        onClick={() =>
                          setSelectedOptionLabel(group.optionLabel)
                        }
                        className={cn(
                          "flex-shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground shadow-md"
                            : isAvailable
                            ? "bg-background hover:bg-secondary"
                            : "bg-secondary text-muted-foreground cursor-not-allowed opacity-60 line-through",
                        )}
                      >
                        {group.optionLabel}
                      </button>
                    );
                  })}
                </div>

                {/* 선택된 사이즈의 사이트 목록 */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedOptionLabel}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {selectedOption && (
                      <div className="divide-y divide-border rounded-lg border border-border bg-card/50">
                        {selectedOption.sites.map((site) => (
                          <div
                            key={site.siteName}
                            className="flex items-center justify-between px-4 py-3"
                          >
                            <div className="flex items-center gap-2">
                              <Store className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-semibold text-foreground">
                                {site.siteName}
                              </span>
                              <Badge
                                variant={site.status ? "default" : "outline"}
                                className="h-5"
                              >
                                {site.status ? "재고 있음" : "품절"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-foreground">
                                {site.price != null
                                  ? `₩${site.price.toLocaleString()}`
                                  : "—"}
                              </span>
                              {site.url && (
                                <a
                                  href={site.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {/* 가격 추이 차트 */}
            {priceHistory && priceHistory.sites.length > 0 ? (
              <PriceTrendChart sites={priceHistory.sites} />
            ) : (
              <div className="glass-card rounded-xl p-5 flex flex-col items-center justify-center gap-2 py-10">
                <BarChart3 className="h-6 w-6 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  아직 가격 이력이 없습니다
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
