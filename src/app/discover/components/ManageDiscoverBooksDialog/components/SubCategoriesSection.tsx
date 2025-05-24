import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';
import { useCallback } from 'react';
import { useSubCategoryFormState, useSubCategoryMutations } from '../hooks';
import { useCategoryManagement } from '../hooks/useManageDiscoverState';
import { DraggableSubCategory } from './DraggableSubCategory';
import { SubCategoryForm } from './SubCategoryForm';

export function SubCategoriesSection() {
  const { selectedCategoryForManagement, setSelectedCategoryForManagement } =
    useCategoryManagement();

  const {
    isCreatingSubCategory,
    setIsCreatingSubCategory,
    isEditingSubCategory,
    setIsEditingSubCategory,
    subCategoryForm,
    setSubCategoryForm,
  } = useSubCategoryFormState();

  const {
    createSubCategoryMutation,
    updateSubCategoryMutation,
    deleteSubCategoryMutation,
    reorderSubCategoriesMutation,
  } = useSubCategoryMutations({
    onSubCategoryCreated: newSubCategory => {
      setIsCreatingSubCategory(false);
      setSubCategoryForm({ name: '', isActive: true });

      // atom 업데이트
      if (selectedCategoryForManagement) {
        const currentSubCategories =
          selectedCategoryForManagement.subCategories || [];
        const updatedCategory = {
          ...selectedCategoryForManagement,
          subCategories: [...currentSubCategories, newSubCategory].sort(
            (a, b) => a.displayOrder - b.displayOrder
          ),
        };
        setSelectedCategoryForManagement(updatedCategory);
      }
    },
    onSubCategoryUpdated: updatedSubCategory => {
      setIsEditingSubCategory(null);
      setSubCategoryForm({ name: '', isActive: true });

      // atom 업데이트
      if (selectedCategoryForManagement) {
        const currentSubCategories =
          selectedCategoryForManagement.subCategories || [];
        const updatedCategory = {
          ...selectedCategoryForManagement,
          subCategories: currentSubCategories.map(sub =>
            sub.id === updatedSubCategory.id ? updatedSubCategory : sub
          ),
        };
        setSelectedCategoryForManagement(updatedCategory);
      }
    },
    onSubCategoryDeleted: deletedSubCategoryId => {
      // atom 업데이트
      if (selectedCategoryForManagement) {
        const currentSubCategories =
          selectedCategoryForManagement.subCategories || [];
        const updatedCategory = {
          ...selectedCategoryForManagement,
          subCategories: currentSubCategories.filter(
            sub => sub.id !== deletedSubCategoryId
          ),
        };
        setSelectedCategoryForManagement(updatedCategory);
      }
    },
  });

  // 서브카테고리 순서 변경 함수 - 로컬 상태만 업데이트
  const moveSubCategory = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (!selectedCategoryForManagement?.subCategories) return;

      const draggedSubCategory =
        selectedCategoryForManagement.subCategories[dragIndex];
      const newSubCategories = [...selectedCategoryForManagement.subCategories];

      // 드래그된 항목을 제거하고 새 위치에 삽입
      newSubCategories.splice(dragIndex, 1);
      newSubCategories.splice(hoverIndex, 0, draggedSubCategory);

      // 로컬 상태만 업데이트
      const updatedCategory = {
        ...selectedCategoryForManagement,
        subCategories: newSubCategories,
      };
      setSelectedCategoryForManagement(updatedCategory);
    },
    [selectedCategoryForManagement, setSelectedCategoryForManagement]
  );

  // 서브카테고리 드롭 시 API 호출
  const handleSubCategoryDrop = useCallback(() => {
    if (
      !selectedCategoryForManagement?.subCategories ||
      reorderSubCategoriesMutation.isPending
    )
      return;

    const reorderData = {
      categoryId: selectedCategoryForManagement.id,
      subCategories: selectedCategoryForManagement.subCategories.map(
        (subCategory, index) => ({
          id: subCategory.id,
          displayOrder: index,
        })
      ),
    };

    reorderSubCategoriesMutation.mutate(reorderData);
  }, [reorderSubCategoriesMutation, selectedCategoryForManagement]);

  // 서브카테고리 활성화 토글 함수
  const handleToggleSubCategoryActive = useCallback(
    (subCategoryId: number, isActive: boolean) => {
      updateSubCategoryMutation.mutate({
        id: subCategoryId,
        data: { isActive },
      });

      // 현재 선택된 카테고리의 서브카테고리 활성화 상태를 즉시 업데이트
      if (selectedCategoryForManagement) {
        const currentSubCategories =
          selectedCategoryForManagement.subCategories || [];
        const updatedCategory = {
          ...selectedCategoryForManagement,
          subCategories: currentSubCategories.map(sub =>
            sub.id === subCategoryId ? { ...sub, isActive } : sub
          ),
        };
        setSelectedCategoryForManagement(updatedCategory);
      }
    },
    [
      updateSubCategoryMutation,
      selectedCategoryForManagement,
      setSelectedCategoryForManagement,
    ]
  );

  const handleCreateSubCategory = () => {
    if (!subCategoryForm.name.trim() || !selectedCategoryForManagement) {
      return;
    }
    const currentSubCategories =
      selectedCategoryForManagement.subCategories || [];
    createSubCategoryMutation.mutate({
      discoverCategoryId: selectedCategoryForManagement.id,
      name: subCategoryForm.name,
      description: '',
      displayOrder: currentSubCategories.length,
    });
  };

  const handleEditSubCategory = (subCategory: any) => {
    setIsEditingSubCategory(subCategory.id);
    setSubCategoryForm({
      name: subCategory.name,
      isActive: subCategory.isActive,
    });
  };

  const handleUpdateSubCategory = () => {
    if (!subCategoryForm.name.trim() || isEditingSubCategory === null) {
      return;
    }
    updateSubCategoryMutation.mutate({
      id: isEditingSubCategory,
      data: {
        name: subCategoryForm.name,
        description: '',
        displayOrder: 0,
        isActive: subCategoryForm.isActive,
      },
    });
  };

  const cancelSubCategoryEdit = () => {
    setIsEditingSubCategory(null);
    setIsCreatingSubCategory(false);
    setSubCategoryForm({ name: '', isActive: true });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="mb-2 flex items-center justify-between md:mb-3">
        <h3 className="text-base font-medium text-gray-800 md:text-lg">
          서브카테고리
        </h3>
        <Button
          onClick={() => setIsCreatingSubCategory(true)}
          size="sm"
          className="flex items-center gap-1 text-xs md:gap-2 md:text-sm"
          disabled={!selectedCategoryForManagement}
        >
          <Plus className="h-3 w-3 md:h-4 md:w-4" />
          <span className="hidden sm:inline">새 서브카테고리</span>
          <span className="sm:hidden">추가</span>
        </Button>
      </div>

      {selectedCategoryForManagement ? (
        <>
          {/* 서브카테고리 생성 폼 */}
          {isCreatingSubCategory && (
            <SubCategoryForm
              subCategoryForm={subCategoryForm}
              setSubCategoryForm={setSubCategoryForm}
              onSubmit={handleCreateSubCategory}
              onCancel={cancelSubCategoryEdit}
              isLoading={createSubCategoryMutation.isPending}
              mode="create"
            />
          )}

          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-2 pr-2 md:pr-4">
              {(selectedCategoryForManagement.subCategories || []).map(
                (subCategory, index) => (
                  <div key={subCategory.id} className="space-y-2">
                    <DraggableSubCategory
                      subCategory={subCategory}
                      index={index}
                      onEdit={handleEditSubCategory}
                      onDelete={deleteSubCategoryMutation.mutate}
                      onToggleActive={handleToggleSubCategoryActive}
                      onMove={moveSubCategory}
                      onDrop={handleSubCategoryDrop}
                    />
                    {/* 서브카테고리 수정 폼 */}
                    {isEditingSubCategory === subCategory.id && (
                      <SubCategoryForm
                        subCategoryForm={subCategoryForm}
                        setSubCategoryForm={setSubCategoryForm}
                        onSubmit={handleUpdateSubCategory}
                        onCancel={cancelSubCategoryEdit}
                        isLoading={updateSubCategoryMutation.isPending}
                        mode="edit"
                      />
                    )}
                  </div>
                )
              )}
            </div>
          </ScrollArea>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 md:mb-4 md:h-16 md:w-16">
            <span className="text-xl md:text-2xl">📁</span>
          </div>
          <h3 className="mb-1 text-base font-medium text-gray-800 md:text-lg">
            카테고리를 선택하세요
          </h3>
          <p className="max-w-sm text-xs text-gray-500 md:text-sm">
            서브카테고리를 관리하려면 먼저 카테고리를 선택해주세요.
          </p>
        </div>
      )}
    </div>
  );
}
