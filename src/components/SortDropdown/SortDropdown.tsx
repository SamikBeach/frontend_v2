import {
  ArrowDownAZ,
  ArrowUpDown,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// API와 일치하는 타입 사용
import { TimeRange as ApiTimeRange } from '@/apis/book/types';

// UI에서 사용하는 확장된 TimeRange
export type TimeRange = ApiTimeRange | 'today' | 'week';

export type SortOption = {
  id: string;
  label: string;
  icon: React.ReactNode;
  sortFn: (a: Book, b: Book) => number;
  supportsTimeRange?: boolean;
};

export const defaultSortOptions: SortOption[] = [
  {
    id: 'reviews-desc',
    label: '리뷰 많은순',
    icon: <Users className="mr-2 h-4 w-4 text-gray-500" />,
    sortFn: (a, b) => b.reviews - a.reviews,
    supportsTimeRange: true,
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

// 기간 필터 옵션
export const timeRangeOptions = [
  {
    id: 'all',
    label: '전체 기간',
    icon: <CalendarDays className="mr-2 h-4 w-4 text-gray-500" />,
  },
  {
    id: 'today',
    label: '오늘',
    icon: <Clock className="mr-2 h-4 w-4 text-gray-500" />,
  },
  {
    id: 'week',
    label: '이번 주',
    icon: <Clock3 className="mr-2 h-4 w-4 text-gray-500" />,
  },
  {
    id: 'month',
    label: '이번 달',
    icon: <Calendar className="mr-2 h-4 w-4 text-gray-500" />,
  },
  {
    id: 'year',
    label: '올해',
    icon: <CalendarClock className="mr-2 h-4 w-4 text-gray-500" />,
  },
];

interface SortDropdownProps {
  selectedSort: string;
  onSortChange: (sortId: string) => void;
  sortOptions?: SortOption[];
  className?: string;
  align?: 'start' | 'center' | 'end';
  // 기간 필터 관련 props 추가
  selectedTimeRange?: TimeRange;
  onTimeRangeChange?: (range: TimeRange) => void;
}

export function SortDropdown({
  selectedSort,
  onSortChange,
  sortOptions = defaultSortOptions,
  className = '',
  align = 'end',
  selectedTimeRange = 'all',
  onTimeRangeChange,
}: SortDropdownProps) {
  // 현재 선택된 정렬 옵션 가져오기
  const currentSortOption =
    sortOptions.find(option => option.id === selectedSort) || sortOptions[0];

  // 현재 선택된 기간 필터 가져오기
  const currentTimeRange =
    timeRangeOptions.find(option => option.id === selectedTimeRange) ||
    timeRangeOptions[0];

  // 인기순 정렬이 선택되었고, 기간 필터를 지원하는지 확인
  const showTimeRangeFilter =
    currentSortOption.supportsTimeRange && onTimeRangeChange;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9 border-gray-200 bg-white">
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

      {showTimeRangeFilter && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9 border-gray-200 bg-white">
              {React.cloneElement(currentTimeRange.icon, {
                className: 'mr-2 h-4 w-4 text-gray-500',
              })}
              <span>{currentTimeRange.label}</span>
              <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={align} className="w-[140px]">
            {timeRangeOptions.map(option => (
              <DropdownMenuItem
                key={option.id}
                className={`flex items-center ${
                  option.id === selectedTimeRange
                    ? 'bg-gray-50 font-medium text-blue-600'
                    : ''
                }`}
                onClick={() => onTimeRangeChange?.(option.id as TimeRange)}
              >
                {option.icon}
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

// 기간별 필터링을 위한 날짜 계산 함수
export const getDateFromTimeRange = (timeRange: TimeRange): Date | null => {
  const now = new Date();

  switch (timeRange) {
    case 'today':
      // 오늘 00:00:00 시간으로 설정
      now.setHours(0, 0, 0, 0);
      return now;
    case 'week':
      // 이번 주 일요일로 설정 (0: 일요일, 1: 월요일, ..., 6: 토요일)
      now.setDate(now.getDate() - now.getDay());
      now.setHours(0, 0, 0, 0);
      return now;
    case 'month':
      // 이번 달 1일로 설정
      now.setDate(1);
      now.setHours(0, 0, 0, 0);
      return now;
    case 'year':
      // 올해 1월 1일로 설정
      now.setMonth(0, 1);
      now.setHours(0, 0, 0, 0);
      return now;
    default:
      // 'all'인 경우 null 반환
      return null;
  }
};

export function useSortedBooks<T extends Book>(
  books: T[],
  selectedSort: string,
  sortOptions = defaultSortOptions,
  selectedTimeRange: TimeRange = 'all'
): T[] {
  // 현재 선택된 정렬 옵션 가져오기
  const currentSortOption =
    sortOptions.find(option => option.id === selectedSort) || sortOptions[0];

  // 정렬된 책 목록 반환
  return useMemo(() => {
    let filteredBooks = [...books];

    // 기간별 필터링 (supportsTimeRange가 true인 정렬 옵션일 때만)
    if (currentSortOption.supportsTimeRange && selectedTimeRange !== 'all') {
      const cutoffDate = getDateFromTimeRange(selectedTimeRange);
      if (cutoffDate) {
        filteredBooks = filteredBooks.filter(book => {
          const bookDate = new Date(book.publishDate);
          return bookDate >= cutoffDate;
        });
      }
    }

    return filteredBooks.sort(currentSortOption.sortFn);
  }, [books, currentSortOption, selectedTimeRange]);
}
