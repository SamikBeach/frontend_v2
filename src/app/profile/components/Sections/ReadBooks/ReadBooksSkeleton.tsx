import { Skeleton } from '@/components/ui/skeleton';
import { readingStatusFilters } from './components/FilterMenu';

// 필터 메뉴 스켈레톤 컴포넌트
export function FilterMenuSkeleton() {
  return (
    <div className="mb-3 sm:mb-6">
      <div className="relative w-full">
        {/* 독서 상태 필터와 정렬 옵션 배치 */}
        <div className="flex w-full items-start justify-between">
          {/* 독서 상태 필터 - 왼쪽 */}
          <div className="no-scrollbar w-full overflow-x-auto pt-0.5 pb-1 md:pt-1 md:pb-1">
            <div className="flex gap-2 pl-2 after:block after:w-1 after:flex-shrink-0 after:content-[''] md:flex-wrap md:gap-3 md:overflow-x-visible md:pl-0 md:after:content-none">
              {readingStatusFilters.map(filter => (
                <Skeleton
                  key={filter.id}
                  className="h-8 w-20 shrink-0 rounded-full"
                />
              ))}
            </div>
          </div>

          {/* 정렬 드롭다운 스켈레톤 - 오른쪽 (데스크탑에서만 표시) */}
          <div className="ml-4 hidden flex-shrink-0 items-center xl:flex">
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          </div>
        </div>

        {/* xl 미만 화면에서 보이는 정렬 버튼 스켈레톤 */}
        <div className="w-full xl:hidden">
          <div className="flex gap-2 px-2 pt-1.5 pb-1.5">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// 책 목록 스켈레톤 컴포넌트
export function BooksGridSkeleton() {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="flex h-full w-full flex-col">
          <div className="h-full w-full">
            <div className="relative aspect-[3/4.5] w-full overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="mt-2.5 space-y-1.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3.5 w-[70%]" />
              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3.5 w-3.5 rounded-full" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3.5 w-3.5 rounded-full" />
                  <Skeleton className="h-3 w-8" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 통합 스켈레톤 컴포넌트 - 헤더, 필터, 내용을 모두 포함
export function ReadBooksSkeleton() {
  return (
    <div>
      {/* 필터 메뉴 스켈레톤 */}
      <FilterMenuSkeleton />

      {/* 책 목록 스켈레톤 */}
      <BooksGridSkeleton />
    </div>
  );
}
