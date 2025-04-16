import { logBookSelection, searchBooks } from '@/apis/search';
import { SearchBook } from '@/apis/search/types';
import { useDebounce } from '@/hooks/useDebounce';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';

/**
 * 도서 검색을 위한 React Query 훅 - debounce 적용
 * @param query 검색어
 * @param page 페이지 번호
 * @param limit 한 페이지에 표시할 검색 결과 수
 * @param debounceMs debounce 시간 (밀리초)
 */
export function useSearchQuery(
  query: string,
  page: number = 1,
  limit: number = 10,
  debounceMs: number = 300
) {
  // 검색어에 debounce 적용
  const debouncedQuery = useDebounce(query, debounceMs);

  return useQuery<{
    books: SearchBook[];
    total: number;
    page: number;
    totalPages: number;
  }>({
    queryKey: ['books', 'search', debouncedQuery, page, limit],
    queryFn: () => searchBooks(debouncedQuery, page, limit),
    placeholderData: keepPreviousData,
    enabled: !!debouncedQuery.trim(), // 검색어가 빈 문자열이면 API 호출 안함
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
