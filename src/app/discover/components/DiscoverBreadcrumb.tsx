import { useDiscoverCategories } from '@/app/discover/hooks';
import {
  discoverCategoryFilterAtom,
  discoverSubcategoryFilterAtom,
} from '@/atoms/discover';
import { useQueryParams } from '@/hooks';
import { useAtom } from 'jotai';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function DiscoverBreadcrumb() {
  const { clearQueryParams, updateQueryParams } = useQueryParams();
  const [selectedCategory, setSelectedCategory] = useAtom(
    discoverCategoryFilterAtom
  );
  const [selectedSubcategory, setSelectedSubcategory] = useAtom(
    discoverSubcategoryFilterAtom
  );

  // 카테고리 정보 가져오기
  const { categories } = useDiscoverCategories();

  // 선택된 카테고리 정보
  const currentCategory = categories?.find(
    cat => cat.id.toString() === selectedCategory
  );

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    clearQueryParams();
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory('all');

    // URL 쿼리 파라미터 업데이트
    updateQueryParams({
      category: categoryId,
      subcategory: 'all',
    });
  };

  return (
    <div className="flex items-center text-[12px] text-gray-500 md:text-[14px]">
      <Link
        href="/discover"
        onClick={e => {
          e.preventDefault();
          handleClearFilters();
        }}
        className={
          selectedCategory === 'all'
            ? 'font-medium text-gray-900'
            : 'hover:text-gray-900'
        }
      >
        발견하기
      </Link>
      {selectedCategory !== 'all' && (
        <>
          <ChevronRight className="mx-1 h-3 w-3 md:h-4 md:w-4" />
          <Link
            href={`/discover?category=${selectedCategory}`}
            onClick={e => {
              e.preventDefault();
              handleCategoryClick(selectedCategory);
            }}
            className={
              selectedSubcategory === 'all'
                ? 'font-medium text-gray-900'
                : 'hover:text-gray-900'
            }
          >
            {currentCategory?.name}
          </Link>
        </>
      )}
      {selectedSubcategory !== 'all' && (
        <>
          <ChevronRight className="mx-1 h-3 w-3 md:h-4 md:w-4" />
          <span className="font-medium text-gray-900">
            {
              currentCategory?.subCategories.find(
                sub => sub.id.toString() === selectedSubcategory
              )?.name
            }
          </span>
        </>
      )}
    </div>
  );
}
