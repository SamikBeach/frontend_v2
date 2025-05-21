import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

// 전체 북 다이얼로그 스켈레톤
export function BookFullSkeleton() {
  const isMobile = useIsMobile();
  return (
    <div className="w-full overflow-hidden">
      {/* 헤더는 페이지에선 없음, 다이얼로그에선 별도 처리 */}
      {isMobile ? <BookMobileSkeleton /> : <BookSkeleton />}
    </div>
  );
}

// 헤더 스켈레톤
export function BookHeaderSkeleton() {
  return (
    <div className="sticky top-0 z-50 flex h-16 items-center justify-between rounded-lg border-b border-gray-200 bg-white/95 px-6 py-4 backdrop-blur">
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

// 반응형 책 상세 스켈레톤 (BookPageContent와 구조/클래스 완전 일치)
export function BookSkeleton() {
  return (
    <div className="mx-auto w-full p-3 md:p-8">
      <div className="space-y-6 md:grid md:grid-cols-[380px_1fr] md:gap-10 md:space-y-0">
        {/* 왼쪽: 책 표지 및 기본 정보 */}
        <div className="space-y-6">
          {/* 책 표지 이미지 */}
          <div className="relative mx-auto w-44 overflow-hidden rounded-2xl bg-gray-50 md:w-56 lg:w-64">
            <Skeleton className="h-[264px] w-full md:h-[320px]" />
          </div>
          {/* 제목/저자/출판사/출간일 */}
          <div className="space-y-2 px-1 md:px-0">
            <div className="text-center md:text-left">
              <Skeleton className="inline-block h-7 w-32 rounded md:h-8 md:w-48" />
              <Skeleton className="ml-2 inline-block h-5 w-12 rounded-full align-text-bottom" />
              <Skeleton className="ml-1 inline-block h-5 w-10 rounded-full align-text-bottom" />
            </div>
            <Skeleton className="mx-auto h-5 w-24 rounded md:mx-0 md:w-32" />
            <Skeleton className="mx-auto h-5 w-20 rounded md:mx-0 md:w-28" />
            <Skeleton className="mx-auto h-5 w-28 rounded md:mx-0 md:w-36" />
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
          <p className="mt-2 text-right text-xs text-gray-400">
            정보제공: 알라딘
          </p>
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

// 모바일 전용 책 상세 스켈레톤
export function BookMobileSkeleton() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      <div className="pb-safe h-full overflow-y-auto">
        <div className="mx-auto w-full px-4 pt-4">
          <div className="space-y-6">
            {/* 책 표지 이미지 */}
            <div className="flex flex-col gap-4">
              <div className="relative mx-auto w-44 overflow-hidden rounded-2xl bg-gray-100">
                <Skeleton className="h-[264px] w-full" />
              </div>
              <div className="flex flex-col gap-2 px-1 text-center">
                <Skeleton className="mx-auto h-6 w-3/4 rounded" />
                <div className="flex justify-center gap-2">
                  <Skeleton className="h-5 w-12 rounded-full" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
                <Skeleton className="mx-auto h-5 w-1/2 rounded" />
                <Skeleton className="mx-auto h-5 w-1/3 rounded" />
                <Skeleton className="mx-auto h-5 w-1/3 rounded" />
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
            <p className="mt-2 text-right text-xs text-gray-400">
              정보제공: 알라딘
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
