'use client';

import {
  PopularBooksSortOptions,
  SortOption,
  TimeRange,
  TimeRangeOptions,
} from '@/apis/book/types';
import { selectedBookIdAtom } from '@/atoms/book';
import {
  categoryFilterAtom,
  sortOptionAtom,
  subcategoryFilterAtom,
  timeRangeAtom,
} from '@/atoms/popular';
import { Skeleton } from '@/components/ui/skeleton';
import { useQueryParams } from '@/hooks';
import { isValidSortOption, isValidTimeRange } from '@/utils/type-guards';
import { useSetAtom } from 'jotai';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  BooksContent,
  CategoryFilter,
  PopularBreadcrumb,
  PopularSortDropdown,
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
  return (
    <div className="flex h-[calc(100vh-250px)] w-full items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}

// 카테고리 필터 로딩 스켈레톤
function CategoryFilterSkeleton() {
  return (
    <div className="w-full max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)]">
      <div className="no-scrollbar w-full pt-0.5 pb-0.5 md:mb-2 md:pt-1 md:pb-1">
        <div className="flex gap-1.5 md:gap-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-8 w-16 rounded-full md:h-9 md:w-20"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// 기본값 상수 정의
const DEFAULT_CATEGORY = 'all';
const DEFAULT_SUBCATEGORY = 'all';
const DEFAULT_SORT = PopularBooksSortOptions.RATING_DESC;
const DEFAULT_TIME_RANGE = TimeRangeOptions.ALL;

export default function PopularPage() {
  const searchParams = useSearchParams();
  const { updateQueryParams, clearQueryParams } = useQueryParams();

  // Atom setters
  const setCategoryFilter = useSetAtom(categoryFilterAtom);
  const setSubcategoryFilter = useSetAtom(subcategoryFilterAtom);
  const setSortOption = useSetAtom(sortOptionAtom);
  const setTimeRange = useSetAtom(timeRangeAtom);
  const setSelectedBookId = useSetAtom(selectedBookIdAtom);

  // URL 파라미터에서 필터 상태 초기화
  useEffect(() => {
    const category = searchParams.get('category') || DEFAULT_CATEGORY;
    const subcategory = searchParams.get('subcategory') || DEFAULT_SUBCATEGORY;
    const sortValue = searchParams.get('sort') || DEFAULT_SORT;
    const sort: SortOption = isValidSortOption(sortValue)
      ? sortValue
      : DEFAULT_SORT;

    const timeRangeValue = searchParams.get('timeRange') || DEFAULT_TIME_RANGE;
    const timeRange: TimeRange = isValidTimeRange(timeRangeValue)
      ? timeRangeValue
      : DEFAULT_TIME_RANGE;

    const bookId = searchParams.get('book');

    // Atoms 업데이트
    setCategoryFilter(category);
    setSubcategoryFilter(subcategory);
    setSortOption(sort);
    setTimeRange(timeRange);
    if (bookId) setSelectedBookId(bookId);
  }, [
    searchParams,
    updateQueryParams,
    clearQueryParams,
    setCategoryFilter,
    setSubcategoryFilter,
    setSortOption,
    setTimeRange,
    setSelectedBookId,
  ]);

  return (
    <div className="w-full bg-white pb-1">
      {/* CSS 스타일 추가 */}
      <style dangerouslySetInnerHTML={{ __html: noScrollbarStyles }} />

      {/* 필터 영역 및 브레드크럼 - 스크롤 시 상단에 고정 */}
      <div className={`sticky top-[56px] z-30 w-full bg-white`}>
        {/* 브레드크럼 */}
        <div className="mx-auto w-full px-3 py-2 sm:px-4 sm:py-2 sm:pt-4">
          <Suspense fallback={<div className="h-5 md:h-6" />}>
            <PopularBreadcrumb />
          </Suspense>
        </div>

        {/* 카테고리 필터와 정렬 옵션 */}
        <div className="mx-auto w-full py-0.5 sm:px-4 sm:py-1">
          <div className="relative w-full">
            {/* 정렬 버튼과 카테고리 필터 배치 */}
            <div className="flex w-full items-start justify-between">
              {/* 카테고리 필터 - 로딩 상태일 때 스켈레톤 표시 */}
              <Suspense fallback={<CategoryFilterSkeleton />}>
                <CategoryFilter className="w-full max-w-[100vw] pl-2" />
              </Suspense>
              <div className="ml-4 hidden flex-shrink-0 xl:block">
                <PopularSortDropdown />
              </div>
            </div>

            {/* xl 미만 화면에서 보이는 정렬 버튼 */}
            <div className="w-full xl:hidden">
              <PopularSortDropdown className="w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* 도서 목록 - 로딩 상태일 때 스켈레톤 표시 */}
      <div className="mx-auto w-full px-2 pt-1 sm:px-4">
        <Suspense fallback={<BooksLoading />}>
          <BooksContent />
        </Suspense>
      </div>
    </div>
  );
}
