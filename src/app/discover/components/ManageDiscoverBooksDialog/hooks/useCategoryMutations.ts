import {
  createDiscoverCategory,
  deleteDiscoverCategory,
  reorderDiscoverCategories,
  updateDiscoverCategory,
} from '@/apis/discover-category/discover-category';
import {
  CreateDiscoverCategoryDto,
  DiscoverCategory,
  UpdateDiscoverCategoryDto,
} from '@/apis/discover-category/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseCategoryMutationsProps {
  onCategoryCreated?: (category: DiscoverCategory) => void;
  onCategoryUpdated?: (category: DiscoverCategory) => void;
  onCategoryDeleted?: (categoryId: number) => void;
  onCategoriesReordered?: () => void;
}

export const useCategoryMutations = ({
  onCategoryCreated,
  onCategoryUpdated,
  onCategoryDeleted,
  onCategoriesReordered,
}: UseCategoryMutationsProps = {}) => {
  const queryClient = useQueryClient();

  const createCategoryMutation = useMutation({
    mutationFn: (data: CreateDiscoverCategoryDto) =>
      createDiscoverCategory(data),
    onSuccess: newCategory => {
      toast.success('카테고리가 생성되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['discover-categories'],
      });
      onCategoryCreated?.(newCategory);
    },
    onError: () => {
      toast.error('카테고리 생성 중 오류가 발생했습니다.');
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateDiscoverCategoryDto;
    }) => updateDiscoverCategory(id, data),
    onSuccess: updatedCategory => {
      toast.success('카테고리가 수정되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['discover-categories'],
      });
      onCategoryUpdated?.(updatedCategory);
    },
    onError: () => {
      toast.error('카테고리 수정 중 오류가 발생했습니다.');
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryId: number) => deleteDiscoverCategory(categoryId),
    onSuccess: (_, categoryId) => {
      toast.success('카테고리가 삭제되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['discover-categories'],
      });
      onCategoryDeleted?.(categoryId);
    },
    onError: () => {
      toast.error('카테고리 삭제 중 오류가 발생했습니다.');
    },
  });

  const reorderCategoriesMutation = useMutation({
    mutationFn: (data: {
      categories: { id: number; displayOrder: number }[];
    }) => reorderDiscoverCategories(data),
    onSuccess: () => {
      toast.success('카테고리 순서가 변경되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['discover-categories'],
      });
      onCategoriesReordered?.();
    },
    onError: () => {
      toast.error('카테고리 순서 변경 중 오류가 발생했습니다.');
    },
  });

  return {
    createCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
    reorderCategoriesMutation,
  };
};
