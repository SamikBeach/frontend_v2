import { logBookSelection, searchBooks } from '@/apis/search';
import { SearchBook } from '@/apis/search/types';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';

/**
 * 도서 검색을 위한 React Query 훅
 */
export function useSearchQuery(
  query: string,
  page: number = 1,
  limit: number = 10
) {
  return useSuspenseQuery<{
    books: SearchBook[];
    total: number;
    page: number;
    totalPages: number;
  }>({
    queryKey: ['books', 'search', query, page, limit],
    queryFn: () => searchBooks(query, page, limit),
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 책 선택 로그 저장 훅
 */
export function useLogBookSelection() {
  return useMutation({
    mutationFn: (params: {
      term: string;
      bookId: number;
      title: string;
      author: string;
      coverImage?: string;
      publisher?: string;
      description?: string;
      isbn?: string;
      isbn13?: string;
    }) => logBookSelection(params),
  });
}
