import { useIsMobile } from '@/hooks/use-mobile';
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
  className?: string;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  selectedSubcategory,
  onCategoryClick,
  onSubcategoryClick,
  className,
}: CategoryFilterProps) {
  // 선택된 카테고리 정보
  const currentCategory = categories.find(cat => cat.id === selectedCategory);
  const isMobile = useIsMobile();

  return (
    <div className={className}>
      {/* 메인 카테고리 (가로 스크롤) */}
      <div
        className={`no-scrollbar flex w-full overflow-x-auto ${isMobile ? 'mb-2 py-1' : 'mb-3 py-1'}`}
      >
        <div className="flex gap-2 px-0.5">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => onCategoryClick(category.id)}
              className={cn(
                'flex shrink-0 cursor-pointer items-center rounded-full px-4 text-[14px] font-medium transition-all',
                'h-9', // 터치 영역 확보를 위해 높이 통일
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
                  selectedCategory === category.id
                    ? 'white'
                    : 'rgb(23, 23, 23)',
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* 서브카테고리 (가로 스크롤) */}
      {currentCategory?.subcategories &&
        currentCategory.subcategories.length > 0 && (
          <div
            className={`no-scrollbar flex w-full overflow-x-auto ${isMobile ? 'mb-2 py-1' : 'mb-4 py-1'}`}
          >
            <div className="flex gap-2 px-0.5">
              {currentCategory.subcategories.map(subcategory => (
                <button
                  key={subcategory.id}
                  onClick={() => onSubcategoryClick(subcategory.id)}
                  className={cn(
                    'flex shrink-0 cursor-pointer items-center rounded-full border border-gray-200 px-3 text-[13px] font-medium transition-all',
                    'h-8', // 터치 영역 확보를 위해 높이 통일
                    selectedSubcategory === subcategory.id
                      ? 'border-blue-200 bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
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
}
