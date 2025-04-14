import { getLibrariesByBookId } from '@/apis/library/library';
import { LibrariesForBookResponse } from '@/apis/library/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

/**
 * 특정 책이 저장된 서재 목록을 조회하는 훅
 * @param bookId 책 ID
 * @param limit 한 페이지에 표시할 서재 수
 * @returns 책이 저장된 서재 목록 및 페이지네이션 정보
 */
export function useBookLibraries(
  bookId: number | undefined,
  limit: number = 10
) {
  const { data, isLoading, isError, error, refetch } =
    useSuspenseQuery<LibrariesForBookResponse>({
      queryKey: ['book-libraries', bookId, limit],
      queryFn: async () => {
        if (!bookId)
          return {
            data: [],
            meta: { total: 0, page: 1, limit, totalPages: 0 },
          };
        return await getLibrariesByBookId(bookId, 1, limit);
      },
      enabled: !!bookId,
    });

  // 디버깅용 로그
  useEffect(() => {
    if (data) {
      console.log('Loaded libraries for book:', data);
    }
    if (isError) {
      console.error('Error fetching libraries for book:', error);
    }
  }, [data, isError, error]);

  return {
    libraries: data?.data || [],
    meta: data?.meta || { total: 0, page: 1, limit, totalPages: 0 },
    isLoading,
    isError,
    refetch,
    isEmpty: data?.data.length === 0,
  };
}
