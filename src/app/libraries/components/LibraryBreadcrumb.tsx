import { usePopularTags } from '@/app/libraries/hooks/usePopularTags';
import {
  libraryCategoryFilterAtom,
  librarySearchQueryAtom,
} from '@/atoms/library';
import { useQueryParams } from '@/hooks';
import { useAtom } from 'jotai';
import { ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

// 실제 브레드크럼 컨텐츠 컴포넌트
function LibraryBreadcrumbContent() {
  const { clearQueryParams, updateQueryParams } = useQueryParams();
  const [selectedCategory, setSelectedCategory] = useAtom(
    libraryCategoryFilterAtom
  );
  const [searchQuery, setSearchQuery] = useAtom(librarySearchQueryAtom);
  const { tags: popularTags } = usePopularTags(10);

  // 카테고리 이름 가져오기
  const getCategoryName = (categoryId: string) => {
    if (categoryId === 'all') return '전체';

    const tag = popularTags.find(tag => String(tag.id) === categoryId);
    return tag ? tag.name : categoryId;
  };

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
          <span className="font-medium text-gray-900">
            {getCategoryName(selectedCategory)}
          </span>
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

// 로딩 중 표시 컴포넌트
function BreadcrumbSkeleton() {
  return (
    <div className="flex items-center text-[14px] text-gray-500">
      <span className="font-medium text-gray-900">서재</span>
      <ChevronRight className="mx-1 h-4 w-4" />
      <div className="flex items-center">
        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
        <span>로딩 중...</span>
      </div>
    </div>
  );
}

// 외부로 노출되는 컴포넌트
export function LibraryBreadcrumb() {
  return (
    <Suspense fallback={<BreadcrumbSkeleton />}>
      <LibraryBreadcrumbContent />
    </Suspense>
  );
}
