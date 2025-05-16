import { ReadingStatusType } from '@/apis/reading-status/types';
import { UserReadingStatusCountsDto } from '@/apis/user/types';
import { cn } from '@/lib/utils';

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
}

export function FilterMenu({
  selectedStatus,
  statusCounts,
  onStatusChange,
}: FilterMenuProps) {
  // 필터에 표시할 카운트 데이터 매핑
  const getCountForStatus = (statusType: ReadingStatusType | undefined) => {
    if (!statusCounts) return 0;

    if (!statusType) return statusCounts.total || 0;

    // 타입을 그대로 키로 사용
    return statusCounts[statusType] || 0;
  };

  return (
    <div className="mb-0 flex flex-wrap gap-3 sm:mb-6">
      {readingStatusFilters.map(filter => (
        <button
          key={filter.id}
          className={cn(
            'flex h-8 cursor-pointer items-center rounded-full border px-3 text-[13px] font-medium transition-all',
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
  );
}
