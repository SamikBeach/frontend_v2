import { atom } from 'jotai';

// BookDialog 내 드롭다운 메뉴의 열림 상태를 관리하는 atom들
export const readingStatusDropdownOpenAtom = atom<boolean>(false);
// 서재에 담기 드롭다운을 영역별로 분리
export const actionButtonsLibraryDropdownAtom = atom<boolean>(false); // 좌측 ActionButtons에서 사용
export const bookLibrariesDropdownAtom = atom<boolean>(false); // 우측 BookLibraries에서 사용
export const librarySortDropdownOpenAtom = atom<boolean>(false);
export const reviewSortDropdownOpenAtom = atom<boolean>(false);
export const conflictDialogOpenAtom = atom<boolean>(false);

// 현재 열려있는 드롭다운이 있는지 확인하는 파생 atom
export const hasOpenDropdownAtom = atom(get => {
  return (
    get(readingStatusDropdownOpenAtom) ||
    get(actionButtonsLibraryDropdownAtom) ||
    get(bookLibrariesDropdownAtom) ||
    get(librarySortDropdownOpenAtom) ||
    get(reviewSortDropdownOpenAtom) ||
    get(conflictDialogOpenAtom)
  );
});
