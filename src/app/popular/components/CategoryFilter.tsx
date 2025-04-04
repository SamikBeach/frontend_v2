'use client';

import { cn } from '@/lib/utils';

export interface Category {
  id: string;
  name: string;
  color: string;
  subcategories: Array<{
    id: string;
    name: string;
  }>;
}

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
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
            className={cn(
              'flex h-9 cursor-pointer items-center rounded-full px-4 text-[14px] font-medium transition-all',
              selectedCategory === category.id
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            )}
            style={{
              backgroundColor:
                selectedCategory === category.id
                  ? 'rgb(23, 23, 23)'
                  : category.color,
              color:
                selectedCategory === category.id ? 'white' : 'rgb(23, 23, 23)',
            }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* 선택된 카테고리의 서브카테고리 표시 */}
      {currentCategory?.subcategories &&
        currentCategory.subcategories.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {currentCategory.subcategories.map(subcategory => (
              <button
                key={subcategory.id}
                onClick={() => onSubcategoryClick(subcategory.id)}
                className={cn(
                  'flex h-8 cursor-pointer items-center rounded-full border border-gray-200 px-3 text-[13px] font-medium transition-all',
                  selectedSubcategory === subcategory.id
                    ? 'border-blue-200 bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
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
