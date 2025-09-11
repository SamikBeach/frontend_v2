import { useAtom } from 'jotai';
import { useMemo, useState } from 'react';
import {
  activeTabAtom,
  searchQueryAtom,
  selectedCategoryForManagementAtom,
  selectedCategoryIdAtom,
  selectedSubcategoryIdAtom,
} from '../atoms';

// 기본 폼 상태
const DEFAULT_FORM_STATE = {
  name: '',
  isActive: true,
};

// 탭 상태 관리
export const useTabState = () => {
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  return useMemo(
    () => ({ activeTab, setActiveTab }),
    [activeTab, setActiveTab]
  );
};

// 카테고리 선택 상태 관리 (도서 관리용)
export const useCategorySelection = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useAtom(
    selectedCategoryIdAtom
  );
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useAtom(
    selectedSubcategoryIdAtom
  );

  return useMemo(
    () => ({
      selectedCategoryId,
      setSelectedCategoryId,
      selectedSubcategoryId,
      setSelectedSubcategoryId,
    }),
    [
      selectedCategoryId,
      setSelectedCategoryId,
      selectedSubcategoryId,
      setSelectedSubcategoryId,
    ]
  );
};

// 검색 상태 관리
export const useSearchState = () => {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  return useMemo(
    () => ({ searchQuery, setSearchQuery }),
    [searchQuery, setSearchQuery]
  );
};

// 카테고리 관리용 선택 상태
export const useCategoryManagement = () => {
  const [selectedCategoryForManagement, setSelectedCategoryForManagement] =
    useAtom(selectedCategoryForManagementAtom);

  return useMemo(
    () => ({
      selectedCategoryForManagement,
      setSelectedCategoryForManagement,
    }),
    [selectedCategoryForManagement, setSelectedCategoryForManagement]
  );
};

// 카테고리 폼 상태 (로컬 상태로 충분)
export const useCategoryFormState = () => {
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState<number | null>(
    null
  );
  const [categoryForm, setCategoryForm] = useState(DEFAULT_FORM_STATE);

  return useMemo(
    () => ({
      isCreatingCategory,
      setIsCreatingCategory,
      isEditingCategory,
      setIsEditingCategory,
      categoryForm,
      setCategoryForm,
    }),
    [isCreatingCategory, isEditingCategory, categoryForm]
  );
};

// 서브카테고리 폼 상태 (로컬 상태로 충분)
export const useSubCategoryFormState = () => {
  const [isCreatingSubCategory, setIsCreatingSubCategory] = useState(false);
  const [isEditingSubCategory, setIsEditingSubCategory] = useState<
    number | null
  >(null);
  const [subCategoryForm, setSubCategoryForm] = useState(DEFAULT_FORM_STATE);

  return useMemo(
    () => ({
      isCreatingSubCategory,
      setIsCreatingSubCategory,
      isEditingSubCategory,
      setIsEditingSubCategory,
      subCategoryForm,
      setSubCategoryForm,
    }),
    [isCreatingSubCategory, isEditingSubCategory, subCategoryForm]
  );
};
