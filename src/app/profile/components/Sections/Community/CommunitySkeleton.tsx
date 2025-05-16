import { Skeleton } from '@/components/ui/skeleton';

// 필터 메뉴 스켈레톤 컴포넌트
export function FilterMenuSkeleton() {
  return (
    <div className="mb-0 flex flex-wrap gap-3 sm:mb-6">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-8 w-24 rounded-full" />
      ))}
    </div>
  );
}

// 리뷰 콘텐츠만 로딩하는 스켈레톤 (메뉴 변경 시 사용)
export function CommunityContentSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="flex gap-3">
            {/* Avatar and username */}
            <div className="flex-shrink-0">
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
                <Skeleton className="h-7 w-7 rounded-md" />
              </div>

              {/* Timestamp */}
              <Skeleton className="mt-0.5 h-3 w-20" />

              {/* 별점 표시 */}
              <Skeleton className="mt-2 h-4 w-24" />

              {/* Review content */}
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-1.5 h-4 w-full" />
              <Skeleton className="mt-1.5 h-4 w-11/12" />

              {/* Actions */}
              <div className="mt-4 flex items-center gap-4">
                <Skeleton className="h-7 w-16 rounded-full" />
                <Skeleton className="h-7 w-16 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 전체 커뮤니티 섹션 스켈레톤 (최초 로딩 시 사용)
export function CommunitySkeleton() {
  return (
    <div>
      <FilterMenuSkeleton />
      <CommunityContentSkeleton />
    </div>
  );
}
