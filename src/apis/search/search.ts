import api from '../axios';
import { PopularSearch, RecentSearch, SearchBook } from './types';

/**
 * 도서 검색 API
 */
export const searchBooks = async (
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  books: SearchBook[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  // 쿼리가 없는 경우 빈 결과 반환
  if (!query.trim()) {
    return {
      books: [],
      total: 0,
      page: 1,
      totalPages: 0,
    };
  }

  const { data } = await api.get('/search', {
    params: {
      query,
      page: page.toString(),
      limit: limit.toString(),
      type: 'Keyword', // 기본 검색 타입
    },
  });
  return data;
};

/**
 * 인기 검색어 조회 API
 */
export const getPopularSearchTerms = async (
  limit: number = 10
): Promise<PopularSearch[]> => {
  const { data } = await api.get('/search/popular', {
    params: { limit: limit.toString() },
  });
  return data;
};

/**
 * 최근 검색어 조회 API
 */
export const getRecentSearchTerms = async (
  limit: number = 5
): Promise<{
  books: RecentSearch[];
  count: number;
}> => {
  const { data } = await api.get('/search/recent', {
    params: { limit: limit.toString() },
  });
  return data;
};

/**
 * 최근 검색어 전체 삭제 API
 */
export const deleteAllRecentSearches = async (): Promise<void> => {
  await api.delete('/search/recent');
};

/**
 * 최근 검색어 개별 삭제 API
 */
export const deleteRecentSearch = async (id: number): Promise<void> => {
  await api.delete(`/search/recent/${id}`);
};

/**
 * 책 선택 로그 저장 API
 */
export const logBookSelection = async (request: {
  term: string;
  bookId: number;
  title: string;
  author: string;
  coverImage?: string;
  publisher?: string;
  description?: string;
  isbn?: string;
  isbn13?: string;
}): Promise<void> => {
  await api.post('/search/log-book-selection', request);
};
