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

// 인기순 기간 필터 타입
export type TimeRange = 'all' | 'today' | 'week' | 'month' | 'year';

// 정렬 옵션 타입
export interface SortOption {
  id: string;
  label: string;
  icon: () => ReactNode;
  sortFn: (a: Library, b: Library) => number;
  // 인기순 정렬에만 기간 필터가 적용됨
  supportsTimeRange?: boolean;
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
  // 기간 필터 관련 props 추가
  selectedTimeRange?: TimeRange;
  onTimeRangeChange?: (range: TimeRange) => void;
}

// 서재 카드 속성
export interface LibraryCardProps {
  library: import('@/apis/library/types').LibrarySummary;
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
