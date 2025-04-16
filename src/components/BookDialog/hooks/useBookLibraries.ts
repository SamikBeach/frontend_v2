import { getLibrariesByBookId } from '@/apis/library/library';
import { LibrariesForBookResponse } from '@/apis/library/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useBookDetails } from './useBookDetails';

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
  const { isbn } = useBookDetails();

  const { data, isLoading, isError, refetch } =
    useSuspenseQuery<LibrariesForBookResponse>({
      queryKey: ['book-libraries', bookId, limit, isbn],
      queryFn: async () => {
        if (!bookId)
          return {
            data: [],
            meta: { total: 0, page: 1, limit, totalPages: 0 },
          };
        // bookId가 -1이고 ISBN이 있는 경우, ISBN을 함께 전달
        return await getLibrariesByBookId(
          bookId,
          1,
          limit,
          bookId === -1 ? isbn : undefined
        );
      },
    });

  const libraries = Array.isArray(data?.data) ? data.data : [];
  const meta = data?.meta || { total: 0, page: 1, limit, totalPages: 0 };
  const isEmpty = libraries.length === 0;

  return {
    libraries,
    meta,
    isLoading,
    isError,
    refetch,
    isEmpty,
  };
}
