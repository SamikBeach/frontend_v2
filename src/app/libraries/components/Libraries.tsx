'use client';

import { Clock, Flame, Library } from 'lucide-react';
import { useLibraries } from '../hooks/useLibraries';
import { SortOption } from '../types';
import { FilterBar } from './FilterBar';
import { LibraryBreadcrumb } from './LibraryBreadcrumb';
import { LibraryList, LibraryListSkeleton } from './LibraryListWithPagination';
import { SearchBar } from './SearchBar';
import { SortDropdown } from './SortDropdown';

// 정렬 옵션 정의
const sortOptions: SortOption[] = [
  {
    id: 'popular',
    label: '인기순',
    icon: <Flame className="h-4 w-4" />,
  },
  {
    id: 'books',
    label: '담긴 책 많은 순',
    icon: <Library className="h-4 w-4" />,
  },
  {
    id: 'latest',
    label: '최신순',
    icon: <Clock className="h-4 w-4" />,
  },
];

export function Libraries() {
  const {
    libraries,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    categoryFilter,
    sortOption,
    timeRange,
    searchQuery,
    handleSortChange,
    handleTimeRangeChange,
    handleSearchChange,
  } = useLibraries();

  return (
    <>
      {/* 브레드크럼 */}
      <div className="mx-auto w-full px-4 py-2">
        <LibraryBreadcrumb />
      </div>

      {/* 필터 영역 - 스크롤 시 상단에 고정 */}
      <div className="sticky top-[56px] z-30 bg-white">
        <div className="mx-auto w-full px-4 py-2">
          <div className="relative">
            {/* xl 이상 화면에서 보이는 검색바와 정렬 버튼 */}
            <div className="hidden xl:absolute xl:top-0 xl:right-0 xl:flex xl:items-center xl:gap-4">
              <SearchBar
                onSearchChange={handleSearchChange}
                value={searchQuery}
              />
              <SortDropdown
                selectedSort={sortOption}
                onSortChange={handleSortChange}
                sortOptions={sortOptions}
                selectedTimeRange={timeRange}
                onTimeRangeChange={handleTimeRangeChange}
              />
            </div>

            <div className="flex flex-col gap-4">
              <FilterBar />
              {/* xl 미만 화면에서 보이는 검색바와 정렬 버튼 */}
              <div className="flex items-center gap-4 xl:hidden">
                <div className="flex-1">
                  <SearchBar
                    onSearchChange={handleSearchChange}
                    value={searchQuery}
                  />
                </div>
                <SortDropdown
                  selectedSort={sortOption}
                  onSortChange={handleSortChange}
                  sortOptions={sortOptions}
                  selectedTimeRange={timeRange}
                  onTimeRangeChange={handleTimeRangeChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="px-4">
        {/* 서재 목록 */}
        {isLoading ? (
          <LibraryListSkeleton />
        ) : (
          <LibraryList
            libraries={libraries}
            categoryFilter={categoryFilter}
            searchQuery={searchQuery}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        )}
      </div>
    </>
  );
}
