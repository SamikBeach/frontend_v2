import { getLibrariesByBookId } from '@/apis/library/library';
import {
  LibraryListItem,
  LibrarySortOption,
  PaginatedLibraryResponse,
} from '@/apis/library/types';
import {
  keepPreviousData,
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
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
): {
  libraries: LibraryListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<unknown>;
  isEmpty: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  handleLoadMore: () => void;
} {
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
        } as PaginatedLibraryResponse;
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
    getNextPageParam: (lastPage: PaginatedLibraryResponse) => {
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

export function useBookLibrariesSuspense(
  bookId?: string,
  limit = 10,
  sortOption = LibrarySortOption.SUBSCRIBERS
) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ['bookLibraries', bookId, sortOption],
      queryFn: ({ pageParam = 1 }) =>
        getLibrariesByBookId(
          Number(bookId) || 0,
          pageParam,
          limit,
          undefined,
          sortOption
        ),
      initialPageParam: 1,
      getNextPageParam: (lastPage, _, lastPageParam) => {
        if (lastPage.meta.page < lastPage.meta.totalPages) {
          return lastPageParam + 1;
        }
        return undefined;
      },
    });

  const libraries = useMemo(() => {
    return data?.pages.flatMap(page => page.data) || [];
  }, [data]);

  const isEmpty = libraries.length === 0;

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return {
    libraries,
    isEmpty,
    hasNextPage,
    isFetchingNextPage,
    handleLoadMore,
  };
}
