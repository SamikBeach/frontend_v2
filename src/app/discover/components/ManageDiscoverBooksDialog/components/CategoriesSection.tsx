import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useDiscoverCategories } from '../../../hooks/useDiscoverCategories';
import {
  useCategoryFormState,
  useCategoryManagement,
  useCategoryMutations,
  useCategorySelection,
} from '../hooks';
import { CategoryForm } from './CategoryForm';
import { DraggableCategory } from './DraggableCategory';

export function CategoriesSection() {
  const queryClient = useQueryClient();
  const { categories } = useDiscoverCategories({ includeInactive: true });
  const { selectedCategoryForManagement, setSelectedCategoryForManagement } =
    useCategoryManagement();
  const { setSelectedCategoryId, setSelectedSubcategoryId } =
    useCategorySelection();

  const {
    isCreatingCategory,
    setIsCreatingCategory,
    isEditingCategory,
    setIsEditingCategory,
    categoryForm,
    setCategoryForm,
  } = useCategoryFormState();

  // 카테고리 선택 핸들러
  const handleCategorySelect = useCallback(
    (category: any) => {
      setSelectedCategoryForManagement(category);

      // 도서 관리 탭의 상태도 함께 업데이트
      setSelectedCategoryId(category.id.toString());
      if (category.subCategories && category.subCategories.length > 0) {
        setSelectedSubcategoryId(category.subCategories[0].id.toString());
      } else {
        setSelectedSubcategoryId('');
      }
    },
    [
      setSelectedCategoryForManagement,
      setSelectedCategoryId,
      setSelectedSubcategoryId,
    ]
  );

  // 카테고리 목록이 로드되면 첫 번째 카테고리를 자동으로 선택
  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryForManagement) {
      handleCategorySelect(categories[0]);
    }
  }, [categories, selectedCategoryForManagement, handleCategorySelect]);

  const {
    createCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
    reorderCategoriesMutation,
  } = useCategoryMutations({
    onCategoryCreated: newCategory => {
      setIsCreatingCategory(false);
      setCategoryForm({ name: '', isActive: true });

      // 새로 생성된 카테고리를 자동으로 선택
      handleCategorySelect(newCategory);
    },
    onCategoryUpdated: updatedCategory => {
      setIsEditingCategory(null);
      setCategoryForm({ name: '', isActive: true });

      // 현재 선택된 카테고리가 업데이트된 카테고리라면 atom 업데이트
      if (selectedCategoryForManagement?.id === updatedCategory.id) {
        const updatedCategoryWithSubCategories = {
          ...updatedCategory,
          subCategories: selectedCategoryForManagement.subCategories || [],
        };
        setSelectedCategoryForManagement(updatedCategoryWithSubCategories);
      }
    },
    onCategoryDeleted: deletedCategoryId => {
      // 삭제된 카테고리가 현재 선택된 카테고리라면 선택 해제
      if (selectedCategoryForManagement?.id === deletedCategoryId) {
        setSelectedCategoryForManagement(null);
        // 다른 카테고리가 있다면 첫 번째 카테고리 선택
        const remainingCategories = categories.filter(
          cat => cat.id !== deletedCategoryId
        );
        if (remainingCategories.length > 0) {
          handleCategorySelect(remainingCategories[0]);
        }
      }
    },
  });

  // 카테고리 순서 변경 함수 - react-query 캐시 직접 업데이트
  const moveCategory = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const updatedCategories = [...categories];
      const [draggedCategory] = updatedCategories.splice(dragIndex, 1);
      updatedCategories.splice(hoverIndex, 0, draggedCategory);

      // react-query 캐시 즉시 업데이트
      queryClient.setQueryData(['discover-categories'], updatedCategories);
    },
    [categories, queryClient]
  );

  // 카테고리 드롭 시 API 호출
  const handleCategoryDrop = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (reorderCategoriesMutation.isPending) return;

      const reorderData = categories.map((category, index) => ({
        id: category.id,
        displayOrder: index,
      }));

      reorderCategoriesMutation.mutate(reorderData);
    },
    [reorderCategoriesMutation, categories]
  );

  // 카테고리 활성화 토글 함수
  const handleToggleCategoryActive = useCallback(
    (categoryId: number, isActive: boolean) => {
      updateCategoryMutation.mutate({
        id: categoryId,
        data: { isActive },
      });

      // 현재 선택된 카테고리의 활성화 상태를 즉시 업데이트
      if (selectedCategoryForManagement?.id === categoryId) {
        setSelectedCategoryForManagement({
          ...selectedCategoryForManagement,
          isActive,
        });
      }
    },
    [
      updateCategoryMutation,
      selectedCategoryForManagement,
      setSelectedCategoryForManagement,
    ]
  );

  const handleCreateCategory = () => {
    if (!categoryForm.name.trim()) {
      return;
    }
    createCategoryMutation.mutate({
      name: categoryForm.name,
      description: '',
      displayOrder: categories.length,
      isActive: categoryForm.isActive,
    });
  };

  const handleEditCategory = (category: any) => {
    setIsEditingCategory(category.id);
    setCategoryForm({
      name: category.name,
      isActive: category.isActive,
    });
  };

  const handleUpdateCategory = () => {
    if (!categoryForm.name.trim() || isEditingCategory === null) {
      return;
    }
    updateCategoryMutation.mutate({
      id: isEditingCategory,
      data: {
        name: categoryForm.name,
        description: '',
        displayOrder: 0,
        isActive: categoryForm.isActive,
      },
    });
  };

  const cancelCategoryEdit = () => {
    setIsEditingCategory(null);
    setIsCreatingCategory(false);
    setCategoryForm({ name: '', isActive: true });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-800">카테고리</h3>
        <Button
          onClick={() => setIsCreatingCategory(true)}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />새 카테고리
        </Button>
      </div>

      {/* 카테고리 생성 폼 */}
      {isCreatingCategory && (
        <CategoryForm
          categoryForm={categoryForm}
          setCategoryForm={setCategoryForm}
          onSubmit={handleCreateCategory}
          onCancel={cancelCategoryEdit}
          isLoading={createCategoryMutation.isPending}
          mode="create"
        />
      )}

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-2 pr-4">
          {categories.map((category, index) => (
            <div key={category.id} className="space-y-2">
              <DraggableCategory
                category={category}
                index={index}
                isSelected={selectedCategoryForManagement?.id === category.id}
                onSelect={handleCategorySelect}
                onEdit={handleEditCategory}
                onDelete={deleteCategoryMutation.mutate}
                onToggleActive={handleToggleCategoryActive}
                onMove={moveCategory}
                onDrop={handleCategoryDrop}
              />
              {/* 카테고리 수정 폼 */}
              {isEditingCategory === category.id && (
                <CategoryForm
                  categoryForm={categoryForm}
                  setCategoryForm={setCategoryForm}
                  onSubmit={handleUpdateCategory}
                  onCancel={cancelCategoryEdit}
                  isLoading={updateCategoryMutation.isPending}
                  mode="edit"
                />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
