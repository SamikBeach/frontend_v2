import { Skeleton } from '@/components/ui/skeleton';

export function StatsTabsSkeleton() {
  return (
    <div className="mb-0 flex flex-wrap gap-3 sm:mb-6">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-8 w-20 rounded-full" />
      ))}
    </div>
  );
}
