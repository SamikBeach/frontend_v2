import { DiscoverCategory } from '@/apis/discover-category/types';
import { useState } from 'react';
import { CategoryFormData, SubCategoryFormData } from '../types';

export const useTabState = () => {
  const [activeTab, setActiveTab] = useState('books');
  return { activeTab, setActiveTab };
};

export const useCategorySelection = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedSubcategoryId, setSelectedSubcategoryId] =
    useState<string>('all');

  return {
    selectedCategoryId,
    setSelectedCategoryId,
    selectedSubcategoryId,
    setSelectedSubcategoryId,
  };
};

export const useSearchState = () => {
  const [searchQuery, setSearchQuery] = useState('');
  return { searchQuery, setSearchQuery };
};

export const useManageDiscoverState = () => {
  // 카테고리 관리 상태
  const [selectedCategoryForManagement, setSelectedCategoryForManagement] =
    useState<DiscoverCategory | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState<number | null>(
    null
  );
  const [isCreatingSubCategory, setIsCreatingSubCategory] = useState(false);
  const [isEditingSubCategory, setIsEditingSubCategory] = useState<
    number | null
  >(null);

  // 카테고리 폼 상태
  const [categoryForm, setCategoryForm] = useState<CategoryFormData>({
    name: '',
    isActive: true,
  });

  // 서브카테고리 폼 상태
  const [subCategoryForm, setSubCategoryForm] = useState<SubCategoryFormData>({
    name: '',
    isActive: true,
  });

  // 로컬 카테고리 상태 - 드래그 앤 드롭을 위한 임시 상태
  const [localCategoriesState, setLocalCategoriesState] = useState<
    DiscoverCategory[]
  >([]);

  return {
    // 관리 상태
    selectedCategoryForManagement,
    setSelectedCategoryForManagement,
    isCreatingCategory,
    setIsCreatingCategory,
    isEditingCategory,
    setIsEditingCategory,
    isCreatingSubCategory,
    setIsCreatingSubCategory,
    isEditingSubCategory,
    setIsEditingSubCategory,

    // 폼 상태
    categoryForm,
    setCategoryForm,
    subCategoryForm,
    setSubCategoryForm,

    // 로컬 상태
    localCategoriesState,
    setLocalCategoriesState,
  };
};
