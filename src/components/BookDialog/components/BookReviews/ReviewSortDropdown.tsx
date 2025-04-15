import { ReviewSortType } from '@/apis/review/types';
import { bookReviewSortAtom } from '@/atoms/book';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAtom } from 'jotai';
import { Clock, Flame, MessageSquare } from 'lucide-react';

export function ReviewSortDropdown() {
  const [sort, setSort] = useAtom(bookReviewSortAtom);

  // 정렬 옵션 배열 정의 (레이블, 값, 아이콘을 포함)
  const sortOptions = [
    {
      label: '인기순',
      value: 'likes' as ReviewSortType,
      icon: <Flame className="h-3.5 w-3.5" />,
    },
    {
      label: '댓글 많은 순',
      value: 'comments' as ReviewSortType,
      icon: <MessageSquare className="h-3.5 w-3.5" />,
    },
    {
      label: '최신순',
      value: 'recent' as ReviewSortType,
      icon: <Clock className="h-3.5 w-3.5" />,
    },
  ];

  // 현재 선택된 정렬 옵션 찾기
  const selectedOption =
    sortOptions.find(option => option.value === sort) || sortOptions[0];

  const handleSortChange = (newSort: ReviewSortType) => {
    setSort(newSort);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex h-7 items-center gap-1.5 rounded-full bg-gray-50 px-3 text-xs text-gray-600 hover:bg-gray-100"
        >
          <span className="mr-1 flex h-3 w-3 items-center justify-center">
            {selectedOption.icon}
          </span>
          {selectedOption.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {sortOptions.map(option => (
          <DropdownMenuItem
            key={option.value}
            className={`cursor-pointer text-sm ${
              sort === option.value ? 'text-primary font-medium' : ''
            }`}
            onClick={() => handleSortChange(option.value)}
          >
            <span className="mr-2 inline-flex h-3.5 w-3.5 items-center justify-center">
              {option.icon}
            </span>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
