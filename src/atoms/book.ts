import { Book } from '@/apis/book';
import { atom } from 'jotai';

// 선택된 책 ID atom
export const selectedBookIdAtom = atom<string | null>(null);

// 선택된 책 데이터 atom
export const selectedBookAtom = atom<Book | null>(null);
