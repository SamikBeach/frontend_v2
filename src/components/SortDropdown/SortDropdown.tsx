import {
  ArrowDownAZ,
  Bookmark,
  Calendar,
  CalendarClock,
  CalendarDays,
  ChevronDown,
  Clock,
  Clock3,
  Star,
  Users,
} from 'lucide-react';
import React, { useMemo } from 'react';

import { Book } from '@/apis/book/types';
import { Button } from '@/components/ui/button';
import {
  ResponsiveDropdownMenu,
  ResponsiveDropdownMenuContent,
  ResponsiveDropdownMenuItem,
  ResponsiveDropdownMenuTrigger,
} from '@/components/ui/responsive-dropdown-menu';

// API와 일치하는 타입 사용
import { TimeRange as ApiTimeRange, TimeRangeOptions } from '@/apis/book/types';

// UI에서 사용하는 확장된 TimeRange
export type TimeRange = ApiTimeRange;

export type SortOption<T = Book> = {
  id: string;
  label: string;
  icon: React.ReactNode;
  sortFn: (a: T, b: T) => number;
  supportsTimeRange?: boolean;
};

export const defaultSortOptions: SortOption<Book>[] = [
  {
    id: 'rating-desc',
    label: '평점 높은순',
    icon: <Star className="mr-2 h-4 w-4 text-[#FFAB00]" />,
    sortFn: (a, b) => b.rating - a.rating,
    supportsTimeRange: true,
  },
  {
    id: 'reviews-desc',
    label: '리뷰 많은순',
    icon: <Users className="mr-2 h-4 w-4 text-gray-500" />,
    sortFn: (a, b) => b.reviews - a.reviews,
    supportsTimeRange: true,
  },
  {
    id: 'library-desc',
    label: '서재에 많이 담긴 순',
    icon: <Bookmark className="mr-2 h-4 w-4 text-gray-500" />,
    sortFn: (a, b) =>
      ((b as any).libraryAdds || 0) - ((a as any).libraryAdds || 0),
    supportsTimeRange: true,
  },
  {
    id: 'publishDate-desc',
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

// 기간 필터 옵션
export const timeRangeOptions = [
  {
    id: TimeRangeOptions.ALL,
    label: '전체 기간',
    icon: <CalendarDays className="mr-2 h-4 w-4 text-gray-500" />,
  },
  {
    id: TimeRangeOptions.TODAY,
    label: '오늘',
    icon: <Clock className="mr-2 h-4 w-4 text-gray-500" />,
  },
  {
    id: TimeRangeOptions.WEEK,
    label: '이번 주',
    icon: <Clock3 className="mr-2 h-4 w-4 text-gray-500" />,
  },
  {
    id: TimeRangeOptions.MONTH,
    label: '이번 달',
    icon: <Calendar className="mr-2 h-4 w-4 text-gray-500" />,
  },
  {
    id: TimeRangeOptions.YEAR,
    label: '올해',
    icon: <CalendarClock className="mr-2 h-4 w-4 text-gray-500" />,
  },
];

interface SortDropdownProps<T = Book> {
  selectedSort: string;
  onSortChange: (sortId: string) => void;
  sortOptions?: SortOption<T>[];
  className?: string;
  align?: 'start' | 'center' | 'end';
  // 기간 필터 관련 props 추가
  selectedTimeRange?: TimeRange;
  onTimeRangeChange?: (range: TimeRange) => void;
}

// 정렬 기준별 텍스트
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
  // 현재 선택된 정렬 옵션 가져오기
  const currentSortOption =
    sortOptions.find(option => option.id === selectedSort) || sortOptions[0];

  // 현재 선택된 기간 필터 가져오기
  const currentTimeRange =
    timeRangeOptions.find(option => option.id === selectedTimeRange) ||
    timeRangeOptions[0];

  // 기간 필터 표시 여부 - onTimeRangeChange가 존재할 때만 표시
  const showTimeRangeFilter = !!onTimeRangeChange;

  // 버튼에 표시할 정렬 텍스트
  const sortButtonText = SORT_LABELS[selectedSort] || currentSortOption.label;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showTimeRangeFilter && (
        <ResponsiveDropdownMenu>
          <ResponsiveDropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9 border-gray-200 bg-white">
              {React.cloneElement(currentTimeRange.icon, {
                className: 'mr-2 h-4 w-4 text-gray-500',
              })}
              <span>{currentTimeRange.label}</span>
              <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
            </Button>
          </ResponsiveDropdownMenuTrigger>
          <ResponsiveDropdownMenuContent align={align} className="w-[140px]">
            {timeRangeOptions.map(option => (
              <ResponsiveDropdownMenuItem
                key={option.id}
                className={`flex cursor-pointer items-center ${
                  option.id === selectedTimeRange
                    ? 'bg-gray-50 font-medium text-blue-600'
                    : ''
                }`}
                onSelect={() => onTimeRangeChange?.(option.id as TimeRange)}
              >
                {option.icon}
                {option.label}
              </ResponsiveDropdownMenuItem>
            ))}
          </ResponsiveDropdownMenuContent>
        </ResponsiveDropdownMenu>
      )}

      <ResponsiveDropdownMenu>
        <ResponsiveDropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9 border-gray-200 bg-white">
            {currentSortOption.icon}
            <span>{sortButtonText}</span>
            <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
          </Button>
        </ResponsiveDropdownMenuTrigger>
        <ResponsiveDropdownMenuContent align={align} className="w-[180px]">
          {sortOptions.map(option => (
            <ResponsiveDropdownMenuItem
              key={option.id}
              className={`flex cursor-pointer items-center ${
                option.id === selectedSort
                  ? 'bg-gray-50 font-medium text-blue-600'
                  : ''
              }`}
              onSelect={() => onSortChange(option.id)}
            >
              {option.icon}
              {option.label}
            </ResponsiveDropdownMenuItem>
          ))}
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

export function useSortedBooks<T extends object>(
  books: T[],
  selectedSort: string,
  sortOptions: SortOption<T>[],
  selectedTimeRange: TimeRange = TimeRangeOptions.ALL
): T[] {
  // 현재 선택된 정렬 옵션 가져오기
  const currentSortOption =
    sortOptions.find(option => option.id === selectedSort) || sortOptions[0];

  // 정렬된 책 목록 반환
  return useMemo(() => {
    let filteredBooks = [...books];

    // 기간별 필터링 (supportsTimeRange가 true인 정렬 옵션일 때만)
    if (
      currentSortOption.supportsTimeRange &&
      selectedTimeRange !== TimeRangeOptions.ALL
    ) {
      const cutoffDate = getDateFromTimeRange(selectedTimeRange);
      if (cutoffDate && books.length > 0 && 'publishDate' in books[0]) {
        filteredBooks = filteredBooks.filter(book => {
          const bookDate = new Date((book as any).publishDate);
          return bookDate >= cutoffDate;
        });
      }
    }

    return filteredBooks.sort(currentSortOption.sortFn);
  }, [books, currentSortOption, selectedTimeRange]);
}
