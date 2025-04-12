export interface SearchResult {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  publisher?: string;
  description?: string;
  rating?: number;
  reviews?: number;
  totalTranslationCount?: number;
  likeCount?: number;
  reviewCount?: number;
  isbn?: string;
  isbn13?: string;
}

export interface SearchBook {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  publisher?: string;
  description?: string;
  rating?: number;
  reviews?: number;
  isbn?: string;
  isbn13?: string;
}

export interface BookSearchResult {
  books: SearchResult[];
  total: number;
  page: number;
  totalPages: number;
}

export interface RecentSearch {
  id: number;
  term: string;
  bookId?: number;
  title?: string;
  author?: string;
  coverImage?: string;
  publisher?: string;
  description?: string;
  isbn?: string;
  isbn13?: string;
  createdAt: string;
}

export interface PopularSearch {
  term: string;
  count: number;
}

export interface SaveSearchTermRequest {
  term: string;
  bookId?: number;
  title?: string;
  author?: string;
  coverImage?: string;
  publisher?: string;
  description?: string;
}
