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
    <div className="no-scrollbar flex w-full flex-col gap-2 py-0.5 md:flex-row md:items-center md:justify-between md:gap-4 md:py-1">
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryClick={handleCategoryClick}
        className="w-full max-w-[100vw] overflow-x-auto"
      />
      <SortFilter
        selectedSort={selectedSort}
        onSortClick={handleSortClick}
        className="md:ml-0"
      />
    </div>
  );
}
