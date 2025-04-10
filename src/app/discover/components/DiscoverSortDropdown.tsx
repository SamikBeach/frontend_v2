import { SortOption, TimeRange } from '@/apis/book/types';
import {
  discoverSortOptionAtom,
  discoverTimeRangeAtom,
} from '@/atoms/discover';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useQueryParams } from '@/hooks';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import {
  ArrowDownAZ,
  CalendarIcon,
  ChevronDown,
  ListFilter,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const sortOptions = [
  {
    label: '리뷰 많은 순',
    value: 'reviews-desc',
    icon: <ListFilter className="mr-2 h-4 w-4" />,
  },
  {
    label: '평점 높은 순',
    value: 'rating-desc',
    icon: <ArrowDownAZ className="mr-2 h-4 w-4" />,
  },
  {
    label: '최신 출간 순',
    value: 'publishDate-desc',
    icon: <CalendarIcon className="mr-2 h-4 w-4" />,
  },
];

const timeRangeOptions = [
  { label: '전체 기간', value: 'all' },
  { label: '최근 1개월', value: 'month' },
  { label: '최근 1년', value: 'year' },
];

interface DiscoverSortDropdownProps {
  className?: string;
}

export function DiscoverSortDropdown({ className }: DiscoverSortDropdownProps) {
  const { updateQueryParams } = useQueryParams();
  const [sortOption, setSortOption] = useAtom(discoverSortOptionAtom);
  const [timeRange, setTimeRange] = useAtom(discoverTimeRangeAtom);

  // 화면에 표시할 정렬 옵션 레이블
  const [sortLabel, setSortLabel] = useState('정렬');

  // sortOption이 변경될 때 레이블 업데이트
  useEffect(() => {
    const currentOption = sortOptions.find(
      option => option.value === sortOption
    );
    setSortLabel(currentOption?.label || '정렬');
  }, [sortOption]);

  // 정렬 옵션 변경 핸들러
  const handleSortChange = (value: string) => {
    const sortValue = value as SortOption;
    setSortOption(sortValue);
    updateQueryParams({ sort: sortValue });
  };

  // 기간 필터 변경 핸들러
  const handleTimeRangeChange = (value: string) => {
    const timeValue = value as TimeRange;
    setTimeRange(timeValue);
    updateQueryParams({ timeRange: timeValue });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'flex w-fit items-center justify-between gap-1 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900',
            className
          )}
        >
          <span className="flex items-center">
            <ListFilter className="mr-2 h-4 w-4" />
            {sortLabel}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>정렬 옵션</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={sortOption}
          onValueChange={handleSortChange}
        >
          {sortOptions.map(option => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.icon}
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>기간 필터</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuRadioGroup
            value={timeRange}
            onValueChange={handleTimeRangeChange}
          >
            {timeRangeOptions.map(option => (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
