import {
  ArrowDownAZ,
  Bookmark,
  Calendar,
  CalendarClock,
  CalendarDays,
  Clock,
  Clock3,
  Star,
  Users,
} from 'lucide-react';
import React from 'react';

import { Book } from '@/apis/book/types';
import { Button } from '@/components/ui/button';
import {
  ResponsiveDropdownMenu,
  ResponsiveDropdownMenuContent,
  ResponsiveDropdownMenuItem,
  ResponsiveDropdownMenuTrigger,
} from '@/components/ui/responsive-dropdown-menu';

import { TimeRange as ApiTimeRange, TimeRangeOptions } from '@/apis/book/types';

export type TimeRange = ApiTimeRange;

export type SortOption<T = Book> = {
  id: string;
  label: string;
  icon: ((isActive: boolean) => React.ReactNode) | React.ReactNode;
  sortFn: (a: T, b: T) => number;
  supportsTimeRange?: boolean;
};

export type TimeRangeOption = {
  id: TimeRangeOptions;
  label: string;
  icon: (isActive: boolean) => React.ReactNode;
};

export const defaultSortOptions: SortOption<Book>[] = [
  {
    id: 'rating-desc',
    label: '평점 높은순',
    icon: (isActive: boolean) => (
      <Star
        className={`h-3.5 w-3.5 ${isActive ? 'text-blue-700' : 'text-[#FFAB00]'}`}
      />
    ),
    sortFn: (a, b) => b.rating - a.rating,
    supportsTimeRange: true,
  },
  {
    id: 'reviews-desc',
    label: '리뷰 많은순',
    icon: (isActive: boolean) => (
      <Users
        className={`h-3.5 w-3.5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`}
      />
    ),
    sortFn: (a, b) => b.reviews - a.reviews,
    supportsTimeRange: true,
  },
  {
    id: 'library-desc',
    label: '서재에 많이 담긴 순',
    icon: (isActive: boolean) => (
      <Bookmark
        className={`h-3.5 w-3.5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`}
      />
    ),
    sortFn: (a, b) =>
      ((b as any).libraryAdds || 0) - ((a as any).libraryAdds || 0),
    supportsTimeRange: true,
  },
  {
    id: 'publishDate-desc',
    label: '출간일 최신순',
    icon: (isActive: boolean) => (
      <Calendar
        className={`h-3.5 w-3.5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`}
      />
    ),
    sortFn: (a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
  },
  {
    id: 'title-asc',
    label: '제목 가나다순',
    icon: (isActive: boolean) => (
      <ArrowDownAZ
        className={`h-3.5 w-3.5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`}
      />
    ),
    sortFn: (a, b) => a.title.localeCompare(b.title, 'ko'),
  },
];

export const timeRangeOptions: TimeRangeOption[] = [
  {
    id: TimeRangeOptions.ALL,
    label: '전체 기간',
    icon: (isActive: boolean) => (
      <CalendarDays
        className={`h-3.5 w-3.5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`}
      />
    ),
  },
  {
    id: TimeRangeOptions.TODAY,
    label: '오늘',
    icon: (isActive: boolean) => (
      <Clock
        className={`h-3.5 w-3.5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`}
      />
    ),
  },
  {
    id: TimeRangeOptions.WEEK,
    label: '이번 주',
    icon: (isActive: boolean) => (
      <Clock3
        className={`h-3.5 w-3.5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`}
      />
    ),
  },
  {
    id: TimeRangeOptions.MONTH,
    label: '이번 달',
    icon: (isActive: boolean) => (
      <Calendar
        className={`h-3.5 w-3.5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`}
      />
    ),
  },
  {
    id: TimeRangeOptions.YEAR,
    label: '올해',
    icon: (isActive: boolean) => (
      <CalendarClock
        className={`h-3.5 w-3.5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`}
      />
    ),
  },
];

interface SortDropdownProps<T = Book> {
  selectedSort: string;
  onSortChange: (sortId: string) => void;
  sortOptions?: SortOption<T>[];
  className?: string;
  align?: 'start' | 'center' | 'end';
  selectedTimeRange?: TimeRange;
  onTimeRangeChange?: (range: TimeRange) => void;
}

const SORT_LABELS: Record<string, string> = {
  popular: '인기순',
  books: '담긴 책 많은 순',
  latest: '최신순',
  title: '제목순',
  relevance: '관련도순',
  'library-desc': '서재에 많이 담긴 순',
};

export function SortDropdown<T = Book>({
  selectedSort,
  onSortChange,
  sortOptions = defaultSortOptions as unknown as SortOption<T>[],
  className = '',
  align = 'end',
  selectedTimeRange = TimeRangeOptions.ALL,
  onTimeRangeChange,
}: SortDropdownProps<T>) {
  const currentSortOption =
    sortOptions.find(option => option.id === selectedSort) || sortOptions[0];

  const currentTimeRange =
    timeRangeOptions.find(option => option.id === selectedTimeRange) ||
    timeRangeOptions[0];

  const showTimeRangeFilter = !!onTimeRangeChange;

  const sortButtonText = SORT_LABELS[selectedSort] || currentSortOption.label;

  const isTimeRangeActive = selectedTimeRange !== TimeRangeOptions.ALL;
  const isSortActive = selectedSort !== (sortOptions[0]?.id ?? '');

  return (
    <div
      className={`flex flex-wrap items-center gap-2 px-2 pt-1.5 pb-1.5 md:flex-nowrap md:px-0 ${className}`}
    >
      {showTimeRangeFilter && (
        <ResponsiveDropdownMenu>
          <ResponsiveDropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={
                `flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-xs ` +
                (isTimeRangeActive
                  ? 'border border-blue-200 bg-blue-50 text-blue-700'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100')
              }
            >
              <span className="mr-1 flex h-3 w-3 items-center justify-center">
                {typeof currentTimeRange.icon === 'function'
                  ? currentTimeRange.icon(isTimeRangeActive)
                  : currentTimeRange.icon}
              </span>
              {currentTimeRange.label}
            </Button>
          </ResponsiveDropdownMenuTrigger>
          <ResponsiveDropdownMenuContent
            align={align}
            className="w-[140px]"
            sideOffset={8}
          >
            {timeRangeOptions.map(option => {
              const isActive = option.id === selectedTimeRange;
              return (
                <ResponsiveDropdownMenuItem
                  key={option.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors ${isActive ? 'text-primary bg-blue-50 font-medium' : 'text-gray-700'} `}
                  onSelect={() => onTimeRangeChange?.(option.id as TimeRange)}
                >
                  <span className="mr-2 inline-flex h-3.5 w-3.5 items-center justify-center">
                    {option.icon(false)}
                  </span>
                  {option.label}
                </ResponsiveDropdownMenuItem>
              );
            })}
          </ResponsiveDropdownMenuContent>
        </ResponsiveDropdownMenu>
      )}

      <ResponsiveDropdownMenu>
        <ResponsiveDropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={
              `flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-xs ` +
              (isSortActive
                ? 'border border-blue-200 bg-blue-50 text-blue-700'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100')
            }
          >
            <span className="mr-1 flex h-3 w-3 items-center justify-center">
              {typeof currentSortOption.icon === 'function'
                ? currentSortOption.icon(isSortActive)
                : currentSortOption.icon}
            </span>
            {sortButtonText}
          </Button>
        </ResponsiveDropdownMenuTrigger>
        <ResponsiveDropdownMenuContent
          align={align}
          className="w-[180px]"
          sideOffset={8}
        >
          {sortOptions.map(option => {
            const isActive = option.id === selectedSort;
            return (
              <ResponsiveDropdownMenuItem
                key={option.id}
                className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors ${isActive ? 'text-primary bg-blue-50 font-medium' : 'text-gray-700'} `}
                onSelect={() => onSortChange(option.id)}
              >
                <span className="mr-2 inline-flex h-3.5 w-3.5 items-center justify-center">
                  {typeof option.icon === 'function'
                    ? option.icon(false)
                    : option.icon}
                </span>
                {option.label}
              </ResponsiveDropdownMenuItem>
            );
          })}
        </ResponsiveDropdownMenuContent>
      </ResponsiveDropdownMenu>
    </div>
  );
}

// 기간별 필터링을 위한 날짜 계산 함수
export const getDateFromTimeRange = (timeRange: TimeRange): Date | null => {
  const now = new Date();
  let dayOfWeek: number;
  let diff: number;

  switch (timeRange) {
    case TimeRangeOptions.TODAY:
      // 오늘 00:00:00 시간으로 설정
      now.setHours(0, 0, 0, 0);
      return now;
    case TimeRangeOptions.WEEK:
      // 이번 주의 시작일(월요일)을 계산
      dayOfWeek = now.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
      diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 일요일이면 6, 아니면 현재 요일 - 1
      now.setDate(now.getDate() - diff);
      now.setHours(0, 0, 0, 0);
      return now;
    case TimeRangeOptions.MONTH:
      // 이번 달 1일로 설정
      now.setDate(1);
      now.setHours(0, 0, 0, 0);
      return now;
    case TimeRangeOptions.YEAR:
      // 올해 1월 1일로 설정
      now.setMonth(0, 1);
      now.setHours(0, 0, 0, 0);
      return now;
    default:
      // 'all'인 경우 null 반환
      return null;
  }
};
