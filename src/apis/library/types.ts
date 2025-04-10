import { Book } from '../book/types';

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
  name: string;
  libraryId: number;
  createdAt: Date;
}

// 서재 소유자 타입
export interface LibraryOwner {
  id: number;
  username: string;
  email: string;
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
  date: Date;
  message: string;
}

// 서재 구독자 정보 타입
export interface SubscriberInfo {
  id: number;
  username: string;
  email: string;
  profileImage?: string;
}

// 서재 상세 응답 타입
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
}

// 서재 목록 응답 타입
export interface LibrarySummary {
  id: number;
  name: string;
  description?: string;
  isPublic: boolean;
  subscriberCount: number;
  bookCount: number;
  owner: LibraryOwner;
  tags?: LibraryTag[];
  previewBooks?: BookPreview[];
  isSubscribed?: boolean;
  createdAt: Date;
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
}

// 서재 업데이트 DTO
export interface UpdateLibraryDto {
  name?: string;
  description?: string;
  isPublic?: boolean;
}

// 서재에 책 추가 DTO
export interface AddBookToLibraryDto {
  bookId: number;
  note?: string;
}

// 서재에 태그 추가 DTO
export interface AddTagToLibraryDto {
  name: string;
}
