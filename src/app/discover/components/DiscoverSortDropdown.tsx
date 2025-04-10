import {
  discoverSortOptionAtom,
  discoverTimeRangeAtom,
} from '@/atoms/discover';
import { SortDropdown, TimeRange } from '@/components/SortDropdown';
import { useQueryParams } from '@/hooks';
import { useAtom } from 'jotai';

interface DiscoverSortDropdownProps {
  className?: string;
}

export function DiscoverSortDropdown({ className }: DiscoverSortDropdownProps) {
  const [sortOption, setSortOption] = useAtom(discoverSortOptionAtom);
  const [timeRange, setTimeRange] = useAtom(discoverTimeRangeAtom);
  const { updateQueryParams } = useQueryParams();

  const handleSortChange = (sort: string) => {
    if (
      sort === 'rating-desc' ||
      sort === 'reviews-desc' ||
      sort === 'publishDate-desc' ||
      sort === 'publishDate-asc' ||
      sort === 'title-asc'
    ) {
      setSortOption(sort);
      updateQueryParams({ sort });
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
      updateQueryParams({ timeRange: range });
    } else {
      setTimeRange('all');
      updateQueryParams({ timeRange: 'all' });
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
