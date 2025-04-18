import { Book } from '../book/types';

// 서재 활동 유형 (백엔드 enum과 일치)
export enum LibraryActivityType {
  LIBRARY_CREATE = 'LIBRARY_CREATE', // 서재 생성
  LIBRARY_UPDATE = 'LIBRARY_UPDATE', // 서재 정보 수정
  LIBRARY_TITLE_UPDATE = 'LIBRARY_TITLE_UPDATE', // 서재 제목 수정
  LIBRARY_DELETE = 'LIBRARY_DELETE', // 서재 삭제
  BOOK_ADD = 'BOOK_ADD', // 책 추가
  BOOK_REMOVE = 'BOOK_REMOVE', // 책 제거
  TAG_ADD = 'TAG_ADD', // 태그 추가
  TAG_REMOVE = 'TAG_REMOVE', // 태그 제거
  SUBSCRIPTION_ADD = 'SUBSCRIPTION_ADD', // 구독 추가
  SUBSCRIPTION_REMOVE = 'SUBSCRIPTION_REMOVE', // 구독 취소
  OTHER = 'OTHER', // 기타 활동
}

// 서재 정렬 옵션 (백엔드 enum과 일치)
export enum LibrarySortOption {
  SUBSCRIBERS = 'subscribers', // 구독자 많은 순
  BOOKS = 'books', // 담긴 책 많은 순
  RECENT = 'recent', // 최신순
}

// 서재 책 정보 타입
export interface LibraryBook {
  id: number;
  bookId: number;
  libraryId: number;
  note?: string;
  book: Partial<Book>;
  createdAt: Date;
}

// 서재 태그 타입
export interface LibraryTag {
  id: number;
  tagId: number;
  tagName: string;
  description?: string;
  usageCount?: number;
  libraryId?: number;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 서재 소유자 타입
export interface LibraryOwner {
  id: number;
  username: string;
}

// 책 미리보기 정보 타입
export interface BookPreview {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  isbn: string;
  publisher: string;
}

// 서재 업데이트 이력 타입
export interface UpdateHistoryItem {
  id: number;
  date: Date;
  message: string;
  activityType: LibraryActivityType;
  userId?: number;
  bookId?: number;
  tagId?: number;
}

// 서재 구독자 정보 타입
export interface SubscriberInfo {
  id: number;
  username: string;
  email: string;
  profileImage?: string;
}

// 라이브러리 태그 정보 타입
export interface LibraryTagResponseDto {
  id: number;
  tagId: number;
  tagName: string;
  description?: string;
  usageCount: number;
  libraryId?: number;
  note?: string;
  createdAt: Date;
  updatedAt?: Date;
}

// 라이브러리 태그 목록 응답 타입
export interface LibraryTagListResponseDto {
  tags: LibraryTagResponseDto[];
  totalCount: number;
}

// 서재 응답 타입
export interface Library {
  id: number;
  name: string;
  description?: string;
  isPublic: boolean;
  subscriberCount: number;
  owner: LibraryOwner;
  books?: LibraryBook[];
  tags?: LibraryTag[];
  isSubscribed?: boolean;
  subscribers?: SubscriberInfo[];
  recentUpdates?: UpdateHistoryItem[];
  createdAt: Date;
  updatedAt?: Date;
  bookCount?: number;
  previewBooks?: BookPreview[];
  tagId?: string; // 태그 ID (이전 category 필드)
}

// 페이지네이션 메타데이터
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  sort?: LibrarySortOption;
  query?: string;
  tagId?: number;
  tagName?: string;
}

// 페이지네이션된 서재 목록 응답 타입
export interface PaginatedLibraryResponse {
  data: Library[];
  meta: PaginationMeta;
}

// 서재 구독자 응답 타입
export interface Subscriber {
  id: number;
  username: string;
  email: string;
}

// 서재 생성 DTO
export interface CreateLibraryDto {
  name: string;
  description?: string;
  isPublic?: boolean;
  tags?: string[];
}

// 서재 업데이트 DTO
export interface UpdateLibraryDto {
  name?: string;
  description?: string;
  isPublic?: boolean;
  tags?: string[];
}

// 서재에 책 추가 DTO
export interface AddBookToLibraryDto {
  bookId: number;
  note?: string;
  isbn?: string;
}

// 서재에 태그 추가 DTO
export interface AddTagToLibraryDto {
  tagId?: number;
  name?: string;
  note?: string;
}

// 홈화면용 인기 서재 정보 타입
export interface HomeLibraryPreview {
  id: number;
  name: string;
  ownerName: string;
  subscriberCount: number;
  bookCount: number;
  previewBooks: {
    id: number;
    title: string;
    author: string;
    coverImage: string;
  }[];
}

// 홈화면용 인기 서재 응답 타입
export interface HomePopularLibrariesResponse {
  libraries: HomeLibraryPreview[];
}

export interface BookForLibrary {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  isbn: string;
  publisher: string;
}

export interface LibraryDetail {
  id: number;
  name: string;
  description: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  owner: LibraryOwner;
  booksCount: number;
  subscribersCount: number;
  isSubscribed: boolean;
  tags: LibraryTag[];
}

export interface LibrariesForBookResponse {
  data: LibraryDetail[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
