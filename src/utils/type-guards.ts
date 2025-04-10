import { SortOption, TimeRange } from '@/apis/book/types';

/**
 * SortOption 타입 가드
 * @param value 확인할 값
 * @returns 값이 유효한 SortOption인지 여부
 */
export const isValidSortOption = (value: string): value is SortOption =>
  ['rating-desc', 'reviews-desc', 'publishDate-desc'].includes(value);

/**
 * TimeRange 타입 가드
 * @param value 확인할 값
 * @returns 값이 유효한 TimeRange인지 여부
 */
export const isValidTimeRange = (value: string): value is TimeRange =>
  ['all', 'month', 'year'].includes(value);
