'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import { Libraries } from './components/Libraries';

// 스크롤바 숨기는 CSS 추가
const noScrollbarStyles = `
  /* 스크롤바 숨김 */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// 로딩 상태를 위한 스켈레톤 컴포넌트
function LibrariesSkeleton() {
  return (
    <div className="mx-auto flex w-full flex-col">
      {/* 브레드크럼 스켈레톤 */}
      <div className="mx-auto w-full px-4 py-2">
        <Skeleton className="h-6 w-32" />
      </div>

      {/* 필터 바 및 검색/정렬 영역 스켈레톤 */}
      <div className="sticky top-[56px] z-30 bg-white">
        <div className="mx-auto w-full px-4 py-2">
          <div className="relative">
            <div className="hidden xl:absolute xl:top-0 xl:right-0 xl:flex xl:items-center xl:gap-4">
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="no-scrollbar flex gap-2 overflow-x-auto py-1">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-9 w-20 rounded-full" />
                ))}
              </div>
              <div className="w-full xl:hidden">
                <Skeleton className="h-10 w-32 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 서재 카드 스켈레톤 */}
      <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-[300px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트
export default function LibrariesPage() {
  return (
    <div className="min-h-screen w-full bg-white">
      {/* CSS 스타일 추가 */}
      <style dangerouslySetInnerHTML={{ __html: noScrollbarStyles }} />

      <Suspense fallback={<LibrariesSkeleton />}>
        <Libraries />
      </Suspense>
    </div>
  );
}
