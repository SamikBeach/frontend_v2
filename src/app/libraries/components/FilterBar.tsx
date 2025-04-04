import { FilterBarProps } from '../types';
import { CategoryButton } from './CategoryButton';

export function FilterBar({
  categories,
  selectedCategory,
  onCategoryClick,
}: FilterBarProps) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto py-1">
      {/* 메인 카테고리 버튼 섹션 */}
      <div className="flex gap-2">
        {categories.map(category => (
          <CategoryButton
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.id}
            onClick={onCategoryClick}
          />
        ))}
      </div>
    </div>
  );
}
