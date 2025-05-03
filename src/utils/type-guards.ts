import {
  PopularBooksSortOptions,
  SortOption,
  TimeRange,
  TimeRangeOptions,
} from '@/apis/book/types';

/**
 * SortOption 타입 가드
 * @param value 확인할 값
 * @returns 값이 유효한 SortOption인지 여부
 */
export const isValidSortOption = (value: string): value is SortOption => {
  const validOptions = [
    PopularBooksSortOptions.RATING_DESC,
    PopularBooksSortOptions.REVIEWS_DESC,
    PopularBooksSortOptions.LIBRARY_COUNT_DESC,
    PopularBooksSortOptions.PUBLISH_DATE_DESC,
    PopularBooksSortOptions.TITLE_ASC,
    'library-adds-desc',
  ];

  return validOptions.includes(value as SortOption);
};

/**
 * TimeRange 타입 가드
 * @param value 확인할 값
 * @returns 값이 유효한 TimeRange인지 여부
 */
export const isValidTimeRange = (value: string): value is TimeRange => {
  const validOptions = [
    TimeRangeOptions.ALL,
    TimeRangeOptions.TODAY,
    TimeRangeOptions.WEEK,
    TimeRangeOptions.MONTH,
    TimeRangeOptions.YEAR,
  ];

  return validOptions.includes(value as TimeRange);
};
