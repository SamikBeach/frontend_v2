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
import {
  useCategories,
  useFilterScrollVisibility,
  useQueryParams,
} from '@/hooks';
import { isValidSortOption, isValidTimeRange } from '@/utils/type-guards';
import { useAtom, useSetAtom } from 'jotai';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

import {
  BooksContent,
  CategoryFilter,
  PopularBreadcrumb,
  PopularSortDropdown,
} from './components';

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

// 도서 목록 스켈레톤 컴포넌트 (실제 컨텐츠 크기에 맞춤)
function BooksGridSkeleton() {
  return (
    <>
      {/* 모바일: horizontal 카드 스켈레톤 */}
      <div className="flex flex-col gap-4 px-0.5 py-1 md:hidden">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex w-full">
            <div className="h-auto w-32 flex-shrink-0">
              <div className="relative aspect-[3/4.5] w-full overflow-hidden rounded-md bg-gray-50">
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

export default function PopularPage() {
  const searchParams = useSearchParams();
  const { updateQueryParams, clearQueryParams } = useQueryParams();

  // 필터 스크롤 가시성 훅 추가
  const [showFilter] = useFilterScrollVisibility();

  // Atom setters
  const setCategoryFilter = useSetAtom(categoryFilterAtom);
  const setSubcategoryFilter = useSetAtom(subcategoryFilterAtom);
  const setSortOption = useSetAtom(sortOptionAtom);
  const setTimeRange = useSetAtom(timeRangeAtom);
  const setSelectedBookId = useSetAtom(selectedBookIdAtom);

  // 현재 선택된 카테고리와 서브카테고리 상태 추가
  const [categoryFilter] = useAtom(categoryFilterAtom);

  // 카테고리 데이터 가져오기
  const categories = useCategories();

  // 서브카테고리가 활성화되었는지 확인하는 함수
  const hasActiveSubcategories = () => {
    // 카테고리가 'all'이면 서브카테고리 없음
    if (categoryFilter === 'all') return false;

    // 선택된 카테고리 찾기 (문자열 ID로 비교)
    const selectedCategory = categories.find(
      category => category.id === categoryFilter
    );

    // 선택된 카테고리에 활성화된 서브카테고리가 있는지 확인
    return (
      selectedCategory?.subcategories &&
      selectedCategory.subcategories.length > 0
    );
  };

  // 동적 패딩 계산
  const getContentPadding = () => {
    if (hasActiveSubcategories()) {
      return 'pt-[170px]'; // 기본 높이 + 서브카테고리 높이
    }
    return 'pt-[130px]'; // 기본 높이
  };

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

    // 필터나 정렬이 변경되었을 때 스크롤 위치를 맨 위로 이동
    // 초기 로드가 아닌 경우에만 스크롤 이동
    const isInitialLoad = !searchParams.toString();
    if (!isInitialLoad) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
      {/* 필터 영역 및 브레드크럼 - 모바일에서 스크롤에 따라 보임/숨김 */}
      <div
        className={`w-full bg-white transition-transform duration-300 sm:translate-y-0 md:sticky md:top-[56px] md:z-30 ${
          showFilter ? 'translate-y-0' : '-translate-y-[150%]'
        } fixed top-[56px] right-0 left-0 z-30 sm:relative sm:top-0`}
      >
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
                <CategoryFilter className="w-full max-w-[100vw]" />
              </Suspense>
              <div className="ml-4 hidden flex-shrink-0 items-center xl:flex">
                <PopularSortDropdown />
              </div>
            </div>

            {/* xl 미만 화면에서 보이는 정렬 버튼 */}
            <div className="w-full xl:hidden">
              <PopularSortDropdown className="w-full justify-start" />
            </div>
          </div>
        </div>
      </div>

      {/* 도서 목록 - 모바일에서 필터 높이만큼 상단 여백 추가 (서브카테고리 고려) */}
      <div
        className={`mx-auto w-full px-2 ${getContentPadding()} sm:px-4 sm:pt-1`}
      >
        <Suspense fallback={<BooksGridSkeleton />}>
          <BooksContent />
        </Suspense>
      </div>
    </div>
  );
}
