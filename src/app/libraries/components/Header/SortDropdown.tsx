import { Library } from '@/apis/library/types';
import { SortDropdown as CommonSortDropdown } from '@/components/SortDropdown';
import { useQueryParams } from '@/hooks';
import { SortDropdownProps } from '../../types';

// 기본값 상수 정의
const DEFAULT_SORT_OPTION = 'popular';
const DEFAULT_TIME_RANGE = 'all';

export function SortDropdown({
  selectedSort,
  onSortChange,
  sortOptions,
  className = '',
  selectedTimeRange = 'all',
  onTimeRangeChange,
}: SortDropdownProps) {
  const { updateQueryParams } = useQueryParams();

  // 정렬 변경 핸들러
  const handleSortChange = (sortId: string) => {
    // 기본 onSortChange 호출
    onSortChange(sortId);

    // 기본값인 경우에는 URL 쿼리 파라미터 제거
    if (sortId === DEFAULT_SORT_OPTION) {
      updateQueryParams({ sort: undefined });
    } else {
      // 기본값이 아닌 경우에는 URL 쿼리 파라미터 추가
      updateQueryParams({ sort: sortId });
    }
  };

  // 시간 범위 변경 핸들러
  const handleTimeRangeChange = (range: string) => {
    // 기본 onTimeRangeChange가 있으면 호출
    if (onTimeRangeChange) {
      onTimeRangeChange(range as any);
    }

    // 기본값인 경우에는 URL 쿼리 파라미터 제거
    if (range === DEFAULT_TIME_RANGE) {
      updateQueryParams({ timeRange: undefined });
    } else {
      // 기본값이 아닌 경우에는 URL 쿼리 파라미터 추가
      updateQueryParams({ timeRange: range });
    }
  };

  return (
    <CommonSortDropdown<Library>
      selectedSort={selectedSort}
      onSortChange={handleSortChange}
      sortOptions={sortOptions}
      className={className}
      selectedTimeRange={selectedTimeRange}
      onTimeRangeChange={onTimeRangeChange ? handleTimeRangeChange : undefined}
    />
  );
}
