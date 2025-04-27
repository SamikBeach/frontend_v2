import { Skeleton } from '@/components/ui/skeleton';

export function CommunitySkeleton() {
  return (
    <div>
      {/* 필터 메뉴 스켈레톤 */}
      <div className="mb-6 flex flex-wrap gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-32 rounded-full" />
        ))}
      </div>

      {/* 리뷰 카드 스켈레톤 */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg bg-gray-50 p-5"
          >
            <div className="flex gap-5">
              <div className="flex-shrink-0">
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="mt-2 h-3 w-32" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-1 h-4 w-11/12" />
                <Skeleton className="mt-1 h-4 w-4/5" />
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
