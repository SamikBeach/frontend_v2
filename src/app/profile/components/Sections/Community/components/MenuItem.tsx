import { ReviewType } from '@/apis/review/types';
import { UserReviewTypeCountsDto } from '@/apis/user/types';
import { cn } from '@/lib/utils';
import { reviewTypeFilters } from '../constants';

interface MenuItemProps {
  filter: (typeof reviewTypeFilters)[0];
  counts: UserReviewTypeCountsDto;
  selectedType: ReviewType | undefined;
  onSelectType: (type: ReviewType | undefined) => void;
}

export function MenuItem({
  filter,
  counts,
  selectedType,
  onSelectType,
}: MenuItemProps) {
  const isSelected = selectedType === filter.type;

  // 필터 타입의 키 (all 또는 타입 이름)
  const filterKey = filter.id === 'all' ? 'total' : filter.id;

  // 해당 타입의 카운트 계산 (all인 경우 total에서 review 타입 제외)
  let count = 0;
  if (filter.id === 'all') {
    // 전체 카운트 = 총합에서 review 타입 제외
    count = (counts.total || 0) - (counts.review || 0);
  } else {
    // 개별 타입 카운트
    count = counts[filterKey as keyof UserReviewTypeCountsDto] || 0;
  }

  return (
    <button
      className={cn(
        'flex h-8 cursor-pointer items-center rounded-full border px-3 text-[13px] font-medium transition-all',
        isSelected
          ? 'border-blue-200 bg-blue-50 text-blue-600'
          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
      )}
      onClick={() => onSelectType(filter.type)}
    >
      <span>{filter.name}</span>
      <span className="ml-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-100 px-1 text-[11px] text-gray-600">
        {count}
      </span>
    </button>
  );
}
