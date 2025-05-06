import { getPopularBooksForHome } from '@/apis/book/book';
import { BookSearchResponse, HomeBookPreview } from '@/apis/book/types';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

/**
 * 홈 화면에 표시할 인기 도서 데이터를 가져오는 훅
 * @param limit 가져올 도서 수 (기본값: 4)
 */
export function useHomePopularBooksQuery(limit: number = 4) {
  const { data, isLoading, error } = useQuery<BookSearchResponse>({
    queryKey: ['home', 'popularBooks', limit],
    queryFn: () => getPopularBooksForHome(limit),
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시
  });

  // 서버 응답에서 books 데이터 추출
  const books = useMemo<HomeBookPreview[]>(() => {
    return data?.books || [];
  }, [data]);

  return {
    books,
    isLoading,
    error,
    totalBooks: data?.total || 0,
  };
}
