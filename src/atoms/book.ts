import { Book } from '@/apis/book';
import { ReviewSortType } from '@/apis/review/types';
import { atom } from 'jotai';

// 선택된 책 ID atom
export const selectedBookIdAtom = atom<string | null>(null);

// 선택된 책 데이터 atom
export const selectedBookAtom = atom<Book | null>(null);

// 현재 선택된 책의 ID
export const currentBookIdAtom = atom<number | null>(null);

// 책 다이얼로그의 열린 탭 상태
export const bookDialogTabAtom = atom<string>('reviews');

// 책 리뷰 정렬 방식 상태
export const bookReviewSortAtom = atom<ReviewSortType>('likes');
