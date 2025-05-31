import { ReadingStatusType } from '@/apis/reading-status/types';
import { TimeRangeOptions, UserBooksSortOptions } from '@/apis/user/types';
import { TimeRange } from '@/components/SortDropdown';
import { useQueryParams } from '@/hooks';
import {
  isValidReadingStatusType,
  isValidTimeRange,
  isValidUserBooksSortOption,
} from '@/utils/type-guards';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { BooksList, FilterMenu } from './components';
import { useReadingStatusCounts } from './hooks';
import { BooksGridSkeleton, FilterMenuSkeleton } from './ReadBooksSkeleton';

// 기본값 상수 정의
const DEFAULT_STATUS = undefined;
const DEFAULT_SORT = UserBooksSortOptions.RATING_DESC;
const DEFAULT_TIME_RANGE = TimeRangeOptions.ALL;

// 메인 컴포넌트 - 필터 탭 포함
export default function ReadBooks() {
  const searchParams = useSearchParams();
  const { updateQueryParams } = useQueryParams();

  const [selectedStatus, setSelectedStatus] = useState<
    ReadingStatusType | undefined
  >(DEFAULT_STATUS);

  // 정렬 및 기간 필터 상태 추가
  const [selectedSort, setSelectedSort] = useState<string>(DEFAULT_SORT);
  const [selectedTimeRange, setSelectedTimeRange] =
    useState<TimeRange>(DEFAULT_TIME_RANGE);

  const { statusCounts, isLoading } = useReadingStatusCounts();

  // URL 파라미터에서 필터 상태 초기화
  useEffect(() => {
    // URL에서 파라미터 읽기 - 없으면 기본값 사용
    const statusParam = searchParams.get('status');
    const sortParam = searchParams.get('sort');
    const timeRangeParam = searchParams.get('timeRange');

    // 독서 상태 설정
    if (statusParam && isValidReadingStatusType(statusParam)) {
      setSelectedStatus(statusParam);
    } else {
      setSelectedStatus(DEFAULT_STATUS);
    }

    // 정렬 설정
    if (sortParam && isValidUserBooksSortOption(sortParam)) {
      setSelectedSort(sortParam);
    } else {
      setSelectedSort(DEFAULT_SORT);
    }

    // 기간 필터 설정
    if (timeRangeParam && isValidTimeRange(timeRangeParam)) {
      setSelectedTimeRange(timeRangeParam);
    } else {
      setSelectedTimeRange(DEFAULT_TIME_RANGE);
    }
  }, [searchParams]);

  // 독서 상태 변경 핸들러
  const handleStatusChange = (statusType: ReadingStatusType | undefined) => {
    setSelectedStatus(statusType);

    // URL 쿼리 파라미터 업데이트 - 기본값이 아닌 경우에만
    if (statusType !== DEFAULT_STATUS) {
      updateQueryParams({ status: statusType });
    } else {
      // 기본값인 경우 URL에서 제거
      updateQueryParams({ status: undefined });
    }
  };

  // 정렬 변경 핸들러
  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);

    // URL 쿼리 파라미터 업데이트 - 기본값이 아닌 경우에만
    if (sort !== DEFAULT_SORT) {
      updateQueryParams({ sort });
    } else {
      // 기본값인 경우 URL에서 제거
      updateQueryParams({ sort: undefined });
    }
  };

  // 기간 필터 변경 핸들러
  const handleTimeRangeChange = (range: TimeRange) => {
    setSelectedTimeRange(range);

    // URL 쿼리 파라미터 업데이트 - 기본값이 아닌 경우에만
    if (range !== DEFAULT_TIME_RANGE) {
      updateQueryParams({ timeRange: range });
    } else {
      // 기본값인 경우 URL에서 제거
      updateQueryParams({ timeRange: undefined });
    }
  };

  return (
    <div>
      {/* 독서 상태 필터 */}
      {isLoading ? (
        <FilterMenuSkeleton />
      ) : (
        <FilterMenu
          selectedStatus={selectedStatus}
          statusCounts={statusCounts}
          onStatusChange={handleStatusChange}
          selectedSort={selectedSort}
          selectedTimeRange={selectedTimeRange}
          onSortChange={handleSortChange}
          onTimeRangeChange={handleTimeRangeChange}
        />
      )}

      {/* 책 목록 섹션 - 필터 선택에 따라 이 부분만 다시 로드됨 */}
      <Suspense fallback={<BooksGridSkeleton />}>
        <BooksList
          status={selectedStatus}
          sort={selectedSort}
          timeRange={selectedTimeRange}
        />
      </Suspense>
    </div>
  );
}
