import { DiscoverCategory } from '@/apis/discover-category/types';
import { useState } from 'react';
import { CategoryFormData, SubCategoryFormData } from '../types';

export const useCategoryManagement = () => {
  const [selectedCategoryForManagement, setSelectedCategoryForManagement] =
    useState<DiscoverCategory | null>(null);
  const [localCategoriesState, setLocalCategoriesState] = useState<
    DiscoverCategory[]
  >([]);

  return {
    selectedCategoryForManagement,
    setSelectedCategoryForManagement,
    localCategoriesState,
    setLocalCategoriesState,
  };
};

export const useCategoryFormState = () => {
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState<number | null>(
    null
  );
  const [categoryForm, setCategoryForm] = useState<CategoryFormData>({
    name: '',
    isActive: true,
  });

  return {
    isCreatingCategory,
    setIsCreatingCategory,
    isEditingCategory,
    setIsEditingCategory,
    categoryForm,
    setCategoryForm,
  };
};

export const useSubCategoryFormState = () => {
  const [isCreatingSubCategory, setIsCreatingSubCategory] = useState(false);
  const [isEditingSubCategory, setIsEditingSubCategory] = useState<
    number | null
  >(null);
  const [subCategoryForm, setSubCategoryForm] = useState<SubCategoryFormData>({
    name: '',
    isActive: true,
  });

  return {
    isCreatingSubCategory,
    setIsCreatingSubCategory,
    isEditingSubCategory,
    setIsEditingSubCategory,
    subCategoryForm,
    setSubCategoryForm,
  };
};
