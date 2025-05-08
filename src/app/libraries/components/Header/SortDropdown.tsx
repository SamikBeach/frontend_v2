import { TimeRangeOptions } from '@/apis/library/types';
import { SortDropdown as CommonSortDropdown } from '@/components/SortDropdown';
import { SortDropdownProps } from '../../types';

// 기본값 상수 정의
const DEFAULT_SORT_OPTION = 'popular';
const DEFAULT_TIME_RANGE = TimeRangeOptions.ALL;

export function SortDropdown({
  selectedSort,
  onSortChange,
  sortOptions,
  className = '',
  selectedTimeRange = TimeRangeOptions.ALL,
  onTimeRangeChange,
}: SortDropdownProps) {
  // 최신순(latest)일 때는 시간 범위 필터를 표시하지 않기 위해 onTimeRangeChange를 조건부로 전달
  const shouldShowTimeRange = selectedSort !== 'latest' && onTimeRangeChange;

  return (
    <CommonSortDropdown
      selectedSort={selectedSort}
      onSortChange={onSortChange}
      sortOptions={sortOptions as any}
      className={className}
      selectedTimeRange={selectedTimeRange}
      onTimeRangeChange={shouldShowTimeRange ? onTimeRangeChange : undefined}
    />
  );
}
