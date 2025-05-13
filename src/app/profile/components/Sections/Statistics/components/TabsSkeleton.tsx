import { Skeleton } from '@/components/ui/skeleton';

export function TabsSkeleton() {
  return (
    <div className="mb-4 overflow-x-auto border-b border-gray-100 pb-4">
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-7 w-16 rounded-full sm:h-8 sm:w-20"
          />
        ))}
      </div>
    </div>
  );
}
