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
import { useQueryParams } from '@/hooks';
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

// 도서 목록 스켈레톤 컴포넌트 (실제 컨텐츠 크기에 맞춤)
function BooksGridSkeleton() {
  return (
    <>
      {/* 모바일: horizontal 카드 스켈레톤 */}
      <div className="flex flex-col gap-4 px-0.5 py-1 md:hidden">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex w-full">
            <div className="h-[150px] w-32 flex-shrink-0">
              <div className="h-full w-full overflow-hidden rounded-md bg-gray-50">
                <div className="h-full w-full animate-pulse bg-gray-200" />
              </div>
            </div>
            <div className="flex h-full flex-1 flex-col justify-between px-2 py-0.5">
              <div>
                <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
                <div className="mt-1 h-4 w-[70%] animate-pulse rounded bg-gray-200" />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center gap-1">
                  <div className="h-[18px] w-[18px] animate-pulse rounded-full bg-gray-200" />
                  <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-[18px] w-[18px] animate-pulse rounded-full bg-gray-200" />
                  <div className="h-4 w-8 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 데스크톱: 그리드 카드 스켈레톤 */}
      <div className="hidden grid-cols-2 gap-3 sm:grid-cols-2 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 20 }).map((_, index) => (
          <div key={index} className="flex h-full w-full flex-col">
            <div className="h-full w-full">
              <div className="relative aspect-[3/4.5] w-full overflow-hidden rounded-md border border-gray-100 bg-gray-50">
                <div className="h-full w-full animate-pulse bg-gray-200" />
              </div>
              <div className="px-2.5 pt-2.5 pb-2.5">
                <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
                <div className="mt-1 h-4 w-[70%] animate-pulse rounded bg-gray-200" />
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="h-3.5 w-3.5 animate-pulse rounded-full bg-gray-200" />
                    <div className="h-3 w-12 animate-pulse rounded bg-gray-200" />
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3.5 w-3.5 animate-pulse rounded-full bg-gray-200" />
                    <div className="h-3 w-8 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// 기본값 상수 정의
const DEFAULT_CATEGORY = 'all';
const DEFAULT_SUBCATEGORY = 'all';
const DEFAULT_SORT = PopularBooksSortOptions.RATING_DESC;
const DEFAULT_TIME_RANGE = TimeRangeOptions.ALL;

export default function DiscoverPage() {
  const searchParams = useSearchParams();
  const { updateQueryParams, clearQueryParams } = useQueryParams();

  // Atom setters
  const setCategoryFilter = useSetAtom(discoverCategoryFilterAtom);
  const setSubcategoryFilter = useSetAtom(discoverSubcategoryFilterAtom);
  const setSortOption = useSetAtom(discoverSortOptionAtom);
  const setTimeRange = useSetAtom(discoverTimeRangeAtom);
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
      {/* 필터 영역 및 브레드크럼 - 모바일에선 상단 고정 해제, 데스크탑만 sticky */}
      <div className="w-full bg-white md:sticky md:top-[56px] md:z-30">
        {/* 브레드크럼 */}
        <div className="mx-auto w-full px-3 py-2 sm:px-4 sm:py-2 sm:pt-4">
          <Suspense fallback={<div className="h-5 md:h-6" />}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <DiscoverBreadcrumb />
              </div>
              {/* 관리자 버튼 삭제 (아래에 고정 배치로 이동) */}
            </div>
          </Suspense>
        </div>

        {/* 카테고리 필터와 정렬 옵션 */}
        <div className="mx-auto w-full py-0.5 sm:px-4 sm:py-1">
          <div className="relative w-full">
            {/* 정렬 버튼과 카테고리 필터 배치 */}
            <div className="flex w-full items-start justify-between">
              {/* 카테고리 필터 - 로딩 상태일 때 스켈레톤 표시 */}
              <Suspense fallback={<CategoryFilterSkeleton />}>
                <CategoryFilter className="w-full max-w-[100vw]" />
              </Suspense>
              <div className="ml-4 hidden flex-shrink-0 items-center xl:flex">
                <DiscoverSortDropdown />
              </div>
            </div>

            {/* xl 미만 화면에서 보이는 정렬 버튼 */}
            <div className="w-full xl:hidden">
              <DiscoverSortDropdown className="w-full justify-start" />
            </div>
          </div>
        </div>
      </div>

      {/* 도서 목록 - 프로필 페이지와 동일한 Suspense 구조 */}
      <div className="mx-auto w-full px-2 pt-1 sm:px-4">
        <Suspense fallback={<BooksGridSkeleton />}>
          <BooksContent />
        </Suspense>
      </div>

      {/* 발견하기 도서관리 버튼을 우하단에 고정 - 모바일에서는 BottomNav 위로 */}
      <div className="fixed right-6 bottom-20 z-50 md:bottom-6">
        <AdminBookManageButton />
      </div>
    </div>
  );
}
