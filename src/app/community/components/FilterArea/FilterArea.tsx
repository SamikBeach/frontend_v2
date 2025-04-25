import { ReviewType } from '@/apis/review/types';
import { CategoryFilter } from './CategoryFilter';
import { SortFilter, SortOption } from './SortFilter';

interface FilterAreaProps {
  selectedCategory?: ReviewType | 'all';
  selectedSort?: SortOption;
  onCategoryClick?: (category: ReviewType | 'all') => void;
  onSortClick?: (sort: SortOption) => void;
}

export function FilterArea({
  selectedCategory = 'all',
  selectedSort = 'latest',
  onCategoryClick,
  onSortClick,
}: FilterAreaProps) {
  const handleCategoryClick = (category: ReviewType | 'all') => {
    if (onCategoryClick) {
      onCategoryClick(category);
    }
  };

  const handleSortClick = (sort: SortOption) => {
    if (onSortClick) {
      onSortClick(sort);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 py-1 sm:flex-row sm:justify-between">
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryClick={handleCategoryClick}
      />
      <SortFilter selectedSort={selectedSort} onSortClick={handleSortClick} />
    </div>
  );
}
