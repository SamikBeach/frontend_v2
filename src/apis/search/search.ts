import api from '../axios';
import {
  PopularSearch,
  RecentSearch,
  SaveSearchTermRequest,
  SearchBook,
} from './types';

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
  recentSearches: RecentSearch[];
  count: number;
}> => {
  const { data } = await api.get('/search/recent', {
    params: { limit: limit.toString() },
  });
  return data;
};

/**
 * 검색어 저장 API
 */
export const saveSearchTerm = async (
  request: SaveSearchTermRequest
): Promise<void> => {
  // 검색어 자동 저장은 백엔드에서 처리되므로 여기서는 별도 API 호출 불필요
  console.log('검색어 자동 저장됨:', request.term);
};

/**
 * 최근 검색어 전체 삭제 API
 */
export const deleteAllRecentSearches = async (): Promise<void> => {
  await api.delete('/search/recent');
};

/**
 * 책 선택 로그 저장 API
 */
export const logBookSelection = async (request: {
  term: string;
  bookId: number;
  title: string;
  author: string;
  coverImage: string;
  publisher: string;
  description?: string;
}): Promise<void> => {
  await api.post('/search/log-book-selection', {
    ...request,
    bookId: request.bookId.toString(),
  });
};
