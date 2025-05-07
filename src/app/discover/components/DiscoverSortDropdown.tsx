import {
  SortOption as ApiSortOption,
  PopularBooksSortOptions,
} from '@/apis/book/types';
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
import { BarChart3, Bookmark, ClockIcon, Star } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// 기본값 상수 정의
const DEFAULT_SORT = PopularBooksSortOptions.RATING_DESC;
const DEFAULT_TIME_RANGE = 'all';

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
    value: PopularBooksSortOptions.REVIEWS_DESC,
    icon: <BarChart3 className="h-4 w-4" />,
    supportsTimeRange: true,
  },
  {
    id: 'rating',
    label: '평점 높은 순',
    value: PopularBooksSortOptions.RATING_DESC,
    icon: <Star className="h-4 w-4" />,
    supportsTimeRange: true,
  },
  {
    id: 'library',
    label: '서재에 많이담긴 순',
    value: PopularBooksSortOptions.LIBRARY_COUNT_DESC,
    icon: <Bookmark className="h-4 w-4" />,
    supportsTimeRange: true,
  },
  {
    id: 'latest',
    label: '최신 출간 순',
    value: PopularBooksSortOptions.PUBLISH_DATE_DESC,
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
      sort === PopularBooksSortOptions.RATING_DESC ||
      sort === PopularBooksSortOptions.REVIEWS_DESC ||
      sort === PopularBooksSortOptions.LIBRARY_COUNT_DESC ||
      sort === PopularBooksSortOptions.PUBLISH_DATE_DESC ||
      sort === PopularBooksSortOptions.TITLE_ASC
    ) {
      setSortOption(sort);

      // 기본값과 다른 경우에만 URL 쿼리 파라미터 업데이트
      if (sort !== DEFAULT_SORT) {
        updateQueryParams({ sort });
      } else {
        // 기본값인 경우 URL에서 제거
        updateQueryParams({ sort: undefined });
      }
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

      // 기본값과 다른 경우에만 URL 쿼리 파라미터 업데이트
      if (range !== DEFAULT_TIME_RANGE) {
        updateQueryParams({ timeRange: range });
      } else {
        // 기본값인 경우 URL에서 제거
        updateQueryParams({ timeRange: undefined });
      }
    } else {
      setTimeRange('all');
      // 기본값으로 설정된 경우 URL에서 제거
      updateQueryParams({ timeRange: undefined });
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
