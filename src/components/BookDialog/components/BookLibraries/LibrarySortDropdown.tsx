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

  // 활성 상태 확인 (기본값이 아닌 경우)
  const isActive = value !== LibrarySortOption.SUBSCRIBERS;

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
          className={
            `flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-xs ` +
            (isActive
              ? 'border border-blue-200 bg-blue-50 text-blue-700'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100')
          }
        >
          <span className="mr-1 flex h-3 w-3 items-center justify-center">
            {selectedOption.icon}
          </span>
          {selectedOption.label}
        </Button>
      </ResponsiveDropdownMenuTrigger>
      <ResponsiveDropdownMenuContent
        align="end"
        className="w-[160px]"
        sideOffset={8}
      >
        {sortOptions.map(option => {
          const isOptionActive = value === option.value;
          return (
            <ResponsiveDropdownMenuItem
              key={option.value}
              className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors ${
                isOptionActive
                  ? 'text-primary bg-blue-50 font-medium'
                  : 'text-gray-700'
              }`}
              onSelect={() => handleSortChange(option.value)}
            >
              <span className="mr-2 inline-flex h-3.5 w-3.5 items-center justify-center">
                {option.icon}
              </span>
              {option.label}
            </ResponsiveDropdownMenuItem>
          );
        })}
      </ResponsiveDropdownMenuContent>
    </ResponsiveDropdownMenu>
  );
}
