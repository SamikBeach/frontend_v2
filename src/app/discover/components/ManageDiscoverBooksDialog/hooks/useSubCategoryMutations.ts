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
import { toast } from 'sonner';

interface UseSubCategoryMutationsProps {
  onSubCategoryCreated?: (subCategory: DiscoverSubCategory) => void;
  onSubCategoryUpdated?: (subCategory: DiscoverSubCategory) => void;
  onSubCategoryDeleted?: (subCategoryId: number) => void;
  onSubCategoriesReordered?: () => void;
}

export const useSubCategoryMutations = ({
  onSubCategoryCreated,
  onSubCategoryUpdated,
  onSubCategoryDeleted,
  onSubCategoriesReordered,
}: UseSubCategoryMutationsProps = {}) => {
  const queryClient = useQueryClient();

  const createSubCategoryMutation = useMutation({
    mutationFn: (data: CreateDiscoverSubCategoryDto) =>
      createDiscoverSubCategory(data),
    onSuccess: newSubCategory => {
      toast.success('서브카테고리가 생성되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['discover-categories'],
      });
      onSubCategoryCreated?.(newSubCategory);
    },
    onError: () => {
      toast.error('서브카테고리 생성 중 오류가 발생했습니다.');
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
      toast.success('서브카테고리가 수정되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['discover-categories'],
      });
      onSubCategoryUpdated?.(updatedSubCategory);
    },
    onError: () => {
      toast.error('서브카테고리 수정 중 오류가 발생했습니다.');
    },
  });

  const deleteSubCategoryMutation = useMutation({
    mutationFn: (subCategoryId: number) =>
      deleteDiscoverSubCategory(subCategoryId),
    onSuccess: (_, subCategoryId) => {
      toast.success('서브카테고리가 삭제되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['discover-categories'],
      });
      onSubCategoryDeleted?.(subCategoryId);
    },
    onError: () => {
      toast.error('서브카테고리 삭제 중 오류가 발생했습니다.');
    },
  });

  const reorderSubCategoriesMutation = useMutation({
    mutationFn: (data: {
      categoryId: number;
      subCategories: { id: number; displayOrder: number }[];
    }) => reorderDiscoverSubCategories(data),
    onSuccess: () => {
      toast.success('서브카테고리 순서가 변경되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['discover-categories'],
      });
      onSubCategoriesReordered?.();
    },
    onError: () => {
      toast.error('서브카테고리 순서 변경 중 오류가 발생했습니다.');
    },
  });

  return {
    createSubCategoryMutation,
    updateSubCategoryMutation,
    deleteSubCategoryMutation,
    reorderSubCategoriesMutation,
  };
};
