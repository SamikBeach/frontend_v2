import api from '../axios';
import { LibraryTagListResponseDto, LibraryTagResponseDto } from './types';

/**
 * 모든 라이브러리 태그 조회
 */
export const getAllLibraryTags = async (
  page?: number,
  limit?: number,
  search?: string
): Promise<LibraryTagListResponseDto> => {
  const params: any = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (search) params.search = search;

  const response = await api.get<LibraryTagListResponseDto>('/library-tag', {
    params,
  });
  return response.data;
};

/**
 * 인기 라이브러리 태그 조회
 */
export const getPopularLibraryTags = async (
  limit?: number
): Promise<LibraryTagResponseDto[]> => {
  const params = limit ? { limit } : undefined;
  const response = await api.get<LibraryTagResponseDto[]>(
    '/library-tag/popular',
    { params }
  );
  return response.data;
};

/**
 * 라이브러리 태그 상세 정보 조회
 */
export const getLibraryTagById = async (
  id: number
): Promise<LibraryTagResponseDto> => {
  const response = await api.get<LibraryTagResponseDto>(`/library-tag/${id}`);
  return response.data;
};

/**
 * 라이브러리 태그 정보 업데이트
 */
export const updateLibraryTag = async (
  id: number,
  name?: string,
  description?: string
): Promise<LibraryTagResponseDto> => {
  const response = await api.patch<LibraryTagResponseDto>(
    `/library-tag/${id}`,
    {
      name,
      description,
    }
  );
  return response.data;
};

/**
 * 라이브러리 태그 병합
 */
export const mergeLibraryTags = async (
  sourceTagId: number,
  targetTagId: number
): Promise<{ success: boolean; message: string }> => {
  const response = await api.post<{ success: boolean; message: string }>(
    '/library-tag/merge',
    {
      sourceTagId,
      targetTagId,
    }
  );
  return response.data;
};
