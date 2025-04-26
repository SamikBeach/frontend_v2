import { LibraryContentSkeleton } from './LibraryContent';

export function LibraryDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1920px] px-4">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white pt-3">
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            {/* 서재 제목 (text-2xl font-bold) */}
            <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200"></div>

            {/* 서재 태그 부분 */}
            <div className="flex gap-2">
              <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200"></div>
              <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200"></div>
            </div>

            {/* 공개/비공개 배지 */}
            <div className="h-6 w-20 animate-pulse rounded-md border border-gray-200 bg-gray-100"></div>
          </div>

          {/* 유저 정보 (text-sm) */}
          <div className="flex items-center">
            <div className="h-5 w-24 animate-pulse rounded-md bg-gray-200"></div>
            <div className="ml-1 h-5 w-12 animate-pulse rounded-md bg-gray-200"></div>
          </div>
        </div>

        {/* 우측 버튼 영역 */}
        <div className="flex items-center gap-2">
          <div className="h-10 w-32 animate-pulse rounded-full bg-gray-200"></div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
        <div>
          <LibraryContentSkeleton />
        </div>
        <div className="w-full min-w-[400px]">
          <div className="rounded-xl bg-white p-5">
            <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200"></div>
            <div className="mt-3 h-5 w-32 animate-pulse rounded-lg bg-gray-200"></div>
            <div className="mt-2 h-4 w-40 animate-pulse rounded-lg bg-gray-200"></div>
            <div className="mt-6 space-y-3">
              <div className="h-4 w-full animate-pulse rounded-lg bg-gray-200"></div>
              <div className="h-4 w-3/4 animate-pulse rounded-lg bg-gray-200"></div>
              <div className="h-4 w-1/2 animate-pulse rounded-lg bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
