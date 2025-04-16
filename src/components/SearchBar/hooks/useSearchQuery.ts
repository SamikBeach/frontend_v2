import { logBookSelection, searchBooks } from '@/apis/search';
import { SearchBook } from '@/apis/search/types';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';

/**
 * 도서 검색을 위한 React Query 훅
 * @param query 검색어 (이미 debounce가 적용된 쿼리)
 * @param page 페이지 번호
 * @param limit 한 페이지에 표시할 검색 결과 수
 */
export function useSearchQuery(
  query: string,
  page: number = 1,
  limit: number = 10
) {
  return useQuery<{
    books: SearchBook[];
    total: number;
    page: number;
    totalPages: number;
  }>({
    queryKey: ['books', 'search', query, page, limit],
    queryFn: () => searchBooks(query, page, limit),
    placeholderData: keepPreviousData,
    enabled: !!query.trim(), // 검색어가 빈 문자열이면 API 호출 안함
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터 유지
    refetchOnWindowFocus: false, // 창 포커스 시 다시 불러오지 않음
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
