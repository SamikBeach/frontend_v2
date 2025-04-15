import { Skeleton } from '@/components/ui/skeleton';

export function BookSkeleton() {
  return (
    <div className="mx-auto w-full max-w-screen-xl px-10 pt-4 pb-10">
      <div className="grid gap-10 md:grid-cols-[380px_1fr]">
        {/* 왼쪽: 책 표지 및 기본 정보 */}
        <div className="space-y-7">
          {/* 책 표지 스켈레톤 */}
          <div className="space-y-3">
            <Skeleton className="aspect-[3/4] h-[420px] w-full rounded-2xl" />
            <div className="flex flex-wrap items-center gap-1.5">
              <Skeleton className="h-6 w-14 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>

          {/* 별점 영역 스켈레톤 */}
          <div className="space-y-2 rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20 rounded" />
              <Skeleton className="h-4 w-12 rounded" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-3 w-full rounded" />
              </div>
            </div>
          </div>

          {/* 읽기 통계 스켈레톤 */}
          <div className="space-y-3 rounded-xl border border-gray-100 p-4">
            <Skeleton className="h-5 w-24 rounded" />
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Skeleton className="h-8 w-16 rounded" />
                <Skeleton className="h-4 w-12 rounded" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-8 w-16 rounded" />
                <Skeleton className="h-4 w-12 rounded" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-8 w-16 rounded" />
                <Skeleton className="h-4 w-12 rounded" />
              </div>
            </div>
          </div>

          {/* 버튼 영역 스켈레톤 */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-10 w-full rounded-full" />
            <Skeleton className="h-10 w-full rounded-full" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-9 rounded-lg" />
              <Skeleton className="h-9 rounded-lg" />
            </div>
          </div>

          {/* 책 설명 스켈레톤 */}
          <div className="space-y-3">
            <div className="space-y-1">
              <Skeleton className="h-5 w-24 rounded" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-3/4 rounded" />
              </div>
            </div>
            <div className="space-y-1">
              <Skeleton className="h-5 w-24 rounded" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-2/3 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: 리뷰 및 기타 정보 */}
        <div className="space-y-4">
          {/* 탭 네비게이션 스켈레톤 */}
          <div className="relative flex items-center justify-between border-b border-gray-200">
            <div className="flex">
              <div className="border-b-2 border-gray-900 pb-2">
                <Skeleton className="h-5 w-16 rounded" />
              </div>
              <div className="ml-6 pb-2">
                <Skeleton className="h-5 w-28 rounded" />
              </div>
            </div>
            {/* 정렬 드롭다운 스켈레톤 - 네비게이션과 같은 행에 배치 */}
            <div className="absolute -top-1 right-0">
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
          </div>

          {/* 리뷰 섹션 스켈레톤 */}
          <div className="space-y-0">
            {[1, 2, 3].map((i, index) => (
              <div
                key={i}
                className={`${index === 0 ? 'pt-2 pb-6' : 'py-6'} ${
                  i !== 3 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 h-9 w-9 flex-shrink-0 rounded-full bg-gray-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-20 rounded-full bg-gray-200"></div>
                      <div className="h-3 w-16 rounded-full bg-gray-200"></div>
                    </div>

                    {/* 별점 스켈레톤 */}
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div
                          key={index}
                          className="h-3 w-3 rounded-full bg-gray-200"
                        ></div>
                      ))}
                    </div>

                    {/* 본문 스켈레톤 */}
                    <div className="space-y-1.5">
                      <div className="h-4 w-full rounded-full bg-gray-200"></div>
                      <div className="h-4 w-full rounded-full bg-gray-200"></div>
                      <div className="h-4 w-2/3 rounded-full bg-gray-200"></div>
                    </div>

                    {/* 버튼 스켈레톤 */}
                    <div className="mt-2.5 flex items-center gap-2 pt-1">
                      <div className="h-7 w-16 rounded-full bg-gray-200"></div>
                      <div className="h-7 w-16 rounded-full bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
