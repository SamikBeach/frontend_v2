import { cn } from '@/lib/utils';
import { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  selectedSubcategory: string;
  onCategoryClick: (categoryId: string) => void;
  onSubcategoryClick: (subcategoryId: string) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  selectedSubcategory,
  onCategoryClick,
  onSubcategoryClick,
}: CategoryFilterProps) {
  // 선택된 카테고리 정보
  const currentCategory = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="flex-1 overflow-x-auto">
      <div className="mb-3 flex gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
            className={cn(
              'flex h-9 cursor-pointer items-center rounded-full px-4 text-[14px] font-medium transition-colors',
              selectedCategory === category.id
                ? 'text-gray-900 ring-1 ring-gray-900/5'
                : 'text-gray-700 hover:bg-gray-50'
            )}
            style={{
              backgroundColor: category.color || '#F9FAFB',
              boxShadow:
                selectedCategory === category.id
                  ? '0 1px 2px rgba(0,0,0,0.04)'
                  : 'none',
            }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* 선택된 카테고리의 서브카테고리 표시 */}
      {currentCategory?.subcategories &&
        currentCategory.subcategories.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {currentCategory.subcategories.map(subcategory => (
              <button
                key={subcategory.id}
                onClick={() => onSubcategoryClick(subcategory.id)}
                className={cn(
                  'flex h-8 cursor-pointer items-center rounded-full border px-3 text-[13px] font-medium transition-colors',
                  selectedSubcategory === subcategory.id
                    ? 'border-gray-200 bg-gray-100 text-gray-900'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                )}
              >
                {subcategory.name}
              </button>
            ))}
          </div>
        )}
    </div>
  );
}
