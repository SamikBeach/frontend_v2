import { PopularBooksSortOptions, TimeRangeOptions } from '@/apis/book/types';
import { sortOptionAtom, timeRangeAtom } from '@/atoms/popular';
import { SortDropdown, TimeRange } from '@/components/SortDropdown';
import { useQueryParams } from '@/hooks';
import { useAtom } from 'jotai';
import { useMemo } from 'react';

interface PopularSortDropdownProps {
  className?: string;
}

export function PopularSortDropdown({ className }: PopularSortDropdownProps) {
  const [sortOption, setSortOption] = useAtom(sortOptionAtom);
  const [timeRange, setTimeRange] = useAtom(timeRangeAtom);
  const { updateQueryParams } = useQueryParams();

  // 정렬 옵션에 따라 TimeRange 필터 표시 여부 결정
  const showTimeRangeFilter = useMemo(() => {
    // 평점 높은순, 리뷰 많은순, 서재에 많이 담긴 순에서만 시간 필터 표시
    return [
      PopularBooksSortOptions.RATING_DESC,
      PopularBooksSortOptions.REVIEWS_DESC,
      PopularBooksSortOptions.LIBRARY_COUNT_DESC,
      'library-adds-desc', // 기존 호환성을 위해 유지
    ].includes(sortOption as any);
  }, [sortOption]);

  const handleSortChange = (sort: string) => {
    if (
      sort === PopularBooksSortOptions.RATING_DESC ||
      sort === PopularBooksSortOptions.REVIEWS_DESC ||
      sort === PopularBooksSortOptions.LIBRARY_COUNT_DESC ||
      sort === PopularBooksSortOptions.PUBLISH_DATE_DESC ||
      sort === PopularBooksSortOptions.TITLE_ASC
    ) {
      setSortOption(sort);
      // URL 쿼리 파라미터 업데이트
      updateQueryParams({ sort });
    }
  };

  const handleTimeRangeChange = (range: TimeRange) => {
    if (
      range === TimeRangeOptions.ALL ||
      range === TimeRangeOptions.MONTH ||
      range === TimeRangeOptions.YEAR ||
      range === TimeRangeOptions.TODAY ||
      range === TimeRangeOptions.WEEK
    ) {
      setTimeRange(range);
      // URL 쿼리 파라미터 업데이트
      updateQueryParams({ timeRange: range });
    } else {
      setTimeRange(TimeRangeOptions.ALL);
      // URL 쿼리 파라미터 업데이트
      updateQueryParams({ timeRange: TimeRangeOptions.ALL });
    }
  };

  return (
    <SortDropdown
      selectedSort={sortOption}
      onSortChange={handleSortChange}
      selectedTimeRange={timeRange}
      onTimeRangeChange={
        showTimeRangeFilter ? handleTimeRangeChange : undefined
      }
      className={className}
    />
  );
}
