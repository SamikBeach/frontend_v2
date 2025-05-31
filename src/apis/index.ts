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

// Import and re-export library module explicitly to resolve TimeRangeOptions naming conflict
import * as libraryModule from './library';
export { libraryModule };

export * from './notification';

// Import and re-export rating module explicitly to resolve naming conflicts
import * as ratingModule from './rating';
export { ratingModule };

// Import and re-export reading-status module explicitly to resolve naming conflicts
import * as readingStatusModule from './reading-status';
export { readingStatusModule };

// Import and re-export review module explicitly to resolve naming conflicts
import * as reviewModule from './review';
export { reviewModule };

export * from './search';

// Import and re-export user module explicitly to resolve TimeRangeOptions naming conflict
import * as userModule from './user';
export { userModule };

export * from './youtube';
