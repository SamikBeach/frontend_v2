import { SortDropdown as CommonSortDropdown } from '@/components/SortDropdown';
import { SortDropdownProps } from '../types';

export function SortDropdown({
  selectedSort,
  onSortChange,
  sortOptions,
  className = '',
  selectedTimeRange = 'all',
  onTimeRangeChange,
}: SortDropdownProps) {
  return (
    <CommonSortDropdown
      selectedSort={selectedSort}
      onSortChange={onSortChange}
      sortOptions={sortOptions}
      className={className}
      selectedTimeRange={selectedTimeRange}
      onTimeRangeChange={onTimeRangeChange}
    />
  );
}
