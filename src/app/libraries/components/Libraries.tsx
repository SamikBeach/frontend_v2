'use client';

import { LibrarySummary } from '@/apis/library/types';
import { BookOpen, Clock, Users } from 'lucide-react';
import { Suspense } from 'react';
import { useLibraries } from '../hooks/useLibraries';
import { SortOption } from '../types';
import { FilterBar } from './FilterBar';
import { LibraryBreadcrumb } from './LibraryBreadcrumb';
import { LibraryCardSkeleton } from './LibraryCardSkeleton';
import { LibraryListWithPagination } from './LibraryListWithPagination';
import { SearchBar } from './SearchBar';
import { SortDropdown } from './SortDropdown';

// 정렬 옵션 정의
const sortOptions: SortOption[] = [
  {
    id: 'popular',
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
    id: 'latest',
    label: '최신순',
    icon: <Clock className="h-4 w-4" />,
    sortFn: (a: LibrarySummary, b: LibrarySummary) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  },
];

export function Libraries() {
  const {
    libraries,
    categoryFilter,
    sortOption,
    timeRange,
    searchQuery,
    currentPage,
    setCurrentPage,
    handleSortChange,
    handleTimeRangeChange,
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
              <SearchBar />
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
                  <SearchBar />
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
        <Suspense fallback={<LibraryListSkeleton />}>
          <LibraryListWithPagination
            libraries={libraries}
            categoryFilter={categoryFilter}
            searchQuery={searchQuery}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </Suspense>
      </div>
    </>
  );
}

// 서재 카드 그리드 로딩 스켈레톤
function LibraryListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <LibraryCardSkeleton key={index} />
      ))}
    </div>
  );
}
