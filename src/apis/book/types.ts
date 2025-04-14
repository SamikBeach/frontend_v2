import { Category, SubCategory } from '../category/types';
import {
  DiscoverCategory,
  DiscoverSubCategory,
} from '../discover-category/types';
import { RatingResponseDto } from '../rating/types';

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
  isDiscovered?: boolean;
  discoverCategory?: DiscoverCategory;
  discoverSubCategory?: DiscoverSubCategory;
  userRating?: RatingResponseDto;
  userReadingStatus?: string;
  readingStats?: {
    currentReaders: number;
    completedReaders: number;
    averageReadingTime: string;
    difficulty: string;
    readingStatusCounts: {
      WANT_TO_READ: number;
      READING: number;
      READ: number;
    };
  };
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

export type SortOption =
  | 'rating-desc'
  | 'reviews-desc'
  | 'publishDate-desc'
  | 'title-asc';
export type TimeRange = 'all' | 'month' | 'year' | 'today' | 'week';

export interface PopularBooksParams {
  sort?: SortOption;
  timeRange?: TimeRange;
}

// 홈 화면용 간소화된 도서 정보
export interface HomeBookPreview {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  rating: number;
  isbn: string;
  isbn13?: string;
  category?: {
    id: number;
    name: string;
  };
  publisher?: string;
}

// 홈 화면용 발견하기 응답 타입
export interface HomeDiscoverBooksResponse {
  categoryId: number;
  categoryName: string;
  books: HomeBookPreview[];
}

// 홈 화면용 인기 도서 응답 타입
export interface HomePopularBooksResponse {
  books: HomeBookPreview[];
}
