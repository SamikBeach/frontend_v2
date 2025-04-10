import api from '../axios';
import {
  AddBookToLibraryDto,
  AddTagToLibraryDto,
  CreateLibraryDto,
  Library,
  LibraryBook,
  LibrarySummary,
  LibraryTag,
  Subscriber,
  UpdateLibraryDto,
} from './types';

/**
 * 모든 서재 목록 조회 (공개된 서재만)
 */
export const getAllLibraries = async (
  userId?: number
): Promise<LibrarySummary[]> => {
  const params = userId ? { userId } : undefined;
  const response = await api.get<LibrarySummary[]>('/libraries', { params });
  return response.data;
};

/**
 * 특정 사용자의 서재 목록 조회
 */
export const getLibrariesByUser = async (
  userId: number,
  requestingUserId?: number
): Promise<LibrarySummary[]> => {
  const params = requestingUserId ? { requestingUserId } : undefined;
  const response = await api.get<LibrarySummary[]>(
    `/libraries/user/${userId}`,
    {
      params,
    }
  );
  return response.data;
};

/**
 * 사용자가 구독한 서재 목록 조회
 */
export const getSubscribedLibraries = async (): Promise<LibrarySummary[]> => {
  const response = await api.get<LibrarySummary[]>('/libraries/subscribed');
  return response.data;
};

/**
 * 특정 서재 상세 조회
 */
export const getLibraryById = async (
  id: number,
  userId?: number
): Promise<Library> => {
  const params = userId ? { userId } : undefined;
  const response = await api.get<Library>(`/libraries/${id}`, { params });
  return response.data;
};

/**
 * 서재 생성
 */
export const createLibrary = async (
  createLibraryDto: CreateLibraryDto
): Promise<Library> => {
  const response = await api.post<Library>('/libraries', createLibraryDto);
  return response.data;
};

/**
 * 서재 수정
 */
export const updateLibrary = async (
  id: number,
  updateLibraryDto: UpdateLibraryDto
): Promise<Library> => {
  const response = await api.patch<Library>(
    `/libraries/${id}`,
    updateLibraryDto
  );
  return response.data;
};

/**
 * 서재 삭제
 */
export const deleteLibrary = async (id: number): Promise<void> => {
  await api.delete(`/libraries/${id}`);
};

/**
 * 서재에 책 추가
 */
export const addBookToLibrary = async (
  libraryId: number,
  addBookToLibraryDto: AddBookToLibraryDto
): Promise<LibraryBook> => {
  const response = await api.post<LibraryBook>(
    `/libraries/${libraryId}/books`,
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
  await api.delete(`/libraries/${libraryId}/books/${bookId}`);
};

/**
 * 서재에 태그 추가
 */
export const addTagToLibrary = async (
  libraryId: number,
  addTagToLibraryDto: AddTagToLibraryDto
): Promise<LibraryTag> => {
  const response = await api.post<LibraryTag>(
    `/libraries/${libraryId}/tags`,
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
  await api.delete(`/libraries/${libraryId}/tags/${tagId}`);
};

/**
 * 서재 구독하기
 */
export const subscribeToLibrary = async (libraryId: number): Promise<void> => {
  await api.post(`/libraries/${libraryId}/subscribe`);
};

/**
 * 서재 구독 취소하기
 */
export const unsubscribeFromLibrary = async (
  libraryId: number
): Promise<void> => {
  await api.delete(`/libraries/${libraryId}/subscribe`);
};

/**
 * 서재의 구독자 목록 조회
 */
export const getLibrarySubscribers = async (
  libraryId: number
): Promise<Subscriber[]> => {
  const response = await api.get<Subscriber[]>(
    `/libraries/${libraryId}/subscribers`
  );
  return response.data;
};
