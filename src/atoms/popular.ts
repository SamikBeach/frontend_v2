import {
  TimeRange as ApiTimeRange,
  PopularBooksSortOptions,
  SortOption,
  TimeRangeOptions,
} from '@/apis/book/types';
import { atom } from 'jotai';

// 파스텔 색상 목록 (CategoryFilter에서 사용)
export const pastelColors = [
  '#FFD6E0', // 연한 분홍색
  '#FFEFB5', // 연한 노란색
  '#D1F0C2', // 연한 녹색
  '#C7CEEA', // 연한 파란색
  '#F1DEDE', // 연한 보라색
  '#E2F0CB', // 연한 민트색
  '#FFCBC1', // 연한 주황색
  '#CFE5F2', // 연한 하늘색
  '#FFDAC1', // 연한 살구색
  '#E2CFC4', // 연한 베이지색
];

// 카테고리 필터 atom
export const categoryFilterAtom = atom<string>('all');

// 서브카테고리 필터 atom
export const subcategoryFilterAtom = atom<string>('all');

// 정렬 옵션 atom - 기본값은 평점 높은순
export const sortOptionAtom = atom<SortOption>(
  PopularBooksSortOptions.RATING_DESC
);

// 시간 범위 atom
export const timeRangeAtom = atom<ApiTimeRange>(TimeRangeOptions.ALL);
