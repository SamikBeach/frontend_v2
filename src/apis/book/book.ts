import api from '../axios';
import {
  Book,
  BookSearchResponse,
  CreateBookDto,
  DiscoverBooksParams,
  HomeDiscoverBooksResponse,
  HomePopularBooksResponse,
  PopularBooksParams,
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
 * 도서를 발견하기 카테고리에 추가
 */
export const addBookToDiscoverCategory = async (
  bookId: number | undefined,
  discoverCategoryId: number,
  discoverSubCategoryId?: number,
  isbn?: string
): Promise<Book> => {
  const response = await api.post<Book>(
    '/book/discover/add',
    {},
    {
      params: {
        bookId: bookId && bookId > 0 ? bookId : undefined,
        isbn: (!bookId || bookId <= 0) && isbn ? isbn : undefined,
        discoverCategoryId,
        discoverSubCategoryId,
      },
    }
  );
  return response.data;
};

/**
 * 도서를 발견하기 카테고리에서 제거
 */
export const removeBookFromDiscoverCategory = async (
  bookId: number
): Promise<Book> => {
  const response = await api.post<Book>(
    '/book/discover/remove',
    {},
    {
      params: { bookId },
    }
  );
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

/**
 * 인기 도서 조회 (무한 스크롤 지원)
 * 카테고리, 서브카테고리, 정렬, 기간 필터링 지원
 */
export const getPopularBooks = async (
  params: PopularBooksParams
): Promise<BookSearchResponse> => {
  const response = await api.get<BookSearchResponse>('/book/popular', {
    params,
  });
  return response.data;
};

/**
 * 발견하기 도서 조회 (무한 스크롤 지원)
 * 발견하기 카테고리, 서브카테고리, 정렬, 기간 필터링 지원
 */
export const getDiscoverBooks = async (
  params: DiscoverBooksParams
): Promise<BookSearchResponse> => {
  const response = await api.get<BookSearchResponse>('/book/discover', {
    params,
  });
  return response.data;
};

/**
 * 발견하기 카테고리 통계 조회 (단순 모의 데이터 반환)
 */
export const getDiscoverBooksStats = async (): Promise<any> => {
  // 간단한 모의 데이터 반환
  return {
    categories: [],
    stats: {
      totalBooks: 0,
    },
  };
};
