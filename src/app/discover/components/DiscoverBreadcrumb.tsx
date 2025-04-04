'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { Category } from '@/app/popular/components/CategoryFilter';

interface DiscoverBreadcrumbProps {
  selectedCategory: string;
  selectedSubcategory: string;
  categories: Category[];
  onCategoryClick: (categoryId: string) => void;
  onClearFilters: () => void;
}

export function DiscoverBreadcrumb({
  selectedCategory,
  selectedSubcategory,
  categories,
  onCategoryClick,
  onClearFilters,
}: DiscoverBreadcrumbProps) {
  // 선택된 카테고리 정보
  const currentCategory = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="flex items-center text-[14px] text-gray-500">
      <Link
        href="/discover"
        onClick={e => {
          e.preventDefault();
          onClearFilters();
        }}
        className={
          selectedCategory === 'all'
            ? 'font-medium text-gray-900'
            : 'hover:text-gray-900'
        }
      >
        고전산책
      </Link>
      {selectedCategory !== 'all' && (
        <>
          <ChevronRight className="mx-1 h-4 w-4" />
          <Link
            href={`/discover?category=${selectedCategory}`}
            onClick={e => {
              e.preventDefault();
              onCategoryClick(selectedCategory);
            }}
            className={
              !selectedSubcategory
                ? 'font-medium text-gray-900'
                : 'hover:text-gray-900'
            }
          >
            {currentCategory?.name}
          </Link>
        </>
      )}
      {selectedSubcategory && (
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
