import { PopularBooksSortOptions, TimeRangeOptions } from '@/apis/book/types';
import {
  discoverSortOptionAtom,
  discoverTimeRangeAtom,
} from '@/atoms/discover';
import { SortDropdown, TimeRange } from '@/components/SortDropdown';
import { useQueryParams } from '@/hooks';
import { useAtom } from 'jotai';
import { useMemo } from 'react';

// 기본값 상수 정의
const DEFAULT_SORT = PopularBooksSortOptions.RATING_DESC;
const DEFAULT_TIME_RANGE = TimeRangeOptions.ALL;

interface DiscoverSortDropdownProps {
  className?: string;
}

export function DiscoverSortDropdown({ className }: DiscoverSortDropdownProps) {
  const [sortOption, setSortOption] = useAtom(discoverSortOptionAtom);
  const [timeRange, setTimeRange] = useAtom(discoverTimeRangeAtom);
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

      // 기본값과 다른 경우에만 URL 쿼리 파라미터 업데이트
      if (sort !== DEFAULT_SORT) {
        updateQueryParams({ sort });
      } else {
        // 기본값인 경우 URL에서 제거
        updateQueryParams({ sort: undefined });
      }

      // 스크롤을 맨 위로 이동
      window.scrollTo({ top: 0 });
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

      // 기본값과 다른 경우에만 URL 쿼리 파라미터 업데이트
      if (range !== DEFAULT_TIME_RANGE) {
        updateQueryParams({ timeRange: range });
      } else {
        // 기본값인 경우 URL에서 제거
        updateQueryParams({ timeRange: undefined });
      }

      // 스크롤을 맨 위로 이동
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setTimeRange(DEFAULT_TIME_RANGE);
      // 기본값으로 설정된 경우 URL에서 제거
      updateQueryParams({ timeRange: undefined });

      // 스크롤을 맨 위로 이동
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
