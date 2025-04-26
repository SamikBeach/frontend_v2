'use client';

import { Clock, Flame, Library } from 'lucide-react';
import { useLibraries } from '../hooks/useLibraries';
import { SortOption } from '../types';
import { Header } from './Header';
import { LibraryList, LibraryListSkeleton } from './LibraryList';

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
    tagFilter,
    sortOption,
    timeRange,
    searchQuery,
    handleSortChange,
    handleTimeRangeChange,
    handleSearchChange,
  } = useLibraries();

  return (
    <>
      {/* Header 컴포넌트로 필터 영역 분리 */}
      <Header
        sortOption={sortOption}
        sortOptions={sortOptions}
        searchQuery={searchQuery}
        timeRange={timeRange}
        onSortChange={handleSortChange}
        onTimeRangeChange={handleTimeRangeChange}
        onSearchChange={handleSearchChange}
      />

      {/* 메인 콘텐츠 */}
      <div className="p-4">
        {/* 서재 목록 */}
        {isLoading ? (
          <LibraryListSkeleton />
        ) : (
          <LibraryList
            libraries={libraries}
            tagFilter={tagFilter}
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
