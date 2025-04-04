import { cn } from '@/lib/utils';
import { Category } from '../types';

interface FilterBarProps {
  mainCategories: Category[];
  sortOptions: Category[];
  selectedCategory: string;
  selectedSort: string;
  onCategoryClick: (categoryId: string) => void;
  onSortClick: (sortId: string) => void;
}

export function FilterBar({
  mainCategories,
  sortOptions,
  selectedCategory,
  selectedSort,
  onCategoryClick,
  onSortClick,
}: FilterBarProps) {
  return (
    <div className="flex justify-between gap-2 overflow-x-auto py-1">
      {/* 메인 카테고리 버튼 섹션 */}
      <div className="flex gap-2">
        {mainCategories.map(category => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
            className={cn(
              'flex h-9 cursor-pointer items-center rounded-full px-4 text-[14px] font-medium transition-colors',
              selectedCategory === category.id
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:opacity-90'
            )}
            style={{
              backgroundColor:
                selectedCategory === category.id
                  ? undefined
                  : category.color || '#F9FAFB',
            }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* 정렬 옵션 버튼 섹션 */}
      <div className="flex gap-2">
        {sortOptions.map(option => (
          <button
            key={option.id}
            onClick={() => onSortClick(option.id)}
            className={cn(
              'flex h-9 cursor-pointer items-center rounded-full px-4 text-[14px] font-medium transition-colors',
              selectedSort === option.id
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:opacity-90'
            )}
            style={{
              backgroundColor:
                selectedSort === option.id
                  ? undefined
                  : option.color || '#F9FAFB',
            }}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
}
