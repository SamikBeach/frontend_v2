import { SortOption as ApiSortOption } from '@/apis/book/types';
import {
  discoverSortOptionAtom,
  discoverTimeRangeAtom,
} from '@/atoms/discover';
import { useQueryParams } from '@/hooks';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import {
  BarChart3,
  CheckIcon,
  ChevronDown,
  ClockIcon,
  Star,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

// 정렬 옵션 타입
export interface SortOption {
  id: string;
  label: string;
  value: ApiSortOption;
  icon: React.ReactNode;
  supportsTimeRange?: boolean;
}

// 기간 필터 타입
export type TimeRange = 'all' | 'month' | 'year';

// 정렬 옵션 정의
const sortOptions: SortOption[] = [
  {
    id: 'reviews',
    label: '리뷰 많은 순',
    value: 'reviews-desc',
    icon: <BarChart3 className="h-4 w-4" />,
    supportsTimeRange: true,
  },
  {
    id: 'rating',
    label: '평점 높은 순',
    value: 'rating-desc',
    icon: <Star className="h-4 w-4" />,
    supportsTimeRange: true,
  },
  {
    id: 'latest',
    label: '최신 출간 순',
    value: 'publishDate-desc',
    icon: <ClockIcon className="h-4 w-4" />,
    supportsTimeRange: false,
  },
];

// 기간 필터 옵션 정의
const timeRangeOptions = [
  { id: 'all', label: '전체 기간', value: 'all' },
  { id: 'month', label: '최근 1개월', value: 'month' },
  { id: 'year', label: '최근 1년', value: 'year' },
];

export function DiscoverSortDropdown({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sortOption, setSortOption] = useAtom(discoverSortOptionAtom);
  const [timeRange, setTimeRange] = useAtom(discoverTimeRangeAtom);
  const [displaySortLabel, setDisplaySortLabel] = useState('정렬');
  const { updateQueryParams } = useQueryParams();

  // 정렬 옵션이 변경되면 표시 레이블 업데이트
  useEffect(() => {
    const option = sortOptions.find(opt => opt.value === sortOption);
    setDisplaySortLabel(option?.label || '정렬');
  }, [sortOption]);

  // 정렬 옵션 변경 핸들러
  const handleSortChange = (value: ApiSortOption) => {
    setSortOption(value);
    updateQueryParams({ sort: value });

    // 기간 필터 지원 여부 확인
    const option = sortOptions.find(opt => opt.value === value);
    if (!option?.supportsTimeRange) {
      setTimeRange('all');
      updateQueryParams({ timeRange: 'all' });
    }
  };

  // 기간 필터 변경 핸들러
  const handleTimeRangeChange = (value: TimeRange) => {
    setTimeRange(value);
    updateQueryParams({ timeRange: value });
  };

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
      >
        <span>{displaySortLabel}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 z-10 mt-1 w-48 rounded-md border border-gray-100 bg-white shadow-md">
          <div className="py-1">
            {sortOptions.map(option => (
              <div
                key={option.id}
                className="flex w-full cursor-pointer items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  handleSortChange(option.value);
                  if (!option.supportsTimeRange) {
                    setIsOpen(false);
                  }
                }}
              >
                <div className="mr-2">{option.icon}</div>
                <span>{option.label}</span>
                {sortOption === option.value && (
                  <CheckIcon className="ml-auto h-4 w-4 text-blue-500" />
                )}
              </div>
            ))}
          </div>

          {/* 현재 선택된 정렬 옵션이 기간 필터를 지원하는 경우에만 표시 */}
          {sortOptions.find(opt => opt.value === sortOption)
            ?.supportsTimeRange && (
            <>
              <div className="border-t border-gray-100" />
              <div className="py-1">
                {timeRangeOptions.map(option => (
                  <div
                    key={option.id}
                    className="flex w-full cursor-pointer items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      handleTimeRangeChange(option.value as TimeRange);
                      setIsOpen(false);
                    }}
                  >
                    <span>{option.label}</span>
                    {timeRange === option.value && (
                      <CheckIcon className="ml-auto h-4 w-4 text-blue-500" />
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
