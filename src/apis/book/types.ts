import { Category, SubCategory } from '../category/types';

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  isbn13?: string;
  description: string;
  coverImage: string;
  rating: number;
  reviews: number;
  publisher: string;
  publishDate: Date;
  category: Category;
  subcategory?: SubCategory;
  isFeatured?: boolean;
}

export interface CreateBookDto {
  title: string;
  author: string;
  isbn: string;
  isbn13?: string;
  description: string;
  coverImage: string;
  publisher: string;
  publishDate: Date;
  categoryId: number;
  subcategoryId?: number;
  isFeatured?: boolean;
}

export interface UpdateBookDto {
  title?: string;
  author?: string;
  description?: string;
  coverImage?: string;
  rating?: number;
  reviews?: number;
  categoryId?: number;
  subcategoryId?: number;
  isFeatured?: boolean;
}

export type SortOption = 'rating-desc' | 'reviews-desc' | 'publishDate-desc';
export type TimeRange = 'all' | 'month' | 'year';

export interface PopularBooksParams {
  sort?: SortOption;
  timeRange?: TimeRange;
}
