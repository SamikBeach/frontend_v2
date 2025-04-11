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
import { Suspense } from 'react';
import { EmptyState } from '../libraries/components/EmptyState';
import { FilterBar } from '../libraries/components/FilterBar';
import { LibraryCard } from '../libraries/components/LibraryCard';
import { SearchBar } from '../libraries/components/SearchBar';
import { SortDropdown } from '../libraries/components/SortDropdown';
import { libraryCategories, sortOptions } from '../libraries/data';
import { useLibraries } from '../libraries/hooks/useLibraries';
import { TimeRange } from '../libraries/types';

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
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-24 w-full rounded-md" />
        <Skeleton className="h-24 w-full rounded-md" />
      </div>
    </div>
  );
}

function Libraries() {
  const { libraries } = useLibraries();
  const [categoryFilter, setCategoryFilter] = useAtom(
    libraryCategoryFilterAtom
  );
  const [sortOption, setSortOption] = useAtom(librarySortOptionAtom);
  const [timeRange, setTimeRange] = useAtom(libraryTimeRangeAtom);
  const [searchQuery, setSearchQuery] = useAtom(librarySearchQueryAtom);
  const { updateQueryParams } = useQueryParams();

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (categoryId: string) => {
    setCategoryFilter(categoryId);
    updateQueryParams({ category: categoryId });
  };

  // 정렬 옵션 클릭 핸들러
  const handleSortChange = (sortId: string) => {
    setSortOption(sortId);
    updateQueryParams({ sort: sortId });
  };

  // 기간 필터 변경 핸들러
  const handleTimeRangeChange = (timeRange: TimeRange) => {
    setTimeRange(timeRange);
    updateQueryParams({ timeRange });
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <div className="flex w-full flex-col">
        {/* 필터 바 및 검색/정렬 영역 */}
        <div className="mb-6 flex flex-wrap items-center justify-between px-4">
          <div className="flex-1">
            <FilterBar
              categories={libraryCategories}
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {libraries.map(library => (
                <LibraryCard key={library.id} library={library} />
              ))}
            </div>
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

// 메인 페이지 컴포넌트
export default function LibraryPage() {
  return (
    <div className="min-h-screen w-full bg-white">
      {/* CSS 스타일 추가 */}
      <style dangerouslySetInnerHTML={{ __html: noScrollbarStyles }} />

      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border-none bg-[#F9FAFB] p-5 shadow-none"
              >
                <LibraryCardSkeleton />
              </div>
            ))}
          </div>
        }
      >
        <Libraries />
      </Suspense>
    </div>
  );
}
