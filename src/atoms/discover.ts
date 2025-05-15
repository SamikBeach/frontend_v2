import {
  PopularBooksSortOptions,
  SortOption,
  TimeRangeOptions,
} from '@/apis/book/types';
import { pastelColors } from '@/atoms/popular';
import { TimeRange } from '@/components/SortDropdown';
import { atom } from 'jotai';

// 발견하기 페이지 필터 상태
export const discoverCategoryFilterAtom = atom<string>('all');
export const discoverSubcategoryFilterAtom = atom<string>('all');
export const discoverSortOptionAtom = atom<SortOption>(
  PopularBooksSortOptions.RATING_DESC
);
export const discoverTimeRangeAtom = atom<TimeRange>(TimeRangeOptions.ALL);

// 선택된 발견하기 카테고리 및 서브카테고리 메타데이터
export const discoverCategoryMetaAtom = atom<{
  id: string;
  name: string;
  description?: string;
} | null>(null);

export const discoverSubcategoryMetaAtom = atom<{
  id: string;
  name: string;
  description?: string;
} | null>(null);

// Export pastelColors for easy access
export { pastelColors };
