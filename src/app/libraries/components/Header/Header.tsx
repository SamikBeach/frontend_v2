'use client';

import { TimeRange } from '@/apis/book/types';
import { SortOption } from '../../types';
import { FilterBar, SearchBar, SortDropdown } from './';

interface HeaderProps {
  sortOption: string;
  sortOptions: SortOption[];
  searchQuery: string;
  timeRange: TimeRange;
  onSortChange: (id: string) => void;
  onTimeRangeChange: (range: TimeRange) => void;
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
  return (
    <div className="sticky top-[56px] z-30 bg-white">
      <div className="mx-auto w-full p-4">
        <div className="relative">
          {/* xl 이상 화면에서 보이는 검색바와 정렬 버튼 */}
          <div className="hidden xl:absolute xl:top-0 xl:right-0 xl:flex xl:items-center xl:gap-4">
            <SearchBar value={searchQuery} onSearchChange={onSearchChange} />
            <SortDropdown
              selectedSort={sortOption}
              onSortChange={onSortChange}
              sortOptions={sortOptions}
              selectedTimeRange={timeRange}
              onTimeRangeChange={onTimeRangeChange}
            />
          </div>

          <div className="flex flex-col gap-4">
            <FilterBar />
            {/* xl 미만 화면에서 보이는 검색바와 정렬 버튼 */}
            <div className="flex items-center gap-4 xl:hidden">
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
