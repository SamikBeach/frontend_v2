import api from './axios';
export { api };

export * from './auth';
export * from './book';

// Re-export types with aliases to avoid name conflicts
import {
  Category as CategoryType,
  CreateCategoryDto,
  CreateSubCategoryDto,
  SubCategory as SubCategoryType,
  UpdateCategoryDto,
} from './category/types';

// Re-export functions from the category module
import {
  createCategory,
  createSubCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  getSubcategoriesByCategoryId,
  updateCategory,
} from './category/category';

// Export all types properly with type keyword
export type {
  CategoryType,
  CreateCategoryDto,
  CreateSubCategoryDto,
  SubCategoryType,
  UpdateCategoryDto,
};

// Export functions
export {
  createCategory,
  createSubCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  getSubcategoriesByCategoryId,
  updateCategory,
};

export * from './library';
export * from './notification';
export * from './rating';
export * from './reading-status';
export * from './review';
export * from './search';
export * from './user';
