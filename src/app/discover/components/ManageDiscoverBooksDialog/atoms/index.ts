import { DiscoverCategory } from '@/apis/discover-category/types';
import { atom } from 'jotai';

// 다이얼로그 내에서 공유되어야 하는 필수 상태들만 관리

// 현재 활성 탭 (books | categories)
export const activeTabAtom = atom<string>('books');

// 도서 관리 탭에서 선택된 카테고리/서브카테고리 (도서 추가용)
export const selectedCategoryIdAtom = atom<string>('');
export const selectedSubcategoryIdAtom = atom<string>('');

// 카테고리 관리 탭에서 선택된 카테고리 (관리용)
export const selectedCategoryForManagementAtom = atom<DiscoverCategory | null>(
  null
);

// 검색 쿼리 (도서 검색용)
export const searchQueryAtom = atom<string>('');
