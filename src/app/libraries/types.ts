import { ReactNode } from 'react';

// 서재 카테고리 타입
export interface Category {
  id: string;
  name: string;
  color: string;
}

// 책 정보 타입
export interface Book {
  id: number;
  title: string;
  author: string;
  coverImage: string;
}

// 사용자 프로필 타입
export interface UserProfile {
  name: string;
  username: string;
  avatar: string;
}

// 서재 타입
export interface Library {
  id: number;
  title: string;
  description: string;
  category: string;
  owner: UserProfile;
  books: Book[];
  followers: number;
  isPublic: boolean;
  tags: string[];
  timestamp: string;
}

// 정렬 옵션 타입
export interface SortOption {
  id: string;
  label: string;
  icon: () => ReactNode;
  sortFn: (a: Library, b: Library) => number;
}

// 카테고리 버튼 속성
export interface CategoryButtonProps {
  category: Category;
  isSelected: boolean;
  onClick: (id: string) => void;
}

// 필터바 속성
export interface FilterBarProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryClick: (id: string) => void;
}

// 정렬 드롭다운 속성
export interface SortDropdownProps {
  selectedSort: string;
  onSortChange: (id: string) => void;
  sortOptions: SortOption[];
  className?: string;
}

// 서재 카드 속성
export interface LibraryCardProps {
  library: Library;
}

// 책 이미지 속성
export interface BookImageProps {
  book: Book;
}

// 태그 목록 속성
export interface TagListProps {
  tags: string[];
}

// 검색창 속성
export interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// 빈 상태 표시 속성
export interface EmptyStateProps {
  searchQuery: string;
  selectedCategory: string;
}
