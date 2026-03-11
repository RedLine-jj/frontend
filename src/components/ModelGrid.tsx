import { useRef, useEffect } from "react";
import { Loader2, SearchX } from "lucide-react";
import { ModelCardSkeleton } from "@/components/ui/ModelCardSkeleton";
import ModelCard from "@/components/ModelCard";
import type { ModelDto } from "@/types/api";

interface ModelGridProps {
  models: ModelDto[];
  isLoading: boolean;
  error: Error | null;
  isFetchingNextPage: boolean;
  hasNextPage: boolean | undefined;
  fetchNextPage: () => void;
}

export default function ModelGrid({
  models,
  isLoading,
  error,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
}: ModelGridProps) {
  // 무한 스크롤을 위한 sentinel 요소
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
      { rootMargin: "400px" }, // 뷰포트 하단 400px 전에 미리 로드
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 초기 로딩 상태: 스켈레톤 UI 표시
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ModelCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <p className="text-destructive font-medium text-sm">
          데이터를 불러올 수 없습니다.
        </p>
        <p className="text-muted-foreground text-xs mt-1">
          잠시 후 다시 시도해주세요.
        </p>
      </div>
    );
  }

  // 빈 결과 상태
  if (models.length === 0) {
    return (
      <div className="col-span-full py-20 text-center">
        <SearchX className="mx-auto h-12 w-12 text-muted-foreground/40" />
        <p className="mt-4 text-muted-foreground text-sm">
          선택한 조건에 맞는 상품이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {models.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>

      {/* 무한 스크롤 트리거 */}
      <div ref={sentinelRef} className="flex justify-center py-6">
        {isFetchingNextPage && (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        )}
      </div>
    </>
  );
}
