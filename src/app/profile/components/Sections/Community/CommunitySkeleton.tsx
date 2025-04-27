import { Skeleton } from '@/components/ui/skeleton';

export function CommunitySkeleton() {
  return (
    <div>
      {/* 필터 메뉴 스켈레톤 */}
      <div className="mb-6 flex flex-wrap gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-24 rounded-full" />
        ))}
      </div>

      {/* 리뷰 카드 스켈레톤 */}
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
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
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>

                {/* Timestamp */}
                <Skeleton className="mt-0.5 h-3 w-20" />

                {/* Review title */}
                <Skeleton className="mt-3 h-5 w-3/4" />

                {/* Review content */}
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-1 h-4 w-full" />
                <Skeleton className="mt-1 h-4 w-11/12" />

                {/* Actions */}
                <div className="mt-4 flex items-center gap-4">
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
