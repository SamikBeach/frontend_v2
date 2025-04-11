'use client';

import { LibrarySummary } from '@/apis/library/types';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Clock, Users } from 'lucide-react';
import { Suspense } from 'react';
import { Libraries } from './components/Libraries';
import { SortOption } from './types';

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

// 정렬 옵션 정의
const sortOptions: SortOption[] = [
  {
    id: 'subscribers',
    label: '구독자순',
    icon: <Users className="h-4 w-4" />,
    sortFn: (a: LibrarySummary, b: LibrarySummary) =>
      b.subscriberCount - a.subscriberCount,
  },
  {
    id: 'books',
    label: '도서순',
    icon: <BookOpen className="h-4 w-4" />,
    sortFn: (a: LibrarySummary, b: LibrarySummary) => b.bookCount - a.bookCount,
  },
  {
    id: 'created',
    label: '최신순',
    icon: <Clock className="h-4 w-4" />,
    sortFn: (a: LibrarySummary, b: LibrarySummary) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  },
];

// 라이브러리 카드 로딩 스켈레톤
function LibraryCardSkeleton() {
  return (
    <div className="group h-full rounded-xl border-none bg-[#F9FAFB] p-5 shadow-none">
      <div className="mb-3 flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div>
          <Skeleton className="mb-1 h-4 w-40" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="mb-4 h-10 w-full" />
      <div className="grid grid-cols-2 gap-2.5">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </div>
  );
}

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
