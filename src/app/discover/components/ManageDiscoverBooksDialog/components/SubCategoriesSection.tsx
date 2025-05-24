import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useCallback } from 'react';
import { useSubCategoryFormState, useSubCategoryMutations } from '../hooks';
import { useCategoryManagement } from '../hooks/useManageDiscoverState';
import { DraggableSubCategory } from './DraggableSubCategory';
import { SubCategoryForm } from './SubCategoryForm';

export function SubCategoriesSection() {
  const queryClient = useQueryClient();
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

  // 서브카테고리 순서 변경 함수 - react-query 캐시 직접 업데이트
  const moveSubCategory = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (!selectedCategoryForManagement?.subCategories) return;

      const draggedSubCategory =
        selectedCategoryForManagement.subCategories[dragIndex];
      const newSubCategories = [...selectedCategoryForManagement.subCategories];

      // 드래그된 항목을 제거하고 새 위치에 삽입
      newSubCategories.splice(dragIndex, 1);
      newSubCategories.splice(hoverIndex, 0, draggedSubCategory);

      // 로컬 상태 즉시 업데이트
      const updatedCategory = {
        ...selectedCategoryForManagement,
        subCategories: newSubCategories,
      };
      setSelectedCategoryForManagement(updatedCategory);

      // react-query 캐시도 업데이트
      queryClient.setQueryData(['discover-categories'], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((cat: any) =>
          cat.id === selectedCategoryForManagement.id ? updatedCategory : cat
        );
      });
    },
    [
      selectedCategoryForManagement,
      setSelectedCategoryForManagement,
      queryClient,
    ]
  );

  // 서브카테고리 드롭 시 API 호출
  const handleSubCategoryDrop = useCallback(
    (dragIndex: number, hoverIndex: number) => {
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
    },
    [reorderSubCategoriesMutation, selectedCategoryForManagement]
  );

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
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-800">서브카테고리</h3>
        <Button
          onClick={() => setIsCreatingSubCategory(true)}
          size="sm"
          className="flex items-center gap-2"
          disabled={!selectedCategoryForManagement}
        >
          <Plus className="h-4 w-4" />새 서브카테고리
        </Button>
      </div>

      {selectedCategoryForManagement ? (
        <>
          <div className="mb-4 rounded-lg bg-blue-50 p-3">
            <p className="text-sm text-blue-700">
              <span className="font-medium">
                {selectedCategoryForManagement.name}
              </span>{' '}
              카테고리의 서브카테고리를 관리합니다.
            </p>
          </div>

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
            <div className="space-y-2 pr-4">
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
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <span className="text-2xl">📁</span>
          </div>
          <h3 className="mb-1 text-lg font-medium text-gray-800">
            카테고리를 선택하세요
          </h3>
          <p className="max-w-sm text-sm text-gray-500">
            서브카테고리를 관리하려면 먼저 카테고리를 선택해주세요.
          </p>
        </div>
      )}
    </div>
  );
}
