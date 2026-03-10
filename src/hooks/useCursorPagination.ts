import { useInfiniteQuery } from '@tanstack/react-query';
import type { CursorPage } from '@/types/api';

/**
 * Redline API 커서 기반 페이징 훅.
 *
 * @example
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useCursorPagination(
 *   ['models'],
 *   (cursor) => getModels({ cursor, size: 20 }),
 * );
 * const allItems = data?.pages.flatMap(p => p.content) ?? [];
 */
export function useCursorPagination<T>(
  queryKey: unknown[],
  fetcher: (cursor?: number) => Promise<CursorPage<T>>,
  options?: { enabled?: boolean },
) {
  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetcher(pageParam),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor ?? undefined : undefined),
    ...options,
  });
}
