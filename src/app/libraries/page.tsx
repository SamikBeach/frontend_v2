'use client';

import { useMemo, useState } from 'react';

import { useUrlParams } from '@/hooks';

// 분리된 데이터와 컴포넌트 가져오기
import { EmptyState } from './components/EmptyState';
import { FilterBar } from './components/FilterBar';
import { LibraryCard } from './components/LibraryCard';
import { SearchBar } from './components/SearchBar';
import { SortDropdown } from './components/SortDropdown';
import { libraries, libraryCategories, sortOptions } from './data';
import { TimeRange } from './types';

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

// 기간별 필터링을 위한 날짜 계산 함수
const getDateFromTimeRange = (timeRange: TimeRange): Date | null => {
  const now = new Date();

  switch (timeRange) {
    case 'today':
      // 오늘 00:00:00 시간으로 설정
      now.setHours(0, 0, 0, 0);
      return now;
    case 'week':
      // 이번 주 일요일로 설정 (0: 일요일, 1: 월요일, ..., 6: 토요일)
      now.setDate(now.getDate() - now.getDay());
      now.setHours(0, 0, 0, 0);
      return now;
    case 'month':
      // 이번 달 1일로 설정
      now.setDate(1);
      now.setHours(0, 0, 0, 0);
      return now;
    case 'year':
      // 올해 1월 1일로 설정
      now.setMonth(0, 1);
      now.setHours(0, 0, 0, 0);
      return now;
    default:
      // 'all'인 경우 null 반환
      return null;
  }
};

// 메인 페이지 컴포넌트
export default function LibrariesPage() {
  // URL 파라미터 관리
  const { params, setParam } = useUrlParams({
    defaultValues: {
      category: 'all', // all, philosophy, literature, history, science
      sort: 'popular', // popular, latest, title
      timeRange: 'all', // all, today, week, month, year
    },
  });

  const selectedCategory = params.category || 'all';
  const selectedSort = params.sort || 'popular';
  const selectedTimeRange = (params.timeRange as TimeRange) || 'all';
  const [searchQuery, setSearchQuery] = useState('');

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (categoryId: string) => {
    setParam('category', categoryId);
  };

  // 정렬 옵션 클릭 핸들러
  const handleSortChange = (sortId: string) => {
    setParam('sort', sortId);
  };

  // 기간 필터 변경 핸들러
  const handleTimeRangeChange = (timeRange: TimeRange) => {
    setParam('timeRange', timeRange);
  };

  // 필터링 로직
  let filteredLibraries = libraries;

  // 카테고리 필터링
  if (selectedCategory !== 'all') {
    filteredLibraries = libraries.filter(
      library => library.category === selectedCategory
    );
  }

  // 검색 필터링
  if (searchQuery) {
    filteredLibraries = filteredLibraries.filter(
      library =>
        library.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        library.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        library.tags.some(tag =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }

  // 기간별 필터링 (인기순 정렬일 때만)
  if (selectedSort === 'popular' && selectedTimeRange !== 'all') {
    const cutoffDate = getDateFromTimeRange(selectedTimeRange);
    if (cutoffDate) {
      filteredLibraries = filteredLibraries.filter(library => {
        const libraryDate = new Date(library.timestamp);
        return libraryDate >= cutoffDate;
      });
    }
  }

  // 정렬 로직
  const sortedLibraries = useMemo(() => {
    const currentSortOption =
      sortOptions.find(option => option.id === selectedSort) || sortOptions[0];
    return [...filteredLibraries].sort(currentSortOption.sortFn);
  }, [filteredLibraries, selectedSort]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: noScrollbarStyles }} />
      <div className="min-h-screen w-full bg-white">
        <div className="flex w-full flex-col">
          {/* 필터 바 및 검색/정렬 영역 */}
          <div className="mb-6 flex flex-wrap items-center justify-between px-4">
            <div className="flex-1">
              <FilterBar
                categories={libraryCategories}
                selectedCategory={selectedCategory}
                onCategoryClick={handleCategoryClick}
              />
            </div>
            <div className="ml-auto flex items-center gap-3">
              <SearchBar
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <SortDropdown
                selectedSort={selectedSort}
                onSortChange={handleSortChange}
                sortOptions={sortOptions}
                selectedTimeRange={selectedTimeRange}
                onTimeRangeChange={handleTimeRangeChange}
              />
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="flex-1 px-4">
            {/* 서재 목록 */}
            {sortedLibraries.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {sortedLibraries.map(library => (
                  <LibraryCard key={library.id} library={library} />
                ))}
              </div>
            ) : (
              <EmptyState
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
