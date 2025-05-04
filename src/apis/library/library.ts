import api from '../axios';
import {
  AddBookResponse,
  AddBooksToLibraryDto,
  AddBookToLibraryDto,
  AddTagToLibraryDto,
  CreateLibraryDto,
  Library,
  LibraryBook,
  LibrarySortOption,
  LibraryTag,
  PaginatedLibraryResponse,
  UpdateHistoryItem,
  UpdateLibraryDto,
  UserInfo,
} from './types';

/**
 * 모든 서재 목록 조회 (공개된 서재만) - 페이지네이션, 검색, 정렬, 태그 필터링 지원
 */
export const getAllLibraries = async (
  page: number = 1,
  limit: number = 10,
  sort?: LibrarySortOption,
  query?: string,
  tagId?: number
): Promise<PaginatedLibraryResponse> => {
  const params: Record<string, string> = {};

  if (page) params.page = page.toString();
  if (limit) params.limit = limit.toString();
  if (sort) params.sort = sort;
  if (query && query.trim() !== '') params.query = query;
  if (tagId) params.tagId = tagId.toString();

  const response = await api.get<PaginatedLibraryResponse>('/library', {
    params,
  });
  return response.data;
};

/**
 * 특정 사용자의 서재 목록 조회
 */
export const getLibrariesByUser = async (
  userId: number,
  requestingUserId?: number,
  sort?: LibrarySortOption
): Promise<Library[]> => {
  const params: Record<string, string> = {};

  if (requestingUserId) params.requestingUserId = requestingUserId.toString();
  if (sort) params.sort = sort;

  const response = await api.get<Library[]>(`/library/user/${userId}`, {
    params,
  });
  return response.data;
};

/**
 * 사용자가 구독한 서재 목록 조회
 */
export const getSubscribedLibraries = async (
  sort?: LibrarySortOption
): Promise<Library[]> => {
  const params: Record<string, string> = {};

  if (sort) params.sort = sort;

  const response = await api.get<Library[]>('/library/subscribed', {
    params,
  });
  return response.data;
};

/**
 * 특정 서재 상세 조회
 */
export const getLibraryById = async (id: number): Promise<Library> => {
  const response = await api.get<Library>(`/library/${id}`);
  return response.data;
};

/**
 * 서재 생성
 */
export const createLibrary = async (
  createLibraryDto: CreateLibraryDto
): Promise<Library> => {
  const response = await api.post<Library>('/library', createLibraryDto);
  return response.data;
};

/**
 * 서재 수정
 */
export const updateLibrary = async (
  id: number,
  updateLibraryDto: UpdateLibraryDto
): Promise<Library> => {
  const response = await api.patch<Library>(`/library/${id}`, updateLibraryDto);
  return response.data;
};

/**
 * 서재 삭제
 */
export const deleteLibrary = async (id: number): Promise<void> => {
  await api.delete(`/library/${id}`);
};

/**
 * 서재에 책 추가
 */
export const addBookToLibrary = async (
  libraryId: number,
  addBookToLibraryDto: AddBookToLibraryDto
): Promise<LibraryBook> => {
  const response = await api.post<LibraryBook>(
    `/library/${libraryId}/books`,
    addBookToLibraryDto
  );
  return response.data;
};

/**
 * 서재에서 책 제거
 */
export const removeBookFromLibrary = async (
  libraryId: number,
  bookId: number
): Promise<void> => {
  await api.delete(`/library/${libraryId}/book/${bookId}`);
};

/**
 * 서재에 태그 추가
 */
export const addTagToLibrary = async (
  libraryId: number,
  addTagToLibraryDto: AddTagToLibraryDto
): Promise<LibraryTag> => {
  const response = await api.post<LibraryTag>(
    `/library/${libraryId}/tag`,
    addTagToLibraryDto
  );
  return response.data;
};

/**
 * 서재에서 태그 제거
 */
export const removeTagFromLibrary = async (
  libraryId: number,
  tagId: number
): Promise<void> => {
  await api.delete(`/library/${libraryId}/tag/${tagId}`);
};

/**
 * 서재 구독하기
 */
export const subscribeToLibrary = async (libraryId: number): Promise<void> => {
  await api.post(`/library/${libraryId}/subscribe`);
};

/**
 * 서재 구독 취소하기
 */
export const unsubscribeFromLibrary = async (
  libraryId: number
): Promise<void> => {
  await api.delete(`/library/${libraryId}/subscribe`);
};

/**
 * 서재의 구독자 목록 조회
 */
export const getLibrarySubscribers = async (
  libraryId: number
): Promise<UserInfo[]> => {
  const response = await api.get<UserInfo[]>(
    `/library/${libraryId}/subscribers`
  );
  return response.data;
};

/**
 * 서재의 최근 업데이트 이력 조회
 */
export const getLibraryUpdates = async (
  libraryId: number,
  limit?: number
): Promise<UpdateHistoryItem[]> => {
  const params = limit ? { limit: limit.toString() } : undefined;
  const response = await api.get<UpdateHistoryItem[]>(
    `/library/${libraryId}/updates`,
    { params }
  );
  return response.data;
};

/**
 * 홈화면용 인기 서재 조회
 */
export const getPopularLibrariesForHome = async (
  limit: number = 3
): Promise<PaginatedLibraryResponse> => {
  const response = await api.get<PaginatedLibraryResponse>(
    '/library/popular/home',
    {
      params: { limit },
    }
  );

  // API 응답 구조를 확인하고 처리
  // response.data가 { data: [...], meta: {...} } 형태인지 확인
  if (response.data && 'data' in response.data && 'meta' in response.data) {
    return response.data;
  }

  // 다른 형태의 응답인 경우 적절한 형태로 변환
  return {
    data: Array.isArray(response.data) ? response.data : [response.data],
    meta: {
      total: 1,
      page: 1,
      limit: limit,
      totalPages: 1,
    },
  };
};

/**
 * 서재에 책 추가 (ISBN 사용)
 */
export const addBookToLibraryWithIsbn = async ({
  libraryId,
  bookId,
  isbn,
}: {
  libraryId: number;
  bookId: number;
  isbn: string;
}): Promise<LibraryBook> => {
  const response = await api.post<LibraryBook>(`/library/${libraryId}/books`, {
    bookId,
    note: `ISBN: ${isbn}`,
    isbn,
  });
  return response.data;
};

/**
 * 특정 책이 등록된 서재 목록 조회
 */
export const getLibrariesByBookId = async (
  bookId: number,
  page: number = 1,
  limit: number = 10,
  isbn?: string,
  sort?: LibrarySortOption
): Promise<PaginatedLibraryResponse> => {
  const params: Record<string, string> = {};

  if (page) params.page = page.toString();
  if (limit) params.limit = limit.toString();
  if (isbn) params.isbn = isbn;
  if (sort) params.sort = sort;

  const response = await api.get<PaginatedLibraryResponse>(
    `/library/book/${bookId}`,
    { params }
  );

  return response.data;
};

/**
 * 서재에 여러 권의 책 추가
 */
export const addBooksToLibrary = async (
  libraryId: number,
  addBooksToLibraryDto: AddBooksToLibraryDto
): Promise<AddBookResponse> => {
  const response = await api.post<AddBookResponse>(
    `/library/${libraryId}/books/batch`,
    addBooksToLibraryDto
  );
  return response.data;
};
