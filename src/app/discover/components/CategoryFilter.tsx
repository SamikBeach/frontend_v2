import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export interface Category {
  id: string;
  name: string;
  color?: string;
  subcategories: {
    id: string;
    name: string;
  }[];
}

interface CategoryFilterProps {
  className?: string;
  categories: Category[];
  selectedCategory: string;
  selectedSubcategory: string;
  onCategoryClick: (categoryId: string) => void;
  onSubcategoryClick: (subcategoryId: string) => void;
}

export const CategoryFilter = ({
  className,
  categories,
  selectedCategory,
  selectedSubcategory,
  onCategoryClick,
  onSubcategoryClick,
}: CategoryFilterProps) => {
  const isMobile = useIsMobile();

  // 현재 선택된 카테고리의 서브카테고리 가져오기
  const selectedCategoryObj = categories.find(
    category => category.id === selectedCategory
  );

  const subcategories = selectedCategoryObj?.subcategories || [];

  return (
    <div className={className}>
      {/* 카테고리 목록 */}
      <div
        className={`no-scrollbar flex w-full overflow-x-auto ${
          isMobile ? 'mb-1 py-1' : 'mb-2 py-1'
        }`}
      >
        <div className="flex gap-2 px-0.5">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => onCategoryClick(category.id)}
              className={cn(
                'flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-full px-4 text-sm font-medium transition-all',
                category.id === selectedCategory
                  ? 'bg-gray-900 text-white'
                  : 'hover:bg-gray-50'
              )}
              style={{
                backgroundColor:
                  category.id === selectedCategory
                    ? undefined
                    : category.color || '#F9FAFB',
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* 선택한 카테고리의 서브카테고리 목록 */}
      {subcategories.length > 0 && (
        <div
          className={`no-scrollbar flex w-full overflow-x-auto ${
            isMobile ? 'mb-0.5 py-0' : 'mb-1 py-0'
          }`}
        >
          <div className="flex gap-2 px-0.5">
            <button
              onClick={() => onSubcategoryClick('all')}
              className={cn(
                'flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-full border px-3 text-sm font-medium transition-colors',
                selectedSubcategory === 'all' || !selectedSubcategory
                  ? 'border-blue-200 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              )}
            >
              전체
            </button>
            {subcategories.map(subcategory => (
              <button
                key={subcategory.id}
                onClick={() => onSubcategoryClick(subcategory.id)}
                className={cn(
                  'flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-full border px-3 text-sm font-medium transition-colors',
                  subcategory.id === selectedSubcategory
                    ? 'border-blue-200 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                )}
              >
                {subcategory.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
