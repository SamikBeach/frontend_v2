import {
  getDiscoverBooksForHome,
  getPopularBooksForHome,
} from '@/apis/book/book';
import { getPopularLibrariesForHome } from '@/apis/library/library';
import { getPopularReviewsForHome } from '@/apis/review/review';
import {
  homeDiscoverBooksAtom,
  homeLoadingStateAtom,
  homePopularBooksAtom,
  homePopularLibrariesAtom,
  homePopularReviewsAtom,
} from '@/atoms/home';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

export function useHomeData() {
  // Atoms
  const [popularBooks, setPopularBooks] = useAtom(homePopularBooksAtom);
  const [discoverBooks, setDiscoverBooks] = useAtom(homeDiscoverBooksAtom);
  const [popularLibraries, setPopularLibraries] = useAtom(
    homePopularLibrariesAtom
  );
  const [popularReviews, setPopularReviews] = useAtom(homePopularReviewsAtom);
  const [loadingState, setLoadingState] = useAtom(homeLoadingStateAtom);

  // 인기 도서 데이터 가져오기
  const { data: popularBooksData } = useSuspenseQuery({
    queryKey: ['home', 'popularBooks'],
    queryFn: () => getPopularBooksForHome(),
  });

  // 오늘의 발견 데이터 가져오기
  const { data: discoverBooksData } = useSuspenseQuery({
    queryKey: ['home', 'discoverBooks'],
    queryFn: () => getDiscoverBooksForHome(),
  });

  // 인기 서재 데이터 가져오기
  const { data: popularLibrariesData } = useSuspenseQuery({
    queryKey: ['home', 'popularLibraries'],
    queryFn: () => getPopularLibrariesForHome(),
  });

  // 인기 게시물 데이터 가져오기
  const { data: popularReviewsData } = useSuspenseQuery({
    queryKey: ['home', 'popularReviews'],
    queryFn: () => getPopularReviewsForHome(),
  });

  // API 응답 원본 데이터 로깅
  useEffect(() => {
    console.log('API 응답 원본 데이터:', {
      popularBooksData,
      discoverBooksData,
      popularLibrariesData,
      popularReviewsData,
    });
  }, [
    popularBooksData,
    discoverBooksData,
    popularLibrariesData,
    popularReviewsData,
  ]);

  // 데이터 업데이트
  useEffect(() => {
    if (popularBooksData) {
      console.log('인기 도서 데이터 구조:', popularBooksData);
      // API 응답 형식에 맞게 수정: 응답이 배열 형태인 경우 그대로 설정, 아니면 books 속성 추출
      const booksToSet = Array.isArray(popularBooksData)
        ? popularBooksData
        : popularBooksData.books || [];
      setPopularBooks(booksToSet);
      setLoadingState(prev => ({ ...prev, popularBooks: false }));
    }
  }, [popularBooksData, setPopularBooks, setLoadingState]);

  useEffect(() => {
    if (discoverBooksData) {
      console.log('발견 도서 데이터 구조:', discoverBooksData);
      // API 응답 형식에 맞게 수정: 응답이 배열 형태로 가정
      const discoverToSet = Array.isArray(discoverBooksData)
        ? discoverBooksData
        : [discoverBooksData];
      setDiscoverBooks(discoverToSet);
      setLoadingState(prev => ({ ...prev, discoverBooks: false }));
    }
  }, [discoverBooksData, setDiscoverBooks, setLoadingState]);

  useEffect(() => {
    if (popularLibrariesData) {
      console.log('인기 서재 데이터 구조:', popularLibrariesData);
      // API 응답 형식에 맞게 수정: 응답이 배열 형태인 경우 그대로 설정, 아니면 libraries 속성 추출
      const librariesToSet = Array.isArray(popularLibrariesData)
        ? popularLibrariesData
        : popularLibrariesData.libraries || [];
      setPopularLibraries(librariesToSet);
      setLoadingState(prev => ({ ...prev, popularLibraries: false }));
    }
  }, [popularLibrariesData, setPopularLibraries, setLoadingState]);

  useEffect(() => {
    if (popularReviewsData) {
      console.log('인기 게시물 데이터 구조:', popularReviewsData);
      // API 응답 형식에 맞게 수정: 응답이 배열 형태인 경우 그대로 설정, 아니면 reviews 속성 추출
      const reviewsToSet = Array.isArray(popularReviewsData)
        ? popularReviewsData
        : popularReviewsData.reviews || [];
      setPopularReviews(reviewsToSet);
      setLoadingState(prev => ({ ...prev, popularReviews: false }));
    }
  }, [popularReviewsData, setPopularReviews, setLoadingState]);

  return {
    popularBooks,
    discoverBooks,
    popularLibraries,
    popularReviews,
    isLoading: Object.values(loadingState).some(state => state),
  };
}
