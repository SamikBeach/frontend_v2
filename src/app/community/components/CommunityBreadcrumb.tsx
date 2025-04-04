import { Button } from '@/components/ui/button';
import { ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import { Category } from '../types';

interface CommunityBreadcrumbProps {
  selectedCategory: string;
  selectedSubcategory: string;
  categories: Category[];
  onCategoryClick: (categoryId: string) => void;
  onClearFilters: () => void;
}

export function CommunityBreadcrumb({
  selectedCategory,
  selectedSubcategory,
  categories,
  onCategoryClick,
  onClearFilters,
}: CommunityBreadcrumbProps) {
  // 현재 선택된 카테고리와 서브카테고리 정보
  const currentCategory = categories.find(cat => cat.id === selectedCategory);
  const currentSubcategory = currentCategory?.subcategories.find(
    sub => sub.id === selectedSubcategory
  );

  return (
    <nav className="flex items-center text-sm">
      <ol className="flex items-center gap-1">
        <li>
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            홈
          </Link>
        </li>
        <li>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </li>
        <li>
          <Link href="/community" className="text-gray-500 hover:text-gray-700">
            커뮤니티
          </Link>
        </li>
        {selectedCategory !== 'all' && (
          <>
            <li>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </li>
            <li>
              <button
                onClick={() => onCategoryClick(currentCategory?.id || 'all')}
                className="font-medium text-gray-700 hover:text-gray-900"
              >
                {currentCategory?.name}
              </button>
            </li>
          </>
        )}
        {selectedSubcategory && (
          <>
            <li>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </li>
            <li>
              <span className="font-medium text-gray-900">
                {currentSubcategory?.name}
              </span>
            </li>
          </>
        )}
      </ol>
      {(selectedCategory !== 'all' || selectedSubcategory) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="ml-auto flex h-7 items-center gap-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="h-3.5 w-3.5" />
          <span className="text-xs">필터 초기화</span>
        </Button>
      )}
    </nav>
  );
}
