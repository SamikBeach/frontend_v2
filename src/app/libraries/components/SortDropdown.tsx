import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown, ChevronDown, Clock } from 'lucide-react';
import React from 'react';
import { SortDropdownProps, TimeRange } from '../types';

// 기간 필터 옵션
const timeRangeOptions = [
  { id: 'all', label: '전체 기간', icon: <Clock className="h-4 w-4" /> },
  { id: 'today', label: '오늘', icon: <Clock className="h-4 w-4" /> },
  { id: 'week', label: '이번 주', icon: <Clock className="h-4 w-4" /> },
  { id: 'month', label: '이번 달', icon: <Clock className="h-4 w-4" /> },
  { id: 'year', label: '올해', icon: <Clock className="h-4 w-4" /> },
];

export function SortDropdown({
  selectedSort,
  onSortChange,
  sortOptions,
  className = '',
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
          <Button variant="outline" className="h-10 border-gray-200 bg-white">
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

      {showTimeRangeFilter && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 border-gray-200 bg-white">
              {React.cloneElement(currentTimeRange.icon, {
                className: 'mr-2 h-4 w-4 text-gray-500',
              })}
              <span>{currentTimeRange.label}</span>
              <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[140px]">
            {timeRangeOptions.map(option => (
              <DropdownMenuItem
                key={option.id}
                className={`flex items-center ${
                  option.id === selectedTimeRange
                    ? 'bg-gray-50 font-medium text-gray-900'
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
