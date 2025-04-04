import {
  ArrowDownAZ,
  ArrowUpDown,
  Calendar,
  ChevronDown,
  Star,
  Users,
} from 'lucide-react';
import { useMemo } from 'react';

import { Book } from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type SortOption = {
  id: string;
  label: string;
  icon: React.ReactNode;
  sortFn: (a: Book, b: Book) => number;
};

export const defaultSortOptions: SortOption[] = [
  {
    id: 'reviews-desc',
    label: '리뷰 많은순',
    icon: <Users className="mr-2 h-4 w-4 text-gray-500" />,
    sortFn: (a, b) => b.reviews - a.reviews,
  },
  {
    id: 'rating-desc',
    label: '평점 높은순',
    icon: <Star className="mr-2 h-4 w-4 text-[#FFAB00]" />,
    sortFn: (a, b) => b.rating - a.rating,
  },
  {
    id: 'date-desc',
    label: '출간일 최신순',
    icon: <Calendar className="mr-2 h-4 w-4 text-gray-500" />,
    sortFn: (a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
  },
  {
    id: 'title-asc',
    label: '제목 가나다순',
    icon: <ArrowDownAZ className="mr-2 h-4 w-4 text-gray-500" />,
    sortFn: (a, b) => a.title.localeCompare(b.title, 'ko'),
  },
];

interface SortDropdownProps {
  selectedSort: string;
  onSortChange: (sortId: string) => void;
  sortOptions?: SortOption[];
  className?: string;
  align?: 'start' | 'center' | 'end';
}

export function SortDropdown({
  selectedSort,
  onSortChange,
  sortOptions = defaultSortOptions,
  className = '',
  align = 'end',
}: SortDropdownProps) {
  // 현재 선택된 정렬 옵션 가져오기
  const currentSortOption =
    sortOptions.find(option => option.id === selectedSort) || sortOptions[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`h-9 border-gray-200 bg-white ${className}`}
        >
          <ArrowUpDown className="mr-2 h-4 w-4 text-gray-500" />
          <span>{currentSortOption.label}</span>
          <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-[180px]">
        {sortOptions.map(option => (
          <DropdownMenuItem
            key={option.id}
            className={`flex items-center ${
              option.id === selectedSort
                ? 'bg-gray-50 font-medium text-blue-600'
                : ''
            }`}
            onClick={() => onSortChange(option.id)}
          >
            {option.icon}
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function useSortedBooks<T extends Book>(
  books: T[],
  selectedSort: string,
  sortOptions = defaultSortOptions
): T[] {
  // 현재 선택된 정렬 옵션 가져오기
  const currentSortOption =
    sortOptions.find(option => option.id === selectedSort) || sortOptions[0];

  // 정렬된 책 목록 반환
  return useMemo(() => {
    return [...books].sort(currentSortOption.sortFn);
  }, [books, currentSortOption]);
}
