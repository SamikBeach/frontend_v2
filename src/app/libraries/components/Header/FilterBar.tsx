'use client';

import { LibraryTagResponseDto } from '@/apis/library/types';
import { libraryTagFilterAtom } from '@/atoms/library';
import { Skeleton } from '@/components/ui/skeleton';
import { Tag, createDefaultTag, getTagColor } from '@/utils/tags';
import { useAtom } from 'jotai';
import { Suspense } from 'react';
import { useAllLibraryTags } from '../../hooks/useAllLibraryTags';
import { TagButton } from './TagButton';

// 스켈레톤 로더 컴포넌트
function FilterBarSkeleton() {
  return (
    <div className="no-scrollbar flex gap-1.5 overflow-x-auto pt-0.5 pb-0.5 md:gap-2 md:pt-1 md:pb-1">
      <div className="flex gap-1.5 md:gap-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-16 rounded-full md:h-9 md:w-20" />
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
  };

  return (
    <div className="no-scrollbar w-full overflow-x-auto pt-0.5 pb-1 md:pt-1 md:pb-1">
      <div className="flex gap-2 pl-2 after:block after:w-1 after:flex-shrink-0 after:content-[''] md:gap-2 md:pl-0 md:after:content-none">
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
