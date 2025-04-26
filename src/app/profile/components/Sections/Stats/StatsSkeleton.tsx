import { Skeleton } from '@/components/ui/skeleton';

export function StatsSkeleton() {
  return (
    <div>
      <Skeleton className="mb-6 h-8 w-32" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col items-center rounded-xl bg-gray-50 p-6 text-center shadow-sm"
          >
            <Skeleton className="mb-3 h-12 w-12 rounded-full" />
            <Skeleton className="mb-1 h-6 w-16" />
            <Skeleton className="mb-1 h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Skeleton className="mb-4 h-6 w-32" />
        <div className="h-[300px] rounded-xl bg-gray-50 p-4">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
