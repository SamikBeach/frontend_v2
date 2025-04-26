import { TimeRange } from '@/components/SortDropdown';
import { atom } from 'jotai';

// 서재 태그 필터 atom
export const libraryTagFilterAtom = atom<string>('all');

// 서재 정렬 옵션 atom
export const librarySortOptionAtom = atom<string>('popular');

// 서재 기간 필터 atom
export const libraryTimeRangeAtom = atom<TimeRange>('all');

// 선택된 서재 ID atom
export const selectedLibraryIdAtom = atom<string | null>(null);

// 서재 검색어 atom
export const librarySearchQueryAtom = atom<string>('');

// 서재 상세 즐겨찾기 상태
export const libraryStarredAtom = atom<boolean>(false);

// 서재 메뉴 사이드바 열림 여부 (기본값: 닫힘)
export const libraryMenuOpenAtom = atom<boolean>(false);

// 구독 상태 atom
export const subscriptionStatusAtom = atom<boolean>(false);

// 알림 활성화 상태 atom
export const notificationsEnabledAtom = atom<boolean>(false);
