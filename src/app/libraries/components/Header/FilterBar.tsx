'use client';

import { LibraryTagResponseDto } from '@/apis/library/types';
import { libraryTagFilterAtom } from '@/atoms/library';
import { Skeleton } from '@/components/ui/skeleton';
import { useQueryParams } from '@/hooks';
import { Tag, createDefaultTag, getTagColor } from '@/utils/tags';
import { useAtom } from 'jotai';
import { Suspense } from 'react';
import { useAllLibraryTags } from '../../hooks/useAllLibraryTags';
import { TagButton } from './TagButton';

// 기본값 상수 정의
const DEFAULT_TAG_FILTER = 'all';

// 스켈레톤 로더 컴포넌트
function FilterBarSkeleton() {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto py-1">
      <div className="flex gap-2 px-0.5">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-9 w-20 rounded-full" />
        ))}
      </div>
    </div>
  );
}

// 실제 필터바 내용 컴포넌트
function FilterBarContent({
  tagFilter,
  setTagFilter,
}: {
  tagFilter: string;
  setTagFilter: (id: string) => void;
}) {
  const { tags: allTags } = useAllLibraryTags(20);
  const { updateQueryParams } = useQueryParams();

  // 태그 생성
  const tags: Tag[] = [
    // "전체" 태그
    createDefaultTag(),
    // 모든 태그 기반
    ...(allTags || []).map((tag: LibraryTagResponseDto, index: number) => ({
      id: String(tag.id),
      name: tag.tagName,
      color: getTagColor(index),
    })),
  ];

  const handleTagClick = (tagId: string) => {
    setTagFilter(tagId);

    // 기본값('all')인 경우에는 URL 쿼리 파라미터 제거
    if (tagId === DEFAULT_TAG_FILTER) {
      updateQueryParams({ tag: undefined });
    } else {
      // 기본값이 아닌 경우에는 URL 쿼리 파라미터 추가
      updateQueryParams({ tag: tagId });
    }
  };

  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto py-1">
      <div className="flex gap-2 px-0.5">
        {tags.map((tag: Tag) => (
          <TagButton
            key={tag.id}
            tag={tag}
            isSelected={tagFilter === tag.id}
            onClick={handleTagClick}
          />
        ))}
      </div>
    </div>
  );
}

export function FilterBar() {
  const [tagFilter, setTagFilter] = useAtom(libraryTagFilterAtom);

  return (
    <Suspense fallback={<FilterBarSkeleton />}>
      <FilterBarContent tagFilter={tagFilter} setTagFilter={setTagFilter} />
    </Suspense>
  );
}
