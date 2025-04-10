import { categoryFilterAtom, subcategoryFilterAtom } from '@/atoms/popular';
import { useCategories, useQueryParams } from '@/hooks';
import { useAtom } from 'jotai';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function PopularBreadcrumb() {
  const { clearQueryParams, updateQueryParams } = useQueryParams();
  const [selectedCategory, setSelectedCategory] = useAtom(categoryFilterAtom);
  const [selectedSubcategory, setSelectedSubcategory] = useAtom(
    subcategoryFilterAtom
  );
  const categories = useCategories();

  // 선택된 카테고리 정보
  const currentCategory = categories.find(cat => cat.id === selectedCategory);

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
    <div className="flex items-center text-[14px] text-gray-500">
      <Link
        href="/popular"
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
        분야별 인기
      </Link>
      {selectedCategory !== 'all' && (
        <>
          <ChevronRight className="mx-1 h-4 w-4" />
          <Link
            href={`/popular?category=${selectedCategory}`}
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
          <ChevronRight className="mx-1 h-4 w-4" />
          <span className="font-medium text-gray-900">
            {
              currentCategory?.subcategories.find(
                sub => sub.id === selectedSubcategory
              )?.name
            }
          </span>
        </>
      )}
    </div>
  );
}
