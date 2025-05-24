import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
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
  const { categories: originalCategories } = useDiscoverCategories({
    includeInactive: true,
  });
  const [localCategories, setLocalCategories] = useState(originalCategories);
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

  // originalCategories가 변경되면 localCategories도 업데이트
  useEffect(() => {
    setLocalCategories(originalCategories);
  }, [originalCategories]);

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
    if (localCategories.length > 0 && !selectedCategoryForManagement) {
      handleCategorySelect(localCategories[0]);
    }
  }, [localCategories, selectedCategoryForManagement, handleCategorySelect]);

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
        const remainingCategories = localCategories.filter(
          cat => cat.id !== deletedCategoryId
        );
        if (remainingCategories.length > 0) {
          handleCategorySelect(remainingCategories[0]);
        }
      }
    },
  });

  // 카테고리 순서 변경 함수 - 로컬 상태만 업데이트
  const moveCategory = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const draggedCategory = localCategories[dragIndex];
      const newCategories = [...localCategories];

      // 드래그된 항목을 제거하고 새 위치에 삽입
      newCategories.splice(dragIndex, 1);
      newCategories.splice(hoverIndex, 0, draggedCategory);

      // 로컬 상태만 업데이트
      setLocalCategories(newCategories);

      // 현재 선택된 카테고리가 이동된 카테고리라면 selectedCategoryForManagement도 업데이트
      if (selectedCategoryForManagement?.id === draggedCategory.id) {
        setSelectedCategoryForManagement(draggedCategory);
      }
    },
    [
      localCategories,
      setLocalCategories,
      selectedCategoryForManagement,
      setSelectedCategoryForManagement,
    ]
  );

  // 카테고리 드롭 시 API 호출
  const handleCategoryDrop = useCallback(() => {
    if (reorderCategoriesMutation.isPending) return;

    // 현재 로컬 카테고리 순서를 기반으로 reorderData 생성
    const reorderData = localCategories.map((category: any, index: number) => ({
      id: category.id,
      displayOrder: index,
    }));

    reorderCategoriesMutation.mutate(reorderData);
  }, [reorderCategoriesMutation, localCategories]);

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
      displayOrder: localCategories.length,
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
      <div className="mb-2 flex items-center justify-between md:mb-3">
        <h3 className="text-base font-medium text-gray-800 md:text-lg">
          카테고리
        </h3>
        <Button
          onClick={() => setIsCreatingCategory(true)}
          size="sm"
          className="flex items-center gap-1 text-xs md:gap-2 md:text-sm"
        >
          <Plus className="h-3 w-3 md:h-4 md:w-4" />
          <span className="hidden sm:inline">새 카테고리</span>
          <span className="sm:hidden">추가</span>
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
        <div className="space-y-2 pr-2 md:pr-4">
          {localCategories.map((category, index) => (
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
