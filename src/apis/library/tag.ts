import api from '../axios';
import { TagListResponseDto, TagResponseDto } from './types';

/**
 * 모든 태그 조회
 */
export const getAllTags = async (
  page?: number,
  limit?: number,
  search?: string
): Promise<TagListResponseDto> => {
  const params: any = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (search) params.search = search;

  const response = await api.get<TagListResponseDto>('/tag', { params });
  return response.data;
};

/**
 * 인기 태그 조회
 */
export const getPopularTags = async (
  limit?: number
): Promise<TagResponseDto[]> => {
  const params = limit ? { limit } : undefined;
  const response = await api.get<TagResponseDto[]>('/tag/popular', { params });
  return response.data;
};

/**
 * 태그 상세 정보 조회
 */
export const getTagById = async (id: number): Promise<TagResponseDto> => {
  const response = await api.get<TagResponseDto>(`/tag/${id}`);
  return response.data;
};

/**
 * 태그 정보 업데이트
 */
export const updateTag = async (
  id: number,
  name?: string,
  description?: string
): Promise<TagResponseDto> => {
  const response = await api.patch<TagResponseDto>(`/tag/${id}`, {
    name,
    description,
  });
  return response.data;
};

/**
 * 태그 병합
 */
export const mergeTags = async (
  sourceTagId: number,
  targetTagId: number
): Promise<{ success: boolean; message: string }> => {
  const response = await api.post<{ success: boolean; message: string }>(
    '/tag/merge',
    {
      sourceTagId,
      targetTagId,
    }
  );
  return response.data;
};
