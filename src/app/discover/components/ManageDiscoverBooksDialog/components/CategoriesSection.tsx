import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useDiscoverCategories } from '../../../hooks/useDiscoverCategories';
import {
  useCategoryFormState,
  useCategoryManagement,
  useCategoryMutations,
} from '../hooks';
import { CategoryForm } from './CategoryForm';
import { DraggableCategory } from './DraggableCategory';

export function CategoriesSection() {
  const { categories } = useDiscoverCategories({ includeInactive: true });
  const {
    selectedCategoryForManagement,
    setSelectedCategoryForManagement,
    localCategoriesState,
    setLocalCategoriesState,
  } = useCategoryManagement();

  const {
    isCreatingCategory,
    setIsCreatingCategory,
    isEditingCategory,
    setIsEditingCategory,
    categoryForm,
    setCategoryForm,
  } = useCategoryFormState();

  // 카테고리 데이터가 변경될 때 로컬 상태 동기화
  const localCategories = useMemo(() => {
    if (categories.length > 0) {
      if (
        localCategoriesState.length === 0 ||
        localCategoriesState.length !== categories.length
      ) {
        setLocalCategoriesState(categories);
      }
      return localCategoriesState.length > 0
        ? localCategoriesState
        : categories;
    }
    return categories;
  }, [categories, localCategoriesState, setLocalCategoriesState]);

  const {
    createCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
    reorderCategoriesMutation,
  } = useCategoryMutations({
    onCategoryCreated: newCategory => {
      setLocalCategoriesState(prev => [...prev, newCategory]);
      setIsCreatingCategory(false);
      setCategoryForm({ name: '', isActive: true });
    },
    onCategoryUpdated: updatedCategory => {
      setLocalCategoriesState(prev =>
        prev.map(cat => (cat.id === updatedCategory.id ? updatedCategory : cat))
      );
      if (selectedCategoryForManagement?.id === updatedCategory.id) {
        setSelectedCategoryForManagement(updatedCategory);
      }
      setIsEditingCategory(null);
      setCategoryForm({ name: '', isActive: true });
    },
    onCategoryDeleted: deletedCategoryId => {
      setLocalCategoriesState(prev =>
        prev.filter(cat => cat.id !== deletedCategoryId)
      );
      if (selectedCategoryForManagement?.id === deletedCategoryId) {
        setSelectedCategoryForManagement(null);
      }
    },
  });

  // 카테고리 순서 변경 함수
  const moveCategory = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const updatedCategories = [...localCategoriesState];
      const [draggedCategory] = updatedCategories.splice(dragIndex, 1);
      updatedCategories.splice(hoverIndex, 0, draggedCategory);
      setLocalCategoriesState(updatedCategories);
    },
    [localCategoriesState, setLocalCategoriesState]
  );

  // 카테고리 드롭 시 API 호출
  const handleCategoryDrop = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (reorderCategoriesMutation.isPending) return;

      const reorderData = {
        categories: localCategoriesState.map((category, index) => ({
          id: category.id,
          displayOrder: index,
        })),
      };

      reorderCategoriesMutation.mutate(reorderData);
    },
    [reorderCategoriesMutation, localCategoriesState]
  );

  // 카테고리 활성화 토글 함수
  const handleToggleCategoryActive = useCallback(
    (categoryId: number, isActive: boolean) => {
      setLocalCategoriesState(prev =>
        prev.map(cat => (cat.id === categoryId ? { ...cat, isActive } : cat))
      );

      if (selectedCategoryForManagement?.id === categoryId) {
        const updatedCategory = {
          ...selectedCategoryForManagement,
          isActive,
        };
        setSelectedCategoryForManagement(updatedCategory);
      }

      updateCategoryMutation.mutate({
        id: categoryId,
        data: { isActive },
      });
    },
    [
      updateCategoryMutation,
      selectedCategoryForManagement,
      setLocalCategoriesState,
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
          {localCategories.map((category, index) => (
            <div key={category.id} className="space-y-2">
              <DraggableCategory
                category={category}
                index={index}
                isSelected={selectedCategoryForManagement?.id === category.id}
                onSelect={setSelectedCategoryForManagement}
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
