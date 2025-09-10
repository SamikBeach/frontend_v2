import {
  createDiscoverSubCategory,
  deleteDiscoverSubCategory,
  reorderDiscoverSubCategories,
  updateDiscoverSubCategory,
} from '@/apis/discover-category/discover-category';
import {
  CreateDiscoverSubCategoryDto,
  DiscoverSubCategory,
  UpdateDiscoverSubCategoryDto,
} from '@/apis/discover-category/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';

interface UseSubCategoryMutationsProps {
  onSubCategoryCreated?: (subCategory: DiscoverSubCategory) => void;
  onSubCategoryUpdated?: (subCategory: DiscoverSubCategory) => void;
  onSubCategoryDeleted?: (subCategoryId: number) => void;
  onSubCategoriesReordered?: () => void;
}

// 상수 정의
const QUERY_KEY = 'discover-categories';
const MESSAGES = {
  CREATE_SUCCESS: '서브카테고리가 생성되었습니다.',
  CREATE_ERROR: '서브카테고리 생성 중 오류가 발생했습니다.',
  UPDATE_SUCCESS: '서브카테고리가 수정되었습니다.',
  UPDATE_ERROR: '서브카테고리 수정 중 오류가 발생했습니다.',
  DELETE_SUCCESS: '서브카테고리가 삭제되었습니다.',
  DELETE_ERROR: '서브카테고리 삭제 중 오류가 발생했습니다.',
  REORDER_SUCCESS: '서브카테고리 순서가 변경되었습니다.',
  REORDER_ERROR: '서브카테고리 순서 변경 중 오류가 발생했습니다.',
} as const;

export const useSubCategoryMutations = ({
  onSubCategoryCreated,
  onSubCategoryUpdated,
  onSubCategoryDeleted,
  onSubCategoriesReordered,
}: UseSubCategoryMutationsProps = {}) => {
  const queryClient = useQueryClient();

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
  }, [queryClient]);

  const createSubCategoryMutation = useMutation({
    mutationFn: (data: CreateDiscoverSubCategoryDto) =>
      createDiscoverSubCategory(data),
    onSuccess: newSubCategory => {
      toast.success(MESSAGES.CREATE_SUCCESS);
      invalidateQueries();
      onSubCategoryCreated?.(newSubCategory);
    },
    onError: () => {
      toast.error(MESSAGES.CREATE_ERROR);
    },
  });

  const updateSubCategoryMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateDiscoverSubCategoryDto;
    }) => updateDiscoverSubCategory(id, data),
    onSuccess: updatedSubCategory => {
      toast.success(MESSAGES.UPDATE_SUCCESS);
      invalidateQueries();
      onSubCategoryUpdated?.(updatedSubCategory);
    },
    onError: () => {
      toast.error(MESSAGES.UPDATE_ERROR);
    },
  });

  const deleteSubCategoryMutation = useMutation({
    mutationFn: deleteDiscoverSubCategory,
    onSuccess: (_, subCategoryId) => {
      toast.success(MESSAGES.DELETE_SUCCESS);
      invalidateQueries();
      onSubCategoryDeleted?.(subCategoryId);
    },
    onError: () => {
      toast.error(MESSAGES.DELETE_ERROR);
    },
  });

  const reorderSubCategoriesMutation = useMutation({
    mutationFn: reorderDiscoverSubCategories,
    onSuccess: () => {
      toast.success(MESSAGES.REORDER_SUCCESS);
      invalidateQueries();
      onSubCategoriesReordered?.();
    },
    onError: () => {
      toast.error(MESSAGES.REORDER_ERROR);
    },
  });

  return {
    createSubCategoryMutation,
    updateSubCategoryMutation,
    deleteSubCategoryMutation,
    reorderSubCategoriesMutation,
  };
};
