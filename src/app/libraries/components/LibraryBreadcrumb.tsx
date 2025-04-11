import {
  libraryCategoryFilterAtom,
  librarySearchQueryAtom,
} from '@/atoms/library';
import { useQueryParams } from '@/hooks';
import { useAtom } from 'jotai';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function LibraryBreadcrumb() {
  const { clearQueryParams, updateQueryParams } = useQueryParams();
  const [selectedCategory, setSelectedCategory] = useAtom(
    libraryCategoryFilterAtom
  );
  const [searchQuery, setSearchQuery] = useAtom(librarySearchQueryAtom);

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    clearQueryParams();
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    updateQueryParams({
      category: categoryId,
    });
  };

  return (
    <div className="flex items-center text-[14px] text-gray-500">
      <Link
        href="/libraries"
        onClick={e => {
          e.preventDefault();
          handleClearFilters();
        }}
        className={
          selectedCategory === 'all' && !searchQuery
            ? 'font-medium text-gray-900'
            : 'hover:text-gray-900'
        }
      >
        서재
      </Link>
      {selectedCategory !== 'all' && (
        <>
          <ChevronRight className="mx-1 h-4 w-4" />
          <span className="font-medium text-gray-900">{selectedCategory}</span>
        </>
      )}
      {searchQuery && (
        <>
          <ChevronRight className="mx-1 h-4 w-4" />
          <span className="font-medium text-gray-900">검색: {searchQuery}</span>
        </>
      )}
    </div>
  );
}
