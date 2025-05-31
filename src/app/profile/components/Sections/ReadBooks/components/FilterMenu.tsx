import { ReadingStatusType } from '@/apis/reading-status/types';
import {
  UserBooksSortOptions,
  UserReadingStatusCountsDto,
} from '@/apis/user/types';
import { SortDropdown, SortOption, TimeRange } from '@/components/SortDropdown';
import { cn } from '@/lib/utils';
import {
  ArrowDownAZ,
  Bookmark,
  Calendar,
  Clock,
  Star,
  Users,
} from 'lucide-react';

// 프로필 읽기 섹션 전용 정렬 옵션
const userBooksSortOptions: SortOption[] = [
  {
    id: UserBooksSortOptions.RATING_DESC,
    label: '평점 높은순',
    icon: (isActive: boolean) => (
      <Star
        className={`h-3.5 w-3.5 ${isActive ? 'text-blue-700' : 'text-[#FFAB00]'}`}
      />
    ),
    sortFn: (a: any, b: any) => b.rating - a.rating,
    supportsTimeRange: true,
  },
  {
    id: UserBooksSortOptions.REVIEWS_DESC,
    label: '리뷰 많은순',
    icon: (isActive: boolean) => (
      <Users
        className={`h-3.5 w-3.5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`}
      />
    ),
    sortFn: (a: any, b: any) => b.reviews - a.reviews,
    supportsTimeRange: true,
  },
  {
    id: UserBooksSortOptions.LIBRARY_COUNT_DESC,
    label: '서재에 많이 담긴 순',
    icon: (isActive: boolean) => (
      <Bookmark
        className={`h-3.5 w-3.5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`}
      />
    ),
    sortFn: (a: any, b: any) =>
      ((b as any).libraryAdds || 0) - ((a as any).libraryAdds || 0),
    supportsTimeRange: true,
  },
  {
    id: UserBooksSortOptions.CREATED_AT_DESC,
    label: '최근 읽은 순',
    icon: (isActive: boolean) => (
      <Clock
        className={`h-3.5 w-3.5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`}
      />
    ),
    sortFn: (a: any, b: any) =>
      new Date((b as any).createdAt || 0).getTime() -
      new Date((a as any).createdAt || 0).getTime(),
    supportsTimeRange: true,
  },
  {
    id: UserBooksSortOptions.PUBLISH_DATE_DESC,
    label: '출간일 최신순',
    icon: (isActive: boolean) => (
      <Calendar
        className={`h-3.5 w-3.5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`}
      />
    ),
    sortFn: (a: any, b: any) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
  },
  {
    id: UserBooksSortOptions.TITLE_ASC,
    label: '제목 가나다순',
    icon: (isActive: boolean) => (
      <ArrowDownAZ
        className={`h-3.5 w-3.5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`}
      />
    ),
    sortFn: (a: any, b: any) => a.title.localeCompare(b.title, 'ko'),
  },
];

// 독서 상태 필터 매핑 - 순서 변경: 전체, 읽고 싶어요, 읽는중, 읽었어요
export const readingStatusFilters = [
  { id: 'ALL', name: '전체', type: undefined },
  {
    id: 'WANT_TO_READ',
    name: '읽고 싶어요',
    type: ReadingStatusType.WANT_TO_READ,
  },
  {
    id: 'READING',
    name: '읽는중',
    type: ReadingStatusType.READING,
  },
  {
    id: 'READ',
    name: '읽었어요',
    type: ReadingStatusType.READ,
  },
];

interface FilterMenuProps {
  selectedStatus: ReadingStatusType | undefined;
  statusCounts: UserReadingStatusCountsDto;
  onStatusChange: (status: ReadingStatusType | undefined) => void;
  // 정렬 및 기간 필터 관련 props 추가
  selectedSort: string;
  selectedTimeRange: TimeRange;
  onSortChange: (sort: string) => void;
  onTimeRangeChange: (range: TimeRange) => void;
}

export function FilterMenu({
  selectedStatus,
  statusCounts,
  onStatusChange,
  selectedSort,
  selectedTimeRange,
  onSortChange,
  onTimeRangeChange,
}: FilterMenuProps) {
  // 필터에 표시할 카운트 데이터 매핑
  const getCountForStatus = (statusType: ReadingStatusType | undefined) => {
    if (!statusCounts) return 0;

    if (!statusType) return statusCounts.total || 0;

    // 타입을 그대로 키로 사용
    return statusCounts[statusType] || 0;
  };

  // 정렬 옵션에 따라 TimeRange 필터 표시 여부 결정
  const showTimeRangeFilter = [
    UserBooksSortOptions.RATING_DESC,
    UserBooksSortOptions.REVIEWS_DESC,
    UserBooksSortOptions.LIBRARY_COUNT_DESC,
    UserBooksSortOptions.CREATED_AT_DESC,
  ].includes(selectedSort as UserBooksSortOptions);

  return (
    <div className="mb-3 sm:mb-6">
      {/* 발견하기 페이지와 동일한 레이아웃: 독서 상태 필터와 정렬 필터를 좌우로 분리 */}
      <div className="relative w-full">
        {/* 독서 상태 필터와 정렬 옵션 배치 */}
        <div className="flex w-full items-start justify-between">
          {/* 독서 상태 필터 - 왼쪽 */}
          <div className="no-scrollbar w-full overflow-x-auto pt-0.5 pb-1 md:pt-1 md:pb-1">
            <div className="flex gap-2 pl-2 after:block after:w-1 after:flex-shrink-0 after:content-[''] md:flex-wrap md:gap-3 md:overflow-x-visible md:pl-0 md:after:content-none">
              {readingStatusFilters.map(filter => (
                <button
                  key={filter.id}
                  className={cn(
                    'flex h-8 shrink-0 cursor-pointer items-center rounded-full border px-3 text-[13px] font-medium transition-all',
                    selectedStatus === filter.type
                      ? 'border-blue-200 bg-blue-50 text-blue-600'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  )}
                  onClick={() => onStatusChange(filter.type)}
                >
                  <span>{filter.name}</span>
                  <span className="ml-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-100 px-1 text-[11px] text-gray-600">
                    {getCountForStatus(filter.type)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 정렬 드롭다운 - 오른쪽 (데스크탑에서만 표시) */}
          <div className="ml-4 hidden flex-shrink-0 items-center xl:flex">
            <SortDropdown
              selectedSort={selectedSort}
              onSortChange={onSortChange}
              sortOptions={userBooksSortOptions}
              selectedTimeRange={selectedTimeRange}
              onTimeRangeChange={
                showTimeRangeFilter ? onTimeRangeChange : undefined
              }
              className="justify-end"
              align="end"
            />
          </div>
        </div>

        {/* xl 미만 화면에서 보이는 정렬 버튼 */}
        <div className="w-full xl:hidden">
          <SortDropdown
            selectedSort={selectedSort}
            onSortChange={onSortChange}
            sortOptions={userBooksSortOptions}
            selectedTimeRange={selectedTimeRange}
            onTimeRangeChange={
              showTimeRangeFilter ? onTimeRangeChange : undefined
            }
            className="w-full justify-start"
            align="start"
          />
        </div>
      </div>
    </div>
  );
}
