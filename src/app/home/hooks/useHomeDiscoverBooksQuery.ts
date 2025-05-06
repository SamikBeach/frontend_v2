import { getDiscoverBooksForHome } from '@/apis/book/book';
import { HomeDiscoverBooksResponse } from '@/apis/book/types';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

/**
 * 홈 화면에 표시할 발견 도서 데이터를 가져오는 훅
 */
export function useHomeDiscoverBooksQuery() {
  const { data, isLoading, error } = useQuery<HomeDiscoverBooksResponse[]>({
    queryKey: ['home', 'discoverBooks'],
    queryFn: () => getDiscoverBooksForHome(),
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시
  });

  // 서버 응답이 배열이 아닌 경우 배열로 변환
  const discoverBooks = useMemo<HomeDiscoverBooksResponse[]>(() => {
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
  }, [data]);

  return {
    discoverBooks,
    isLoading,
    error,
  };
}
