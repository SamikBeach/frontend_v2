import api from '../axios';
import {
  Book,
  CreateBookDto,
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
