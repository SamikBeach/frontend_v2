'use client';

import {
  libraryCategoryFilterAtom,
  librarySearchQueryAtom,
  librarySortOptionAtom,
  libraryTimeRangeAtom,
} from '@/atoms/library';
import { Skeleton } from '@/components/ui/skeleton';
import { useQueryParams } from '@/hooks';
import { useAtom } from 'jotai';
import { Suspense, useEffect, useState } from 'react';
import { EmptyState } from './components/EmptyState';
import { FilterBar } from './components/FilterBar';
import { LibraryBreadcrumb } from './components/LibraryBreadcrumb';
import { LibraryCard } from './components/LibraryCard';
import { Pagination } from './components/Pagination';
import { SearchBar } from './components/SearchBar';
import { SortDropdown } from './components/SortDropdown';
import { sortOptions } from './data';
import { useLibraries } from './hooks/useLibraries';
import { usePagination } from './hooks/usePagination';
import { usePopularTags } from './hooks/usePopularTags';
import { Category, TimeRange } from './types';

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

function Libraries() {
  const { libraries } = useLibraries();
  const { tags: popularTags } = usePopularTags();
  const [categoryFilter, setCategoryFilter] = useAtom(
    libraryCategoryFilterAtom
  );
  const [sortOption, setSortOption] = useAtom(librarySortOptionAtom);
  const [timeRange, setTimeRange] = useAtom(libraryTimeRangeAtom);
  const [searchQuery, setSearchQuery] = useAtom(librarySearchQueryAtom);
  const [currentPage, setCurrentPage] = useState(1);

  const { updateQueryParams } = useQueryParams();

  // 페이지네이션 설정
  const ITEMS_PER_PAGE = 12;
  const pagination = usePagination({
    initialPage: currentPage,
    pageSize: ITEMS_PER_PAGE,
    totalItems: libraries.length,
  });

  // 현재 페이지 아이템만 가져오기
  const pagedLibraries = pagination.getItemsForPage(libraries);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    pagination.setPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // URL 쿼리 파라미터 업데이트
  useEffect(() => {
    updateQueryParams({
      category: categoryFilter,
      sort: sortOption,
      timeRange,
      q: searchQuery || undefined,
      page: currentPage > 1 ? currentPage.toString() : undefined,
    });
  }, [
    categoryFilter,
    sortOption,
    timeRange,
    searchQuery,
    currentPage,
    updateQueryParams,
  ]);

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (categoryId: string) => {
    setCategoryFilter(categoryId);
  };

  // 정렬 옵션 변경 핸들러
  const handleSortChange = (sortId: string) => {
    setSortOption(sortId);
  };

  // 기간 필터 변경 핸들러
  const handleTimeRangeChange = (timeRange: TimeRange) => {
    setTimeRange(timeRange);
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 인기 태그에서 카테고리 생성
  const categories: Category[] = [
    // "전체" 카테고리
    {
      id: 'all',
      name: '전체',
      color: '#E2E8F0',
    },
    // 인기 태그 기반 카테고리
    ...(popularTags || []).map((tag, index) => ({
      id: tag.name,
      name: tag.name,
      color: getTagColor(index),
    })),
  ];

  return (
    <>
      <div className="flex w-full flex-col">
        {/* 브레드크럼 */}
        <div className="mb-4 px-4">
          <LibraryBreadcrumb />
        </div>

        {/* 필터 바 및 검색/정렬 영역 */}
        <div className="mb-6 flex flex-wrap items-center justify-between px-4">
          <div className="flex-1">
            <FilterBar
              categories={categories}
              selectedCategory={categoryFilter}
              onCategoryClick={handleCategoryClick}
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <SearchBar value={searchQuery} onChange={handleSearchChange} />
            <SortDropdown
              selectedSort={sortOption}
              onSortChange={handleSortChange}
              sortOptions={sortOptions}
              selectedTimeRange={timeRange}
              onTimeRangeChange={handleTimeRangeChange}
            />
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 px-4">
          {/* 서재 목록 */}
          {libraries.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {pagedLibraries.map(library => (
                  <LibraryCard key={library.id} library={library} />
                ))}
              </div>

              {/* 페이지네이션 */}
              {pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <EmptyState
              searchQuery={searchQuery}
              selectedCategory={categoryFilter}
            />
          )}
        </div>
      </div>
    </>
  );
}

// 태그 색상 배열 - 파스텔톤
const TAG_COLORS = [
  '#FFF8E2', // 파스텔 옐로우
  '#F2E2FF', // 파스텔 퍼플
  '#FFE2EC', // 파스텔 코럴
  '#E2FFFC', // 파스텔 민트
  '#E2F0FF', // 파스텔 블루
  '#FFECDA', // 파스텔 오렌지
  '#ECFFE2', // 파스텔 그린
  '#FFE2F7', // 파스텔 핑크
];

// 태그 인덱스에 따른 색상 반환
function getTagColor(index: number): string {
  return TAG_COLORS[index % TAG_COLORS.length];
}

// 메인 페이지 컴포넌트
export default function LibrariesPage() {
  return (
    <div className="min-h-screen w-full bg-white">
      {/* CSS 스타일 추가 */}
      <style dangerouslySetInnerHTML={{ __html: noScrollbarStyles }} />

      <Suspense
        fallback={
          <div className="mx-auto flex w-full flex-col">
            {/* 브레드크럼 스켈레톤 */}
            <div className="mb-4 px-4">
              <Skeleton className="h-6 w-32" />
            </div>

            {/* 필터 바 및 검색/정렬 영역 스켈레톤 */}
            <div className="mb-6 flex flex-wrap items-center justify-between px-4">
              <div className="flex-1">
                <div className="no-scrollbar flex gap-2 overflow-x-auto py-1">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-9 w-20 rounded-full" />
                  ))}
                </div>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <Skeleton className="h-10 w-56 rounded-xl" />
                <Skeleton className="h-10 w-32 rounded-lg" />
              </div>
            </div>

            {/* 서재 카드 스켈레톤 */}
            <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <LibraryCardSkeleton key={index} />
              ))}
            </div>
          </div>
        }
      >
        <Libraries />
      </Suspense>
    </div>
  );
}
