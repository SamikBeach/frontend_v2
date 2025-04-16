import { getLibrariesByBookId } from '@/apis/library/library';
import {
  LibrariesForBookResponse,
  LibrarySortOption,
} from '@/apis/library/types';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useBookDetails } from './useBookDetails';

/**
 * 특정 책이 저장된 서재 목록을 조회하는 훅 (더보기 버튼 지원)
 * @param bookId 책 ID
 * @param limit 한 페이지에 표시할 서재 수
 * @param sort 정렬 옵션
 * @returns 책이 저장된 서재 목록 및 페이지네이션 정보
 */
export function useBookLibraries(
  bookId: number | undefined,
  limit: number = 5,
  sort: LibrarySortOption = LibrarySortOption.SUBSCRIBERS
) {
  const { isbn } = useBookDetails();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['book-libraries', bookId, limit, isbn, sort],
    queryFn: async ({ pageParam }) => {
      if (!bookId) {
        return {
          data: [],
          meta: { total: 0, page: 1, limit, totalPages: 0 },
        } as LibrariesForBookResponse;
      }

      const page = pageParam as number;
      // bookId가 -1이고 ISBN이 있는 경우, ISBN을 함께 전달
      return await getLibrariesByBookId(
        bookId,
        page,
        limit,
        bookId === -1 ? isbn : undefined,
        sort
      );
    },
    getNextPageParam: (lastPage: LibrariesForBookResponse) => {
      const { meta } = lastPage;
      // 다음 페이지가 있는지 확인, 없으면 undefined 반환
      return meta.page < meta.totalPages ? meta.page + 1 : undefined;
    },
    placeholderData: keepPreviousData,
    initialPageParam: 1,
  });

  // 모든 페이지의 서재를 하나의 배열로 병합
  const libraries =
    data?.pages.flatMap(page => (Array.isArray(page.data) ? page.data : [])) ||
    [];

  // 메타데이터는 마지막 페이지의 것을 사용
  const meta = data?.pages[data?.pages.length - 1]?.meta || {
    total: 0,
    page: 1,
    limit,
    totalPages: 0,
  };

  const isEmpty = libraries.length === 0;

  // 더보기 버튼 핸들러 (리뷰 목록과 동일한 스타일)
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return {
    libraries,
    meta,
    isLoading,
    isError,
    refetch,
    isEmpty,
    hasNextPage,
    isFetchingNextPage,
    handleLoadMore,
  };
}
