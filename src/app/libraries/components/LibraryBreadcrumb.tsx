import { LibraryTagResponseDto } from '@/apis/library/types';
import { usePopularLibraryTags } from '@/app/libraries/hooks/usePopularTags';
import { librarySearchQueryAtom, libraryTagFilterAtom } from '@/atoms/library';
import { useQueryParams } from '@/hooks';
import { useAtom } from 'jotai';
import { ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

// 실제 브레드크럼 컨텐츠 컴포넌트
function LibraryBreadcrumbContent() {
  const { clearQueryParams, updateQueryParams } = useQueryParams();
  const [selectedTag, setSelectedTag] = useAtom(libraryTagFilterAtom);
  const [searchQuery, setSearchQuery] = useAtom(librarySearchQueryAtom);
  const { tags: popularTags } = usePopularLibraryTags(10);

  // 태그 이름 가져오기
  const getTagName = (tagId: string) => {
    if (tagId === 'all') return '전체';

    const tag = popularTags.find(
      (tag: LibraryTagResponseDto) => String(tag.id) === tagId
    );
    return tag ? tag.tagName : tagId;
  };

  const handleClearFilters = () => {
    setSelectedTag('all');
    setSearchQuery('');
    clearQueryParams();
  };

  const handleTagClick = (tagId: string) => {
    setSelectedTag(tagId);
    updateQueryParams({
      tag: tagId,
    });
  };

  return (
    <div className="flex items-center gap-1 text-sm text-gray-500">
      <Link
        href="/libraries"
        className="text-gray-600 hover:text-gray-900"
        onClick={handleClearFilters}
      >
        서재
      </Link>

      {selectedTag !== 'all' && (
        <>
          <ChevronRight className="h-4 w-4" />
          <button
            onClick={() => handleTagClick(selectedTag)}
            className="text-gray-900"
          >
            {getTagName(selectedTag)}
          </button>
        </>
      )}

      {searchQuery && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900">검색: {searchQuery}</span>
        </>
      )}
    </div>
  );
}

// 로딩 상태를 보여주는 스켈레톤 컴포넌트
function LibraryBreadcrumbSkeleton() {
  return (
    <div className="flex items-center gap-1 text-sm">
      <span>서재</span>
      <ChevronRight className="h-4 w-4" />
      <div className="flex items-center gap-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>로딩 중...</span>
      </div>
    </div>
  );
}

export function LibraryBreadcrumb() {
  return (
    <Suspense fallback={<LibraryBreadcrumbSkeleton />}>
      <LibraryBreadcrumbContent />
    </Suspense>
  );
}
