import { Skeleton } from '@/components/ui/skeleton';

export function ReadBooksSkeleton() {
  // 스켈레톤 상태 필터 버튼들
  const statusFilters = [
    { id: 'finished', name: '읽었어요' },
    { id: 'reading', name: '읽고 있어요' },
    { id: 'want', name: '읽고 싶어요' },
  ];

  return (
    <div>
      {/* 독서 상태 필터 스켈레톤 */}
      <div className="mb-6 flex gap-3">
        {statusFilters.map(status => (
          <Skeleton key={status.id} className="h-8 w-24 rounded-full" />
        ))}
      </div>

      {/* 책 그리드 스켈레톤 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-3.5 w-3.5 rounded-full" />
              ))}
              <Skeleton className="ml-1 h-3 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
