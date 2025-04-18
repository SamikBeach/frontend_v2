import api from '../axios';
import {
  Book,
  CreateBookDto,
  HomeDiscoverBooksResponse,
  HomePopularBooksResponse,
  PopularBooksParams,
  SortOption,
  TimeRange,
  UpdateBookDto,
} from './types';

/**
 * 모든 도서 조회
 */
export const getAllBooks = async (): Promise<Book[]> => {
  const response = await api.get<Book[]>('/book');
  return response.data;
};

/**
 * ID로 도서 조회
 */
export const getBookById = async (id: number): Promise<Book> => {
  const response = await api.get<Book>(`/book/${id}`);
  return response.data;
};

/**
 * ISBN 또는 ID로 도서 조회
 * 입력값이 숫자만으로 이루어져 있고 길이가 짧다면 ID로 간주하고,
 * 그 외의 경우에는 ISBN으로 간주함
 */
export const getBookByIsbn = async (value: string): Promise<Book> => {
  // 숫자만으로 이루어져 있고 길이가 짧은 경우(10자 미만) ID로 간주
  if (/^\d+$/.test(value) && value.length < 10) {
    return getBookById(parseInt(value));
  }

  // 그 외의 경우 ISBN으로 간주
  const response = await api.get<Book>(`/book/isbn/${value}`);
  return response.data;
};

/**
 * 추천 도서 조회
 */
export const getFeaturedBooks = async (): Promise<Book[]> => {
  const response = await api.get<Book[]>('/book/featured');
  return response.data;
};

/**
 * 특정 카테고리의 도서 조회
 */
export const getBooksByCategoryId = async (
  categoryId: number
): Promise<Book[]> => {
  const response = await api.get<Book[]>(`/book/category/${categoryId}`);
  return response.data;
};

/**
 * 특정 서브카테고리의 도서 조회
 */
export const getBooksBySubcategoryId = async (
  subcategoryId: number
): Promise<Book[]> => {
  const response = await api.get<Book[]>(`/book/subcategory/${subcategoryId}`);
  return response.data;
};

/**
 * 특정 카테고리의 인기 도서 조회
 */
export const getPopularBooksByCategory = async (
  categoryId: number,
  subcategoryId?: number,
  sort: SortOption = 'rating-desc',
  timeRange: TimeRange = 'all'
): Promise<Book[]> => {
  // 쿼리 파라미터 구성
  const params: Record<string, string> = {
    sort,
    timeRange,
  };

  if (subcategoryId) {
    params.subcategoryId = subcategoryId.toString();
  }

  const response = await api.get<Book[]>(
    `/book/popular/category/${categoryId}`,
    { params }
  );
  return response.data;
};

/**
 * 모든 카테고리의 인기 도서 조회
 */
export const getAllPopularBooks = async (
  params?: PopularBooksParams
): Promise<Book[]> => {
  const response = await api.get<Book[]>('/book/popular/all', { params });
  return response.data;
};

/**
 * 새 도서 생성
 */
export const createBook = async (bookData: CreateBookDto): Promise<Book> => {
  const response = await api.post<Book>('/book', bookData);
  return response.data;
};

/**
 * 도서 업데이트
 */
export const updateBook = async (
  id: number,
  bookData: UpdateBookDto
): Promise<Book> => {
  const response = await api.patch<Book>(`/book/${id}`, bookData);
  return response.data;
};

/**
 * 도서 삭제
 */
export const deleteBook = async (id: number): Promise<void> => {
  await api.delete(`/book/${id}`);
};

/**
 * 모든 발견하기 도서 조회
 */
export const getAllDiscoverBooks = async (
  params?: PopularBooksParams
): Promise<Book[]> => {
  const response = await api.get<Book[]>('/book/discover/all', { params });
  return response.data;
};

/**
 * 특정 발견하기 카테고리의 도서 조회
 */
export const getBooksByDiscoverCategoryId = async (
  discoverCategoryId: number,
  discoverSubCategoryId?: number,
  sort: SortOption = 'rating-desc',
  timeRange: TimeRange = 'all'
): Promise<Book[]> => {
  // 쿼리 파라미터 구성
  const params: Record<string, string> = {
    sort,
    timeRange,
  };

  if (discoverSubCategoryId) {
    params.discoverSubCategoryId = discoverSubCategoryId.toString();
  }

  const response = await api.get<Book[]>(
    `/book/discover/category/${discoverCategoryId}`,
    { params }
  );
  return response.data;
};

/**
 * 특정 발견하기 서브카테고리의 도서 조회
 */
export const getBooksByDiscoverSubCategoryId = async (
  discoverSubCategoryId: number,
  sort: SortOption = 'rating-desc',
  timeRange: TimeRange = 'all'
): Promise<Book[]> => {
  // 쿼리 파라미터 구성
  const params: Record<string, string> = {
    sort,
    timeRange,
  };

  const response = await api.get<Book[]>(
    `/book/discover/subcategory/${discoverSubCategoryId}`,
    { params }
  );
  return response.data;
};

/**
 * 도서를 발견하기 카테고리에 추가
 */
export const addBookToDiscoverCategory = async (
  bookId: number,
  discoverCategoryId: number,
  discoverSubCategoryId?: number
): Promise<Book> => {
  const response = await api.post<Book>('/book/discover/add', {
    bookId,
    discoverCategoryId,
    discoverSubCategoryId,
  });
  return response.data;
};

/**
 * 도서를 발견하기 카테고리에서 제거
 */
export const removeBookFromDiscoverCategory = async (
  bookId: number
): Promise<Book> => {
  const response = await api.delete<Book>(`/book/discover/remove/${bookId}`);
  return response.data;
};

/**
 * 홈화면용 인기 도서 조회
 */
export const getPopularBooksForHome = async (
  limit: number = 4
): Promise<HomePopularBooksResponse> => {
  const response = await api.get<HomePopularBooksResponse>(
    '/book/popular/home',
    {
      params: { limit },
    }
  );
  return response.data;
};

/**
 * 홈화면용 오늘의 발견 도서 조회
 */
export const getDiscoverBooksForHome = async (
  limit: number = 6
): Promise<HomeDiscoverBooksResponse[]> => {
  const response = await api.get<HomeDiscoverBooksResponse[]>(
    '/book/discover/home',
    {
      params: { limit },
    }
  );
  return response.data;
};
