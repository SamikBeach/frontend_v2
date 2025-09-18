import { useDiscoverCategories } from '@/app/discover/hooks';
import {
  discoverCategoryFilterAtom,
  discoverSubcategoryFilterAtom,
} from '@/atoms/discover';
import { useQueryParams } from '@/hooks';
import { useAtom } from 'jotai';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useMemo } from 'react';

export function DiscoverBreadcrumb() {
  const { clearQueryParams, updateQueryParams } = useQueryParams();
  const [selectedCategory, setSelectedCategory] = useAtom(
    discoverCategoryFilterAtom
  );
  const [selectedSubcategory, setSelectedSubcategory] = useAtom(
    discoverSubcategoryFilterAtom
  );

  // 카테고리 정보 가져오기 - 활성 카테고리만 표시
  const { categories } = useDiscoverCategories({ includeInactive: false });

  // 선택된 카테고리 정보
  const currentCategory = useMemo(
    () => categories?.find(cat => cat.id.toString() === selectedCategory),
    [categories, selectedCategory]
  );

  const currentSubcategory = useMemo(
    () =>
      currentCategory?.subCategories.find(
        sub => sub.id.toString() === selectedSubcategory
      ),
    [currentCategory, selectedSubcategory]
  );

  const handleClearFilters = useCallback(() => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    clearQueryParams();
  }, [setSelectedCategory, setSelectedSubcategory, clearQueryParams]);

  const handleCategoryClick = useCallback(
    (categoryId: string) => {
      setSelectedCategory(categoryId);
      setSelectedSubcategory('all');

      // URL 쿼리 파라미터 업데이트
      updateQueryParams({
        category: categoryId,
        subcategory: 'all',
      });
    },
    [setSelectedCategory, setSelectedSubcategory, updateQueryParams]
  );

  return (
    <div className="flex items-center text-[14px] text-gray-500 md:text-[14px]">
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
            {currentSubcategory?.name}
          </span>
        </>
      )}
    </div>
  );
}
