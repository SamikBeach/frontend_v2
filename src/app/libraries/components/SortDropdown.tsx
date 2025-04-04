import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { SortDropdownProps } from '../types';

export function SortDropdown({
  selectedSort,
  onSortChange,
  sortOptions,
  className = '',
}: SortDropdownProps) {
  // 현재 선택된 정렬 옵션 가져오기
  const currentSortOption =
    sortOptions.find(option => option.id === selectedSort) || sortOptions[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`h-10 border-gray-200 bg-white ${className}`}
        >
          <ArrowUpDown className="mr-2 h-4 w-4 text-gray-500" />
          <span>{currentSortOption.label}</span>
          <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[140px]">
        {sortOptions.map(option => (
          <DropdownMenuItem
            key={option.id}
            className={`flex items-center ${
              option.id === selectedSort
                ? 'bg-gray-50 font-medium text-gray-900'
                : ''
            }`}
            onClick={() => onSortChange(option.id)}
          >
            {option.icon()}
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
