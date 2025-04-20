import { Skeleton } from '@/components/ui/skeleton';
import { FC } from 'react';

export const LibrarySidebarSkeleton: FC = () => {
  return (
    <div className="space-y-6">
      {/* 서재 소유자 정보 스켈레톤 */}
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="mt-1 h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>
      </div>

      {/* 서재 정보 스켈레톤 */}
      <div className="rounded-xl bg-gray-50 p-4">
        <Skeleton className="mb-3 h-5 w-24" />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </div>

      {/* 구독자 미리보기 스켈레톤 */}
      <div className="rounded-xl bg-gray-50 p-4">
        <Skeleton className="h-5 w-16" />
        <div className="mt-3 space-y-3">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <div className="flex-1"></div>
                <Skeleton className="h-7 w-16 rounded-full" />
              </div>
            ))}
        </div>
      </div>

      {/* 업데이트 알림 섹션 스켈레톤 */}
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="mb-3 flex items-center">
          <Skeleton className="mr-2 h-4 w-4" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="space-y-3">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="mb-2 rounded-md bg-white p-3 last:mb-0"
              >
                <div className="flex flex-col">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="mt-1 h-3 w-1/3" />
                </div>
              </div>
            ))}
        </div>
        <Skeleton className="mt-4 h-10 w-full rounded-lg" />
      </div>
    </div>
  );
};
