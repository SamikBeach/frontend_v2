import { categoryFilterAtom, subcategoryFilterAtom } from '@/atoms/popular';
import { Button } from '@/components/ui/button';
import { useCategories, useQueryParams } from '@/hooks';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface CategoryFilterProps {
  className?: string;
}

// 한 번에 표시할 카테고리 수
const VISIBLE_CATEGORIES = 10;

export const CategoryFilter = ({ className }: CategoryFilterProps) => {
  const { updateQueryParams } = useQueryParams();
  const [selectedCategory, setSelectedCategory] = useAtom(categoryFilterAtom);
  const [selectedSubcategory, setSelectedSubcategory] = useAtom(
    subcategoryFilterAtom
  );
  const categories = useCategories();

  // 모든 카테고리를 표시할지 여부 상태 추가
  const [showAllCategories, setShowAllCategories] = useState(false);

  const DEFAULT_CATEGORY = 'all';
  const DEFAULT_SUBCATEGORY = 'all';

  // 현재 선택된 카테고리의 서브카테고리 가져오기
  const selectedCategoryObj = categories.find(
    category => category.id === selectedCategory
  );

  const subcategories = selectedCategoryObj?.subcategories || [];

  // 표시할 카테고리 결정
  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, VISIBLE_CATEGORIES);

  // 카테고리가 10개 초과인지 확인
  const hasMoreCategories = categories.length > VISIBLE_CATEGORIES;

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory('all'); // 카테고리 변경 시 서브카테고리 'all'로 초기화

    // URL 쿼리 파라미터 업데이트 - 기본값이 아닌 경우에만
    if (categoryId !== DEFAULT_CATEGORY) {
      updateQueryParams({
        category: categoryId,
        subcategory: undefined, // 서브카테고리는 기본값이므로 제거
      });
    } else {
      // 카테고리가 기본값이면 URL에서 제거
      updateQueryParams({
        category: undefined,
        subcategory: undefined,
      });
    }
  };

  const handleSubcategoryClick = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);

    // URL 쿼리 파라미터 업데이트 - 기본값이 아닌 경우에만
    if (subcategoryId !== DEFAULT_SUBCATEGORY) {
      updateQueryParams({
        subcategory: subcategoryId,
      });
    } else {
      // 기본값인 경우 URL에서 제거
      updateQueryParams({
        subcategory: undefined,
      });
    }
  };

  return (
    <div className={className}>
      {/* 카테고리 목록 */}
      <div className="no-scrollbar w-full overflow-x-auto pt-0.5 pb-1 md:pt-1 md:pb-1">
        {/* 모바일에서는 항상 모든 카테고리 표시, 데스크탑에서는 visibleCategories 기반으로 표시 */}
        <div className="flex gap-1.5 md:flex-wrap md:gap-2">
          {/* 모바일에서는 모든 카테고리 표시 */}
          <div className="flex gap-2 px-2 md:hidden">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={cn(
                  'flex shrink-0 cursor-pointer items-center justify-center rounded-full px-3 text-xs font-medium transition-all md:px-3 md:text-sm',
                  'h-8 md:h-8',
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

          {/* 데스크탑에서는 visibleCategories 기반으로 표시 */}
          <div className="hidden gap-2 md:flex md:flex-wrap">
            {visibleCategories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={cn(
                  'flex shrink-0 cursor-pointer items-center justify-center rounded-full px-4 text-sm font-medium transition-all',
                  'h-9',
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

            {/* 더보기 버튼 - 데스크탑에서만 표시 */}
            {hasMoreCategories && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAllCategories(!showAllCategories)}
                className={cn(
                  'h-9 w-9 shrink-0 cursor-pointer rounded-full border border-gray-200 bg-white hover:bg-gray-50',
                  showAllCategories && 'bg-gray-50'
                )}
                aria-label={
                  showAllCategories ? '카테고리 접기' : '카테고리 더보기'
                }
                title={showAllCategories ? '카테고리 접기' : '카테고리 더보기'}
              >
                {showAllCategories ? (
                  <ChevronUp className="h-4 w-4 text-gray-700" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-700" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 선택한 카테고리의 서브카테고리 목록 */}
      {subcategories.length > 0 && (
        <div className="no-scrollbar w-full overflow-x-auto py-1 md:py-1">
          <div className="flex gap-2 px-2 md:gap-2">
            <button
              onClick={() => handleSubcategoryClick('all')}
              className={cn(
                'flex shrink-0 cursor-pointer items-center justify-center rounded-full border px-2.5 text-xs font-medium transition-colors md:px-3 md:text-sm',
                'h-7 md:h-8',
                selectedSubcategory === 'all'
                  ? 'border-blue-200 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              )}
            >
              전체
            </button>
            {subcategories.map(subcategory => (
              <button
                key={subcategory.id}
                onClick={() => handleSubcategoryClick(subcategory.id)}
                className={cn(
                  'flex shrink-0 cursor-pointer items-center justify-center rounded-full border px-2.5 text-xs font-medium transition-colors md:px-3 md:text-sm',
                  'h-7 md:h-8',
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
