'use client';

import { LibrarySortOption } from '@/apis/library/types';
import { librarySortDropdownOpenAtom } from '@/atoms/book-dialog';
import { Button } from '@/components/ui/button';
import {
  ResponsiveDropdownMenu,
  ResponsiveDropdownMenuContent,
  ResponsiveDropdownMenuItem,
  ResponsiveDropdownMenuTrigger,
} from '@/components/ui/responsive-dropdown-menu';
import { useAtom } from 'jotai';
import { Clock, Flame, Library } from 'lucide-react';

interface LibrarySortDropdownProps {
  onChange: (sort: LibrarySortOption) => void;
  value: LibrarySortOption;
}

/**
 * 서재 정렬 드롭다운 컴포넌트
 */
export function LibrarySortDropdown({
  onChange,
  value,
}: LibrarySortDropdownProps) {
  // 드롭다운 상태를 atom으로 관리
  const [open, setOpen] = useAtom(librarySortDropdownOpenAtom);

  const sortOptions = [
    {
      label: '인기순',
      value: LibrarySortOption.SUBSCRIBERS,
      icon: <Flame className="h-3.5 w-3.5" />,
    },
    {
      label: '담긴 책 많은 순',
      value: LibrarySortOption.BOOKS,
      icon: <Library className="h-3.5 w-3.5" />,
    },
    {
      label: '최신순',
      value: LibrarySortOption.RECENT,
      icon: <Clock className="h-3.5 w-3.5" />,
    },
  ];

  // 현재 선택된 정렬 옵션 찾기
  const selectedOption =
    sortOptions.find(option => option.value === value) || sortOptions[0];

  const handleSortChange = (newSort: LibrarySortOption) => {
    onChange(newSort);
    setOpen(false);
  };

  return (
    <ResponsiveDropdownMenu open={open} onOpenChange={setOpen}>
      <ResponsiveDropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex h-7 items-center gap-1.5 rounded-full bg-gray-50 px-3 text-xs text-gray-600 hover:bg-gray-100 cursor-pointer"
        >
          <span className="mr-1 flex h-3 w-3 items-center justify-center">
            {selectedOption.icon}
          </span>
          {selectedOption.label}
        </Button>
      </ResponsiveDropdownMenuTrigger>
      <ResponsiveDropdownMenuContent
        align="end"
        className="w-36"
        sideOffset={8}
      >
        {sortOptions.map(option => (
          <ResponsiveDropdownMenuItem
            key={option.value}
            className={`cursor-pointer text-sm ${
              value === option.value ? 'text-primary font-medium' : ''
            }`}
            onSelect={() => handleSortChange(option.value)}
          >
            <span className="mr-2 inline-flex h-3.5 w-3.5 items-center justify-center">
              {option.icon}
            </span>
            {option.label}
          </ResponsiveDropdownMenuItem>
        ))}
      </ResponsiveDropdownMenuContent>
    </ResponsiveDropdownMenu>
  );
}
