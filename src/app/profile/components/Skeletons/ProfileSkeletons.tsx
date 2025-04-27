'use client';

import { LibraryCardSkeleton } from '@/components/LibraryCard';
import { Skeleton } from '@/components/ui/skeleton';

// 헤더 스켈레톤
export function HeaderSkeleton() {
  return (
    <div className="bg-white">
      <div className="mx-auto w-full px-4 pb-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
              <div className="mt-2 flex gap-3">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </div>
          <Skeleton className="mt-4 h-10 w-32 rounded-full sm:mt-0" />
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
      <div className="mx-auto w-full px-4 py-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className={`flex h-[133px] w-full flex-col items-center rounded-lg p-4 ${
                index === 0
                  ? 'bg-violet-100'
                  : index < 4
                    ? 'bg-gray-50'
                    : 'border border-gray-200 bg-white'
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  index === 0 ? 'bg-violet-200' : ''
                }`}
              >
                <Skeleton className="h-5 w-5" />
              </div>
              <div className="mt-2 w-full">
                <Skeleton className="mx-auto mb-1 h-6 w-1/2" />
                <Skeleton className="mx-auto h-4 w-2/3" />
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
      <div className="mx-auto w-full px-4">
        {/* 각 섹션의 스켈레톤은 해당 페이지에서 직접 import하여 사용 */}
      </div>
    </div>
  );
}
