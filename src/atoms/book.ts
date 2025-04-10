import { atom } from 'jotai';

// 선택된 책 ID atom
export const selectedBookIdAtom = atom<string | null>(null);
