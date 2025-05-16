'use client';

import { LibraryCardSkeleton } from '@/components/LibraryCard';
import { Skeleton } from '@/components/ui/skeleton';

// 헤더 스켈레톤
export function HeaderSkeleton() {
  return (
    <div className="bg-white">
      <div className="mx-auto w-full md:pb-6">
        <div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Skeleton className="h-24 w-24 rounded-full sm:h-32 sm:w-32" />
            <div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-48 sm:h-8" />
              </div>
              <Skeleton className="mt-1 h-4 w-64" />
              <div className="mt-2 flex gap-3">
                <Skeleton className="h-5 w-20" />
                <div className="h-4 border-r border-gray-200" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </div>
          <Skeleton className="mt-4 h-10 w-full rounded-full sm:mt-0 sm:w-32" />
        </div>
      </div>
    </div>
  );
}

// 서재 스켈레톤
export function LibrariesSkeleton() {
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

// 서머리 스켈레톤
export function SummarySkeleton() {
  return (
    <div className="border-t border-gray-100 bg-white">
      <div className="mx-auto w-full py-6">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className={`flex h-[110px] w-full flex-col items-center rounded-lg p-3 sm:h-[130px] sm:p-4 ${
                index === 0
                  ? 'bg-violet-50'
                  : index === 1
                    ? 'bg-purple-50'
                    : index === 2
                      ? 'bg-blue-50'
                      : index === 3
                        ? 'bg-amber-50'
                        : index === 4
                          ? 'bg-green-50'
                          : 'bg-teal-50'
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full sm:h-10 sm:w-10 ${
                  index === 0
                    ? 'bg-violet-200'
                    : index === 1
                      ? 'bg-purple-200'
                      : index === 2
                        ? 'bg-blue-200'
                        : index === 3
                          ? 'bg-amber-200'
                          : index === 4
                            ? 'bg-green-200'
                            : 'bg-teal-200'
                }`}
              >
                <Skeleton className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="mt-2 w-full text-center">
                <Skeleton className="mx-auto mb-1 h-6 w-12 sm:h-7" />
                <Skeleton className="mx-auto h-3 w-14 sm:h-3.5" />
              </div>
            </Skeleton>
          ))}
        </div>
      </div>
    </div>
  );
}

// 페이지 로딩 스켈레톤
export function PageSkeleton() {
  return (
    <div className="bg-white">
      <HeaderSkeleton />
      <SummarySkeleton />
      <div className="mx-auto w-full">
        {/* 각 섹션의 스켈레톤은 해당 페이지에서 직접 import하여 사용 */}
      </div>
    </div>
  );
}
