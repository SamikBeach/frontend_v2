import { sortOptionAtom, timeRangeAtom } from '@/atoms/popular';
import { SortDropdown, TimeRange } from '@/components/SortDropdown';
import { useAtom } from 'jotai';

interface PopularSortDropdownProps {
  className?: string;
}

export function PopularSortDropdown({ className }: PopularSortDropdownProps) {
  const [sortOption, setSortOption] = useAtom(sortOptionAtom);
  const [timeRange, setTimeRange] = useAtom(timeRangeAtom);

  const handleSortChange = (sort: string) => {
    if (
      sort === 'rating-desc' ||
      sort === 'reviews-desc' ||
      sort === 'publishDate-desc' ||
      sort === 'publishDate-asc' ||
      sort === 'title-asc'
    ) {
      setSortOption(sort);
    }
  };

  const handleTimeRangeChange = (range: TimeRange) => {
    if (
      range === 'all' ||
      range === 'month' ||
      range === 'year' ||
      range === 'today' ||
      range === 'week'
    ) {
      setTimeRange(range);
    } else {
      setTimeRange('all');
    }
  };

  return (
    <SortDropdown
      selectedSort={sortOption}
      onSortChange={handleSortChange}
      selectedTimeRange={timeRange}
      onTimeRangeChange={handleTimeRangeChange}
      className={className}
    />
  );
}
