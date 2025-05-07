import { useDiscoverCategories } from '@/app/discover/hooks';
import {
  discoverCategoryFilterAtom,
  discoverSubcategoryFilterAtom,
} from '@/atoms/discover';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useQueryParams } from '@/hooks';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface CategoryFilterProps {
  className?: string;
}

// 기본 파스텔톤 색상 배열 - 카테고리에 color가 설정되지 않은 경우 이 배열에서 순차적으로 사용
const pastelColors = [
  '#DBEAFE', // 파스텔 블루
  '#FCE7F3', // 파스텔 핑크
  '#FFEDD5', // 파스텔 오렌지
  '#ECFCCB', // 파스텔 그린
  '#D1FAE5', // 파스텔 민트
  '#FEF3C7', // 파스텔 옐로우
  '#E0E7FF', // 파스텔 인디고
  '#FBCFE8', // 파스텔 로즈
  '#F5F3FF', // 파스텔 퍼플
  '#FEE2E2', // 파스텔 레드
];

// 한 번에 표시할 카테고리 수
const VISIBLE_CATEGORIES = 10;

// CategoryFilterSkeleton 컴포넌트
export function CategoryFilterSkeleton() {
  return (
    <div className="w-full">
      <div className="no-scrollbar mb-2 flex w-full overflow-x-auto py-1">
        <div className="flex gap-2 px-0.5">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-full" />
          ))}
        </div>
      </div>

      {/* 서브카테고리 스켈레톤 */}
      <div className="no-scrollbar mb-4 flex w-full overflow-x-auto py-1">
        <div className="flex gap-2 px-0.5">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-16 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export const CategoryFilter = ({ className }: CategoryFilterProps) => {
  const isMobile = useIsMobile();
  const { updateQueryParams } = useQueryParams();
  const [selectedCategory, setSelectedCategory] = useAtom(
    discoverCategoryFilterAtom
  );
  const [selectedSubcategory, setSelectedSubcategory] = useAtom(
    discoverSubcategoryFilterAtom
  );

  // 모든 카테고리를 표시할지 여부 상태 추가
  const [showAllCategories, setShowAllCategories] = useState(false);

  // 카테고리 정보 가져오기
  const { categories } = useDiscoverCategories();

  // 현재 선택된 카테고리의 서브카테고리 가져오기
  const selectedCategoryObj = categories.find(
    category => category.id.toString() === selectedCategory
  );

  const subcategories = selectedCategoryObj?.subCategories || [];

  const DEFAULT_CATEGORY = 'all';
  const DEFAULT_SUBCATEGORY = 'all';

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

  // 카테고리별 색상 가져오기 (인덱스에 따라 다른 파스텔톤 적용)
  const getCategoryColor = (index: number): string => {
    return pastelColors[index % pastelColors.length];
  };

  // 표시할 카테고리 결정
  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, VISIBLE_CATEGORIES);

  // 카테고리가 10개 초과인지 확인
  const hasMoreCategories = categories.length > VISIBLE_CATEGORIES;

  return (
    <div className={className}>
      {/* 카테고리 목록 */}
      <div
        className={`no-scrollbar flex w-full overflow-x-auto ${
          isMobile ? 'mb-1 py-1' : 'mb-2 py-1'
        }`}
      >
        <div className="flex flex-wrap gap-2 px-0.5">
          <button
            key="all"
            onClick={() => handleCategoryClick('all')}
            className={cn(
              'flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-full px-4 text-sm font-medium transition-all',
              selectedCategory === 'all'
                ? 'bg-gray-900 text-white'
                : 'hover:bg-gray-50'
            )}
            style={{
              backgroundColor:
                selectedCategory === 'all' ? undefined : '#DBEAFE', // 파스텔 블루 색상 사용
            }}
          >
            전체
          </button>
          {visibleCategories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id.toString())}
              className={cn(
                'flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-full px-4 text-sm font-medium transition-all',
                category.id.toString() === selectedCategory
                  ? 'bg-gray-900 text-white'
                  : 'hover:bg-gray-50'
              )}
              style={{
                backgroundColor:
                  category.id.toString() === selectedCategory
                    ? undefined
                    : getCategoryColor(index),
              }}
            >
              {category.name}
            </button>
          ))}

          {/* 더보기 버튼 */}
          {hasMoreCategories && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAllCategories(!showAllCategories)}
              className={cn(
                'h-9 w-9 shrink-0 rounded-full border border-gray-200 bg-white hover:bg-gray-50',
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

      {/* 선택한 카테고리의 서브카테고리 목록 */}
      {subcategories.length > 0 && (
        <div
          className={`no-scrollbar flex w-full overflow-x-auto ${
            isMobile ? 'mb-0.5 py-0' : 'mb-1 py-0'
          }`}
        >
          <div className="flex gap-2 px-0.5">
            <button
              onClick={() => handleSubcategoryClick('all')}
              className={cn(
                'flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-full border px-3 text-sm font-medium transition-colors',
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
                onClick={() =>
                  handleSubcategoryClick(subcategory.id.toString())
                }
                className={cn(
                  'flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-full border px-3 text-sm font-medium transition-colors',
                  subcategory.id.toString() === selectedSubcategory
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
