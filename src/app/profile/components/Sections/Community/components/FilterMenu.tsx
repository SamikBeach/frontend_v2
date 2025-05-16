import { ReviewType } from '@/apis/review/types';
import { UserReviewTypeCountsDto } from '@/apis/user/types';
import { reviewTypeFilters } from '../constants';
import { MenuItem } from './MenuItem';

interface FilterMenuProps {
  counts: UserReviewTypeCountsDto;
  selectedType: ReviewType | undefined;
  onSelectType: (type: ReviewType | undefined) => void;
}

export function FilterMenu({
  counts,
  selectedType,
  onSelectType,
}: FilterMenuProps) {
  return (
    <div className="mb-3 flex flex-wrap gap-3 sm:mb-6">
      {reviewTypeFilters.map(filter => (
        <MenuItem
          key={filter.id}
          filter={filter}
          counts={counts}
          selectedType={selectedType}
          onSelectType={onSelectType}
        />
      ))}
    </div>
  );
}
