import { Skeleton } from '@/components/ui/skeleton';

export function TabsSkeleton() {
  return (
    <div className="mb-4 border-b border-gray-100 pb-4">
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-[90px] rounded-full" />
        ))}
      </div>
    </div>
  );
}
