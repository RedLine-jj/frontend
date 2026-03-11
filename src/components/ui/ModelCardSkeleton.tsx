import { Skeleton } from "@/components/ui/skeleton";

export function ModelCardSkeleton() {
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="p-4 space-y-2.5">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-5 w-1/2" />
      </div>
    </div>
  );
}
