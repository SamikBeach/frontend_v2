'use client';

import { TimeRangeOptions } from '@/apis/library/types';
import { useFilterScrollVisibility } from '@/hooks';
import { SortOption } from '../../types';
import { FilterBar, SearchBar, SortDropdown } from './';

interface HeaderProps {
  sortOption: string;
  sortOptions: SortOption[];
  searchQuery: string;
  timeRange: TimeRangeOptions;
  onSortChange: (id: string) => void;
  onTimeRangeChange: (range: TimeRangeOptions) => void;
  onSearchChange: (value: string) => void;
}

export function Header({
  sortOption,
  sortOptions,
  searchQuery,
  timeRange,
  onSortChange,
  onTimeRangeChange,
  onSearchChange,
}: HeaderProps) {
  // 필터 스크롤 가시성 훅 추가
  const [showFilter] = useFilterScrollVisibility();

  return (
    <div
      className={`bg-white transition-transform duration-300 sm:translate-y-0 md:sticky md:top-[56px] md:z-30 ${
        showFilter ? 'translate-y-0' : '-translate-y-[150%]'
      } fixed top-[56px] right-0 left-0 z-20 sm:relative sm:top-0`}
    >
      <div className="w-full pt-2 pb-1 md:px-4 md:pt-4 md:pb-2">
        <div className="relative">
          {/* 2xl 이상 화면에서 보이는 검색바와 정렬 버튼 */}
          <div className="hidden 2xl:absolute 2xl:top-0 2xl:right-0 2xl:flex 2xl:items-center 2xl:gap-4">
            <SearchBar value={searchQuery} onSearchChange={onSearchChange} />
            <SortDropdown
              selectedSort={sortOption}
              onSortChange={onSortChange}
              sortOptions={sortOptions}
              selectedTimeRange={timeRange}
              onTimeRangeChange={onTimeRangeChange}
            />
          </div>

          <div className="flex flex-col md:gap-4">
            <FilterBar />
            {/* 2xl 미만 화면에서 보이는 검색바와 정렬 버튼 */}
            <div className="flex items-center gap-2 px-2 2xl:hidden">
              <div className="flex-1">
                <SearchBar
                  value={searchQuery}
                  onSearchChange={onSearchChange}
                />
              </div>
              <SortDropdown
                selectedSort={sortOption}
                onSortChange={onSortChange}
                sortOptions={sortOptions}
                selectedTimeRange={timeRange}
                onTimeRangeChange={onTimeRangeChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
