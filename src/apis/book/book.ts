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
  const response = await api.get<Book[]>('/books');
  return response.data;
};

/**
 * ID로 도서 조회
 */
export const getBookById = async (id: number): Promise<Book> => {
  const response = await api.get<Book>(`/books/${id}`);
  return response.data;
};

/**
 * ISBN으로 도서 조회
 * isbn13이 있으면 우선 사용하고, 없으면 isbn 사용
 */
export const getBookByIsbn = async (isbn: string): Promise<Book> => {
  const response = await api.get<Book>(`/books/isbn/${isbn}`);
  return response.data;
};

/**
 * 추천 도서 조회
 */
export const getFeaturedBooks = async (): Promise<Book[]> => {
  const response = await api.get<Book[]>('/books/featured');
  return response.data;
};

/**
 * 특정 카테고리의 도서 조회
 */
export const getBooksByCategoryId = async (
  categoryId: number
): Promise<Book[]> => {
  const response = await api.get<Book[]>(`/books/category/${categoryId}`);
  return response.data;
};

/**
 * 특정 서브카테고리의 도서 조회
 */
export const getBooksBySubcategoryId = async (
  subcategoryId: number
): Promise<Book[]> => {
  const response = await api.get<Book[]>(`/books/subcategory/${subcategoryId}`);
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
    `/books/popular/category/${categoryId}`,
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
  const response = await api.get<Book[]>('/books/popular/all', { params });
  return response.data;
};

/**
 * 새 도서 생성
 */
export const createBook = async (bookData: CreateBookDto): Promise<Book> => {
  const response = await api.post<Book>('/books', bookData);
  return response.data;
};

/**
 * 도서 업데이트
 */
export const updateBook = async (
  id: number,
  bookData: UpdateBookDto
): Promise<Book> => {
  const response = await api.patch<Book>(`/books/${id}`, bookData);
  return response.data;
};

/**
 * 도서 삭제
 */
export const deleteBook = async (id: number): Promise<void> => {
  await api.delete(`/books/${id}`);
};

/**
 * 모든 발견하기 도서 조회
 */
export const getAllDiscoverBooks = async (
  params?: PopularBooksParams
): Promise<Book[]> => {
  const response = await api.get<Book[]>('/books/discover/all', { params });
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
    `/books/discover/category/${discoverCategoryId}`,
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
    `/books/discover/subcategory/${discoverSubCategoryId}`,
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
  const response = await api.post<Book>('/books/discover/add', {
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
  const response = await api.delete<Book>(`/books/discover/remove/${bookId}`);
  return response.data;
};

/**
 * 홈화면용 인기 도서 조회
 */
export const getPopularBooksForHome = async (
  limit: number = 4
): Promise<HomePopularBooksResponse> => {
  const response = await api.get<HomePopularBooksResponse>(
    '/books/popular/home',
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
    '/books/discover/home',
    {
      params: { limit },
    }
  );
  return response.data;
};
