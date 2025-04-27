import { Skeleton } from '@/components/ui/skeleton';

export function ReviewsSkeleton() {
  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg border border-gray-100 bg-white p-4"
          >
            <div className="flex gap-3">
              {/* Avatar and username */}
              <div className="flex-shrink-0">
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full bg-yellow-50" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>

                {/* Timestamp */}
                <Skeleton className="mt-0.5 h-3 w-20" />

                {/* Review content */}
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-1 h-4 w-full" />
                <Skeleton className="mt-1 h-4 w-11/12" />

                {/* Book info/cover */}
                <div className="mt-3 flex items-start gap-3">
                  <Skeleton className="h-[70px] w-[48px] rounded-md" />
                  <div className="flex flex-1 flex-col">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="mt-1 h-3 w-3/4" />
                    <div className="mt-1 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-3 w-3 rounded-full" />
                      ))}
                      <Skeleton className="ml-1 h-3 w-8" />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 flex items-center gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
