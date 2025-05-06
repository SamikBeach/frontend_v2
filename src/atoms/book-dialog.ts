import { ReadingStatusType } from '@/apis/reading-status';
import { atom } from 'jotai';

// BookDialog 내 드롭다운 메뉴의 열림 상태를 관리하는 atom들
export const readingStatusDropdownOpenAtom = atom<boolean>(false);
export const libraryAddDropdownOpenAtom = atom<boolean>(false);
export const librarySortDropdownOpenAtom = atom<boolean>(false);
export const reviewSortDropdownOpenAtom = atom<boolean>(false);
export const conflictDialogOpenAtom = atom<boolean>(false);

// 현재 열려있는 드롭다운이 있는지 확인하는 파생 atom
export const hasOpenDropdownAtom = atom(get => {
  return (
    get(readingStatusDropdownOpenAtom) ||
    get(libraryAddDropdownOpenAtom) ||
    get(librarySortDropdownOpenAtom) ||
    get(reviewSortDropdownOpenAtom) ||
    get(conflictDialogOpenAtom)
  );
});

// BookDialog 내에서 현재 책의 읽기 상태를 공유하는 atom
export const bookReadingStatusAtom = atom<ReadingStatusType | null>(null);
