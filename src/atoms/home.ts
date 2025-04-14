import { HomeBookPreview, HomeDiscoverBooksResponse } from '@/apis/book/types';
import { HomeLibraryPreview } from '@/apis/library/types';
import { HomeReviewPreview } from '@/apis/review/types';
import { atom } from 'jotai';

// 홈화면 인기도서 atom
export const homePopularBooksAtom = atom<HomeBookPreview[]>([]);

// 홈화면 오늘의 발견 atom
export const homeDiscoverBooksAtom = atom<HomeDiscoverBooksResponse[]>([]);

// 홈화면 인기서재 atom
export const homePopularLibrariesAtom = atom<HomeLibraryPreview[]>([]);

// 홈화면 인기게시물 atom
export const homePopularReviewsAtom = atom<HomeReviewPreview[]>([]);

// 홈화면 로딩 상태 atom
export const homeLoadingStateAtom = atom({
  popularBooks: false,
  discoverBooks: false,
  popularLibraries: false,
  popularReviews: false,
});
