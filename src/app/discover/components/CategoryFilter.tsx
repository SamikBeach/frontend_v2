import { useDiscoverCategories } from '@/app/discover/hooks';
import {
  discoverCategoryFilterAtom,
  discoverSubcategoryFilterAtom,
} from '@/atoms/discover';
import { useQueryParams } from '@/hooks';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';

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
}

// 기본 파스텔톤 색상 배열 - 카테고리에 color가, 설정되지 않은 경우 이 배열에서 순차적으로 사용
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

export const CategoryFilter = ({ className }: CategoryFilterProps) => {
  const isMobile = useIsMobile();
  const { updateQueryParams } = useQueryParams();
  const [selectedCategory, setSelectedCategory] = useAtom(
    discoverCategoryFilterAtom
  );
  const [selectedSubcategory, setSelectedSubcategory] = useAtom(
    discoverSubcategoryFilterAtom
  );

  // 카테고리 정보 가져오기
  const { categories } = useDiscoverCategories();

  // 현재 선택된 카테고리의 서브카테고리 가져오기
  const selectedCategoryObj = categories.find(
    category => category.id.toString() === selectedCategory
  );

  const subcategories = selectedCategoryObj?.subCategories || [];

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory('all'); // 카테고리 변경 시 서브카테고리 'all'로 초기화

    // URL 쿼리 파라미터 업데이트
    updateQueryParams({
      category: categoryId,
      subcategory: 'all', // 서브카테고리 'all'로 초기화
    });
  };

  const handleSubcategoryClick = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);

    // URL 쿼리 파라미터 업데이트
    updateQueryParams({
      subcategory: subcategoryId,
    });
  };

  // 카테고리별 색상 가져오기 (인덱스에 따라 다른 파스텔톤 적용)
  const getCategoryColor = (index: number): string => {
    return pastelColors[index % pastelColors.length];
  };

  return (
    <div className={className}>
      {/* 카테고리 목록 */}
      <div
        className={`no-scrollbar flex w-full overflow-x-auto ${
          isMobile ? 'mb-1 py-1' : 'mb-2 py-1'
        }`}
      >
        <div className="flex gap-2 px-0.5">
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
          {categories.map((category, index) => (
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
