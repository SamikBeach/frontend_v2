import { Skeleton } from '@/components/ui/skeleton';

export function PopularBooksSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:gap-4">
      {[...Array(4)].map((_, index) => (
        <div key={index} className={`w-full ${index === 3 ? 'sm:hidden' : ''}`}>
          <div className="flex h-full w-full flex-col overflow-hidden rounded-xl">
            <div className="h-full w-full bg-white">
              <Skeleton className="relative flex aspect-[3/4.5] items-center justify-center overflow-hidden" />
              <div className="p-2.5">
                <Skeleton className="mb-1 h-5 w-full" />
                <Skeleton className="mb-1.5 h-4 w-3/4" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="mt-1.5 h-4 w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
