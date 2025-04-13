import { Skeleton } from '@/components/ui/skeleton';

export function BookSkeleton() {
  return (
    <div className="mx-auto w-full max-w-screen-xl px-10 pt-4 pb-10">
      <div className="grid gap-10 md:grid-cols-[380px_1fr]">
        {/* 왼쪽: 책 표지 및 기본 정보 */}
        <div className="space-y-6">
          {/* 책 표지 스켈레톤 */}
          <Skeleton className="aspect-[3/4] h-[420px] w-full rounded-2xl" />

          {/* 별점 영역 스켈레톤 */}
          <Skeleton className="h-28 rounded-xl" />

          {/* 버튼 영역 스켈레톤 */}
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-10 rounded-full" />
            <Skeleton className="h-10 rounded-full" />
          </div>

          {/* 책 설명 스켈레톤 */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-20 rounded" />
          </div>
        </div>

        {/* 오른쪽: 리뷰 및 기타 정보 */}
        <div className="space-y-7">
          {/* 리뷰 섹션 스켈레톤 */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-32 rounded" />
            <div className="space-y-3">
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
            </div>
          </div>

          {/* 서재 섹션 스켈레톤 */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-32 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
