import { Skeleton } from '@/components/ui/skeleton';

export function ReadBooksSkeleton() {
  // 읽기 상태 필터 스켈레톤 - 실제 필터 순서와 크기에 맞게 조정
  const statusFilters = [
    { id: 'all', width: 'w-16' }, // 전체
    { id: 'want', width: 'w-28' }, // 읽고 싶어요
    { id: 'reading', width: 'w-20' }, // 읽는중
    { id: 'read', width: 'w-24' }, // 읽었어요
  ];

  return (
    <div>
      {/* 독서 상태 필터 스켈레톤 */}
      <div className="mb-6 flex gap-3">
        {statusFilters.map(status => (
          <Skeleton
            key={status.id}
            className={`h-8 ${status.width} rounded-full`}
          />
        ))}
      </div>

      {/* 책 그리드 스켈레톤 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="flex h-full w-full flex-col">
            <div className="h-full w-full">
              <div className="relative aspect-[3/4.5] w-full overflow-hidden rounded-lg bg-gray-100">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="mt-2.5 space-y-1.5">
                <Skeleton className="h-[15px] w-full" />
                <Skeleton className="h-[13px] w-[70%]" />
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-3.5 w-3.5 rounded-full" />
                    <Skeleton className="h-[13px] w-12" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-3.5 w-3.5 rounded-full" />
                    <Skeleton className="h-[13px] w-8" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
