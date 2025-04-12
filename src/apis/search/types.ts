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
}

export interface BookSearchResult {
  books: SearchResult[];
  total: number;
  page: number;
  totalPages: number;
}

export interface RecentSearch {
  term: string;
  bookId?: number;
  title?: string;
  author?: string;
  coverImage?: string;
  publisher?: string;
  createdAt: string;
}

export interface PopularSearch {
  term: string;
  count: number;
}

export interface SaveSearchTermRequest {
  term: string;
  bookId?: number;
}
