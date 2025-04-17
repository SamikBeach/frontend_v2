import { Library as ApiLibrary, BookPreview } from '@/apis/library/types';
import { TimeRange } from '@/components/SortDropdown';
import { ReactNode } from 'react';

// 서재 카테고리 타입
export interface Category {
  id: string;
  name: string;
  color: string;
}

// 사용자 프로필 타입 (UI에서만 사용되는 확장된 타입)
export interface UserProfile {
  name: string;
  username: string;
  avatar: string;
}

// 서재 타입 (UI에서만 사용되는 확장된 타입)
export interface Library {
  id: number;
  title: string;
  description: string;
  category: string;
  owner: UserProfile;
  books: BookPreview[];
  followers: number;
  isPublic: boolean;
  tags: string[];
  timestamp: string;
}

// 정렬 옵션 타입 (라이브러리 용)
export interface SortOption {
  id: string;
  label: string;
  icon: ReactNode;
  sortFn?: (a: ApiLibrary, b: ApiLibrary) => number;
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
  library: ApiLibrary;
}

// 책 이미지 속성
export interface BookImageProps {
  book: BookPreview;
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
