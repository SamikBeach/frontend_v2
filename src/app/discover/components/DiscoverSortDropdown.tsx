import { SortOption as ApiSortOption } from '@/apis/book/types';
import {
  discoverSortOptionAtom,
  discoverTimeRangeAtom,
} from '@/atoms/discover';
import {
  SortDropdown,
  TimeRange as SortTimeRange,
} from '@/components/SortDropdown';
import { useQueryParams } from '@/hooks';
import { useAtom } from 'jotai';
import { BarChart3, ClockIcon, Star } from 'lucide-react';
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

interface DiscoverSortDropdownProps {
  className?: string;
}

export function DiscoverSortDropdown({ className }: DiscoverSortDropdownProps) {
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
  const handleSortChange = (sort: string) => {
    if (
      sort === 'rating-desc' ||
      sort === 'reviews-desc' ||
      sort === 'publishDate-desc' ||
      sort === 'title-asc'
    ) {
      setSortOption(sort);
      updateQueryParams({ sort });
    }
  };

  // 기간 필터 변경 핸들러
  const handleTimeRangeChange = (range: SortTimeRange) => {
    if (
      range === 'all' ||
      range === 'month' ||
      range === 'year' ||
      range === 'today' ||
      range === 'week'
    ) {
      setTimeRange(range);
      updateQueryParams({ timeRange: range });
    } else {
      setTimeRange('all');
      updateQueryParams({ timeRange: 'all' });
    }
  };

  return (
    <SortDropdown
      selectedSort={sortOption}
      onSortChange={handleSortChange}
      selectedTimeRange={timeRange}
      onTimeRangeChange={handleTimeRangeChange}
      className={className}
    />
  );
}
