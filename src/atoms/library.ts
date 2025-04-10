import { atom } from 'jotai';

// 서재 카테고리 필터 atom
export const libraryCategoryFilterAtom = atom<string>('all');

// 서재 정렬 옵션 atom
export const librarySortOptionAtom = atom<string>('popular');

// 서재 기간 필터 atom
export const libraryTimeRangeAtom = atom<
  'all' | 'today' | 'week' | 'month' | 'year'
>('all');

// 선택된 서재 ID atom
export const selectedLibraryIdAtom = atom<string | null>(null);

// 서재 검색어 atom
export const librarySearchQueryAtom = atom<string>('');

// 구독 상태 atom
export const subscriptionStatusAtom = atom<boolean>(false);

// 알림 활성화 상태 atom
export const notificationsEnabledAtom = atom<boolean>(false);
