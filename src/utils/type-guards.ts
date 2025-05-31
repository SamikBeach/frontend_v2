import {
  PopularBooksSortOptions,
  SortOption,
  TimeRange,
  TimeRangeOptions,
} from '@/apis/book/types';
import { ReadingStatusType } from '@/apis/reading-status/types';
import { UserBooksSortOptions } from '@/apis/user/types';

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
 * UserBooksSortOptions 타입 가드
 * @param value 확인할 값
 * @returns 값이 유효한 UserBooksSortOptions인지 여부
 */
export const isValidUserBooksSortOption = (
  value: string
): value is UserBooksSortOptions => {
  return Object.values(UserBooksSortOptions).includes(
    value as UserBooksSortOptions
  );
};

/**
 * ReadingStatusType 타입 가드
 * @param value 확인할 값
 * @returns 값이 유효한 ReadingStatusType인지 여부
 */
export const isValidReadingStatusType = (
  value: string
): value is ReadingStatusType => {
  return Object.values(ReadingStatusType).includes(value as ReadingStatusType);
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
