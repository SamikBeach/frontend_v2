import api from '../axios';
import {
  CreateDiscoverCategoryDto,
  CreateDiscoverSubCategoryDto,
  DiscoverCategory,
  DiscoverSubCategory,
  UpdateDiscoverCategoryDto,
  UpdateDiscoverSubCategoryDto,
} from './types';

/**
 * 모든 발견하기 카테고리 조회
 */
export const getAllDiscoverCategories = async (): Promise<
  DiscoverCategory[]
> => {
  const response = await api.get<DiscoverCategory[]>('/discover-categories');
  return response.data;
};

/**
 * ID로 발견하기 카테고리 조회
 */
export const getDiscoverCategoryById = async (
  id: number
): Promise<DiscoverCategory> => {
  const response = await api.get<DiscoverCategory>(
    `/discover-categories/${id}`
  );
  return response.data;
};

/**
 * 발견하기 카테고리에 속한 서브카테고리 조회
 */
export const getDiscoverSubCategoriesByCategory = async (
  categoryId: number
): Promise<DiscoverSubCategory[]> => {
  const response = await api.get<DiscoverSubCategory[]>(
    `/discover-categories/${categoryId}/subcategories`
  );
  return response.data;
};

/**
 * ID로 발견하기 서브카테고리 조회
 */
export const getDiscoverSubCategoryById = async (
  id: number
): Promise<DiscoverSubCategory> => {
  const response = await api.get<DiscoverSubCategory>(
    `/discover-categories/subcategories/${id}`
  );
  return response.data;
};

/**
 * 모든 발견하기 데이터 조회 (카테고리, 서브카테고리 및 도서 카운트)
 */
export const getAllDiscoverData = async (): Promise<DiscoverCategory[]> => {
  const response = await api.get<DiscoverCategory[]>(
    '/discover-categories/all/data'
  );
  return response.data;
};

/**
 * 발견하기 카테고리 생성
 */
export const createDiscoverCategory = async (
  data: CreateDiscoverCategoryDto
): Promise<DiscoverCategory> => {
  const response = await api.post<DiscoverCategory>(
    '/discover-categories',
    data
  );
  return response.data;
};

/**
 * 발견하기 카테고리 업데이트
 */
export const updateDiscoverCategory = async (
  id: number,
  data: UpdateDiscoverCategoryDto
): Promise<DiscoverCategory> => {
  const response = await api.patch<DiscoverCategory>(
    `/discover-categories/${id}`,
    data
  );
  return response.data;
};

/**
 * 발견하기 카테고리 삭제
 */
export const deleteDiscoverCategory = async (id: number): Promise<void> => {
  await api.delete(`/discover-categories/${id}`);
};

/**
 * 발견하기 서브카테고리 생성
 */
export const createDiscoverSubCategory = async (
  data: CreateDiscoverSubCategoryDto
): Promise<DiscoverSubCategory> => {
  const response = await api.post<DiscoverSubCategory>(
    '/discover-categories/subcategories',
    data
  );
  return response.data;
};

/**
 * 발견하기 서브카테고리 업데이트
 */
export const updateDiscoverSubCategory = async (
  id: number,
  data: UpdateDiscoverSubCategoryDto
): Promise<DiscoverSubCategory> => {
  const response = await api.patch<DiscoverSubCategory>(
    `/discover-categories/subcategories/${id}`,
    data
  );
  return response.data;
};

/**
 * 발견하기 서브카테고리 삭제
 */
export const deleteDiscoverSubCategory = async (id: number): Promise<void> => {
  await api.delete(`/discover-categories/subcategories/${id}`);
};
