import { LibraryCardSkeleton } from '@/components/LibraryCard';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * 구독한 서재 섹션의 로딩 상태를 표시하는 스켈레톤 컴포넌트
 */
export function SubscribedLibrariesSkeleton() {
  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-9 w-[140px] rounded-full" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <LibraryCardSkeleton key={index} />
        ))}
      </div>
    </>
  );
}
