import { Category, SubCategory } from '../category/types';
import {
  DiscoverCategory,
  DiscoverSubCategory,
} from '../discover-category/types';
import { RatingResponseDto } from '../rating/types';
import { ReadingStatusType } from '../reading-status';

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  isbn13?: string;
  description: string;
  coverImage: string;
  coverImageWidth?: number;
  coverImageHeight?: number;
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
  userReadingStatus?: ReadingStatusType;
  totalRatings?: number;
  libraryAdds?: number;
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
  coverImageWidth?: number;
  coverImageHeight?: number;
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
  coverImageWidth?: number;
  coverImageHeight?: number;
  rating?: number;
  reviews?: number;
  categoryId?: number;
  subcategoryId?: number;
  isFeatured?: boolean;
}

export enum PopularBooksSortOptions {
  RATING_DESC = 'rating-desc',
  REVIEWS_DESC = 'reviews-desc',
  LIBRARY_COUNT_DESC = 'library-desc',
  PUBLISH_DATE_DESC = 'publishDate-desc',
  TITLE_ASC = 'title-asc',
}

export enum TimeRangeOptions {
  ALL = 'all',
  TODAY = 'today',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export type SortOption =
  | PopularBooksSortOptions.RATING_DESC
  | PopularBooksSortOptions.REVIEWS_DESC
  | PopularBooksSortOptions.LIBRARY_COUNT_DESC
  | PopularBooksSortOptions.PUBLISH_DATE_DESC
  | PopularBooksSortOptions.TITLE_ASC;

export type TimeRange =
  | TimeRangeOptions.ALL
  | TimeRangeOptions.TODAY
  | TimeRangeOptions.WEEK
  | TimeRangeOptions.MONTH
  | TimeRangeOptions.YEAR;

export interface BookSearchResponse {
  books: Book[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PopularBooksParams {
  categoryId?: number;
  subcategoryId?: number;
  sort?: SortOption | PopularBooksSortOptions;
  timeRange?: TimeRange | TimeRangeOptions;
  page?: number;
  limit?: number;
}

export interface DiscoverBooksParams {
  discoverCategoryId?: number;
  discoverSubCategoryId?: number;
  sort?: SortOption | PopularBooksSortOptions;
  timeRange?: TimeRange | TimeRangeOptions;
  page?: number;
  limit?: number;
}

export interface HomeBookPreview {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  coverImageWidth?: number;
  coverImageHeight?: number;
  rating: number;
  isbn: string;
  isbn13?: string;
  category?: {
    id: number;
    name: string;
  };
  publisher?: string;
}

export interface HomeDiscoverBooksResponse {
  categoryId: number;
  categoryName: string;
  books: HomeBookPreview[];
}

export interface HomePopularBooksResponse {
  books: HomeBookPreview[];
}

export interface BookResponse {
  id: number;
  title: string;
  author: string;
  isbn: string;
  isbn13?: string;
  description: string;
  coverImage: string;
  coverImageWidth?: number;
  coverImageHeight?: number;
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
  totalRatings?: number;
  libraryAdds?: number;

  // Additional fields in BookResponse
  searchId?: number;
  bookId?: number;
  readingStats?: {
    currentReaders: number;
    completedReaders: number;
    averageReadingTime: string;
    difficulty: string;
    readingStatusCounts: Record<string, number>;
  };
  userReadingStatus?: string;
  userRating?: {
    bookId: number;
    rating: number;
    comment?: string;
  };
  searchTerm?: string;
  searchedAt?: Date;
}
