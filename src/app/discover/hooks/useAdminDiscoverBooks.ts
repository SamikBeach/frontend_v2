import { getDiscoverBooks } from '@/apis/book/book';
import {
  Book,
  BookSearchResponse,
  DiscoverBooksParams,
} from '@/apis/book/types';
import { searchBooks } from '@/apis/search/search';
import { SearchResult } from '@/apis/search/types';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

/**
 * Book을 SearchResult 타입으로 변환하는 헬퍼 함수
 */
const convertBookToSearchResult = (book: Book): SearchResult => {
  return {
    ...book,
    type: 'book',
    bookId: book.id,
    image: book.coverImage,
    publishDate: book.publishDate ? book.publishDate.toString() : undefined,
  } as unknown as SearchResult;
};

/**
 * 발견하기 카테고리에 추가할 수 있는 도서 목록을 검색하는 훅
 */
export function useAvailableBooksForDiscover(params: {
  query?: string;
  page?: number;
  limit?: number;
  categoryId?: number;
}) {
  const { query = '', page = 1, limit = 20 } = params;

  const queryEnabled = !!query && query.trim().length > 0;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['admin-discover-search-books', query],
    queryFn: async ({ pageParam }) => {
      return searchBooks(query, pageParam as number, limit);
    },
    initialPageParam: page,
    getNextPageParam: lastPage => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    enabled: queryEnabled,
  });

  // 검색 결과 처리
  const books = useMemo(() => {
    return data?.pages.flatMap(page => page.books || []) || [];
  }, [data?.pages]);

  return {
    books,
    totalResults: data?.pages[0]?.total || 0,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  };
}

/**
 * 발견하기 카테고리의 도서 목록을 가져오는 훅
 */
export function useDiscoverCategoryBooks(
  discoverCategoryId: number,
  discoverSubCategoryId?: number
) {
  const queryEnabled = !!discoverCategoryId && discoverCategoryId > 0;

  const params: DiscoverBooksParams = {
    discoverCategoryId: queryEnabled ? discoverCategoryId : undefined,
    discoverSubCategoryId,
    limit: 100, // 관리 화면에서는 충분한 수의 도서를 불러옴
  };

  const { data, isLoading, isError } = useQuery<BookSearchResponse>({
    queryKey: [
      'admin-discover-category-books',
      discoverCategoryId,
      discoverSubCategoryId,
    ],
    queryFn: async () => {
      return getDiscoverBooks(params);
    },
    enabled: queryEnabled,
  });

  return {
    books: data?.books || [],
    totalResults: data?.total || 0,
    isLoading,
    isError,
  };
}

/**
 * 발견하기 카테고리 통계를 가져오는 훅
 */
export function useDiscoverBooksStats() {
  // 더 이상 별도의 통계 API가 없으므로 간단한 정적 데이터 반환
  return {
    stats: {
      categories: [],
      totalBooks: 0,
    },
    isLoading: false,
    isError: false,
  };
}
