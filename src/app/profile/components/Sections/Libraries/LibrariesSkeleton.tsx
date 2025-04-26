import { LibraryCardSkeleton } from '@/components/LibraryCard';
import { Skeleton } from '@/components/ui/skeleton';

export function LibrariesSkeleton() {
  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap gap-3">
            {/* 통계 정보(서재, 책, 구독자 수) 스켈레톤 */}
            <Skeleton className="h-[34px] w-24 rounded-md" />
            <Skeleton className="h-[34px] w-24 rounded-md" />
            <Skeleton className="h-[34px] w-24 rounded-md" />
          </div>
        </div>
        {/* 새 서재 만들기 버튼 스켈레톤 */}
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <LibraryCardSkeleton key={index} />
        ))}
      </div>

      {/* 페이지네이션 스켈레톤 */}
      <div className="mt-6 flex justify-center">
        <Skeleton className="h-10 w-52 rounded-full" />
      </div>
    </>
  );
}
