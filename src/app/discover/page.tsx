'use client';

import {
  PopularBooksSortOptions,
  SortOption,
  TimeRange,
  TimeRangeOptions,
} from '@/apis/book/types';
import { selectedBookIdAtom } from '@/atoms/book';
import {
  discoverCategoryFilterAtom,
  discoverSortOptionAtom,
  discoverSubcategoryFilterAtom,
  discoverTimeRangeAtom,
} from '@/atoms/discover';
import { Skeleton } from '@/components/ui/skeleton';
import { useQueryParams } from '@/hooks';
import { useIsMobile } from '@/hooks/use-mobile';
import { isValidSortOption, isValidTimeRange } from '@/utils/type-guards';
import { useSetAtom } from 'jotai';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

import {
  AdminBookManageButton,
  BooksContent,
  CategoryFilter,
  CategoryFilterSkeleton,
  DiscoverBreadcrumb,
  DiscoverSortDropdown,
} from './components';

// 스크롤바 숨기는 CSS 추가
const noScrollbarStyles = `
  /* 스크롤바 숨김 */
  .no-scrollbar::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
  }

  .no-scrollbar {
    -ms-overflow-style: none !important;
    scrollbar-width: none !important;
  }

  /* 모바일 환경에서 스크롤바 추가 숨김 처리 */
  * {
    -webkit-overflow-scrolling: touch;
  }

  /* 모바일 환경에서 추가 스크롤바 숨김 처리 */
  @media (max-width: 768px) {
    .overflow-x-auto::-webkit-scrollbar,
    div::-webkit-scrollbar {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
    }
    
    .overflow-x-auto,
    div.overflow-x-auto {
      -ms-overflow-style: none !important;
      scrollbar-width: none !important;
      -webkit-overflow-scrolling: touch;
    }
  }
`;

// 책 컨텐츠 로딩 스켈레톤
function BooksLoading() {
  const isMobile = useIsMobile();

  return (
    <div
      className={`grid gap-4 ${
        isMobile
          ? 'grid-cols-2'
          : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
      }`}
    >
      {[...Array(12)].map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="aspect-[3/4] w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

// 카테고리 필터 로딩 스켈레톤 컴포넌트 제거 - 이제 CategoryFilter에서 import함

export default function DiscoverPage() {
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const { updateQueryParams } = useQueryParams();

  // Atom setters
  const setCategoryFilter = useSetAtom(discoverCategoryFilterAtom);
  const setSubcategoryFilter = useSetAtom(discoverSubcategoryFilterAtom);
  const setSortOption = useSetAtom(discoverSortOptionAtom);
  const setTimeRange = useSetAtom(discoverTimeRangeAtom);
  const setSelectedBookId = useSetAtom(selectedBookIdAtom);

  // URL 파라미터에서 필터 상태 초기화
  useEffect(() => {
    const category = searchParams.get('category') || 'all';
    const subcategory = searchParams.get('subcategory') || 'all';
    const sortValue = searchParams.get('sort') || 'reviews-desc';
    const sort: SortOption = isValidSortOption(sortValue)
      ? sortValue
      : PopularBooksSortOptions.REVIEWS_DESC;

    const timeRangeValue = searchParams.get('timeRange') || 'all';
    const timeRange: TimeRange = isValidTimeRange(timeRangeValue)
      ? timeRangeValue
      : TimeRangeOptions.ALL;

    const bookId = searchParams.get('book');

    setCategoryFilter(category);
    setSubcategoryFilter(subcategory);
    setSortOption(sort);
    setTimeRange(timeRange);
    if (bookId) setSelectedBookId(bookId);

    // URL 파라미터 동기화
    updateQueryParams({
      category,
      subcategory,
      sort,
      timeRange,
      book: bookId || undefined,
    });
  }, [
    searchParams,
    updateQueryParams,
    setCategoryFilter,
    setSubcategoryFilter,
    setSortOption,
    setTimeRange,
    setSelectedBookId,
  ]);

  return (
    <div className="bg-white pb-6">
      {/* CSS 스타일 추가 */}
      <style dangerouslySetInnerHTML={{ __html: noScrollbarStyles }} />

      {/* 브레드크럼 */}
      <div className="mx-auto w-full px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Suspense fallback={<div className="h-6" />}>
              <DiscoverBreadcrumb />
            </Suspense>
          </div>

          {/* 관리자 버튼 */}
          <AdminBookManageButton />
        </div>
      </div>

      {/* 필터 영역 - 스크롤 시 상단에 고정 */}
      <div className={`sticky top-[56px] z-30 bg-white`}>
        {/* 카테고리 필터와 정렬 옵션 */}
        <div className={`mx-auto w-full ${isMobile ? 'px-1' : 'px-4'} py-2`}>
          <div className="relative">
            {/* xl 이상 화면에서만 보이는 정렬 버튼 (오른쪽 위치) */}
            <div className="hidden xl:absolute xl:top-0 xl:right-0 xl:block">
              <DiscoverSortDropdown />
            </div>

            <div className="flex flex-col gap-2">
              {/* 카테고리 필터 - 로딩 상태일 때 스켈레톤 표시 */}
              <Suspense fallback={<CategoryFilterSkeleton />}>
                <CategoryFilter className="w-full" />
              </Suspense>

              {/* xl 미만 화면에서 보이는 정렬 버튼 */}
              <div className="w-full xl:hidden">
                <DiscoverSortDropdown className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 도서 목록 - 로딩 상태일 때 스켈레톤 표시 */}
      <div className={`mx-auto w-full ${isMobile ? 'px-1' : 'px-4'} pt-4`}>
        <Suspense fallback={<BooksLoading />}>
          <BooksContent />
        </Suspense>
      </div>
    </div>
  );
}
