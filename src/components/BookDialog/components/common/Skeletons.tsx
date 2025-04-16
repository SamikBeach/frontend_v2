import { Skeleton } from '@/components/ui/skeleton';

// 전체 북 다이얼로그 스켈레톤
export function BookFullSkeleton() {
  return (
    <>
      <BookHeaderSkeleton />
      <BookSkeleton />
    </>
  );
}

// 헤더 스켈레톤
export function BookHeaderSkeleton() {
  return (
    <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-6 py-4 backdrop-blur">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-6 w-40 rounded" />
      </div>
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  );
}

// 책 정보 스켈레톤
export function BookInfoSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Skeleton className="h-5 w-24 rounded" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Skeleton className="h-5 w-24 rounded" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
      </div>
    </div>
  );
}

// 리뷰 스켈레톤 - 독립 컴포넌트로 분리
export function BookReviewsSkeleton() {
  return (
    <div className="space-y-0">
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className={`${index === 0 ? 'pt-2 pb-6' : 'py-6'} ${
              index !== 2 ? 'border-b border-gray-100' : ''
            }`}
          >
            <div className="flex items-start gap-3.5">
              <Skeleton className="mt-0.5 h-9 w-9 flex-shrink-0 rounded-full" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-3 w-16 rounded" />
                </div>

                {/* 별점 스켈레톤 */}
                <div className="mt-1 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-3 w-3 rounded-full" />
                  ))}
                </div>

                {/* 본문 스켈레톤 */}
                <div className="mt-2 space-y-1.5">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-2/3 rounded" />
                </div>

                {/* 버튼 스켈레톤 */}
                <div className="mt-2.5 flex items-center gap-2 pt-1">
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

// 책 본문 스켈레톤
export function BookSkeleton() {
  return (
    <div className="mx-auto w-full max-w-screen-xl px-10 pt-4 pb-10">
      <div className="grid gap-10 md:grid-cols-[380px_1fr]">
        {/* 왼쪽: 책 표지 및 기본 정보 */}
        <div className="space-y-6">
          {/* 책 표지 스켈레톤 */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-100">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-full rounded" />
              <Skeleton className="h-5 w-4/5 rounded" />
              <Skeleton className="h-5 w-2/3 rounded" />
            </div>
          </div>

          {/* 별점 정보 스켈레톤 */}
          <div className="h-24 animate-pulse rounded-xl bg-gray-50 p-4"></div>

          {/* 읽기 통계 스켈레톤 */}
          <Skeleton className="h-20 w-full rounded-xl" />

          {/* 기능 버튼 스켈레톤 */}
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-10 w-full rounded-full" />
              <Skeleton className="h-10 w-full rounded-full" />
            </div>
          </div>

          {/* 책 설명 스켈레톤 */}
          <BookInfoSkeleton />
        </div>

        {/* 오른쪽: 리뷰 및 관련 정보 스켈레톤 */}
        <div className="space-y-4">
          {/* 탭 네비게이션 스켈레톤 */}
          <div className="relative flex items-center justify-between border-b border-gray-200">
            <div className="flex gap-6">
              <Skeleton className="h-6 w-20 rounded" />
              <Skeleton className="h-6 w-36 rounded" />
            </div>
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>

          {/* 컨텐츠 영역 스켈레톤 */}
          <BookReviewsSkeleton />
        </div>
      </div>
    </div>
  );
}

// 서재 목록 스켈레톤
export function LibrariesSkeleton() {
  return (
    <div className="space-y-4">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-gray-100 p-4"
          >
            <Skeleton className="h-12 w-12 rounded" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-5 w-32 rounded" />
              <Skeleton className="h-4 w-48 rounded" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ))}
    </div>
  );
}
