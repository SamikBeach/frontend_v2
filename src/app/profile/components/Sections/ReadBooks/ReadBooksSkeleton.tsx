import { Skeleton } from '@/components/ui/skeleton';
import { readingStatusFilters } from './components/FilterMenu';

// 필터 메뉴 스켈레톤 컴포넌트
export function FilterMenuSkeleton() {
  return (
    <div className="mb-3 flex flex-wrap gap-3 sm:mb-6">
      {readingStatusFilters.map(filter => (
        <div key={filter.id} className="flex items-center">
          <Skeleton
            className="h-8 rounded-full px-3"
            style={{
              width: `${Math.max(80, filter.name.length * 14 + 40)}px`,
            }}
          />
        </div>
      ))}
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
            <div className="relative aspect-[3/4.5] w-full overflow-hidden rounded-lg border border-gray-100 bg-gray-50 shadow-sm">
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
