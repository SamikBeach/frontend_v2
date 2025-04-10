import { TimeRange as ApiTimeRange, SortOption } from '@/apis/book/types';
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
      sort === 'publishDate-desc'
    ) {
      setSortOption(sort as SortOption);
      updateQueryParams({ sort });
    }
  };

  const handleTimeRangeChange = (range: TimeRange) => {
    if (range === 'all' || range === 'month' || range === 'year') {
      setTimeRange(range as ApiTimeRange);
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
