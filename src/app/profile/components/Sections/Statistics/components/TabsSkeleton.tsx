import { Skeleton } from '@/components/ui/skeleton';

export function TabsSkeleton() {
  return (
    <div className="flex flex-wrap gap-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-8 w-[90px] rounded-full" />
      ))}
    </div>
  );
}
