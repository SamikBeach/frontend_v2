import { Library } from '@/apis/library/types';
import { LibraryCard } from '@/components/LibraryCard';
import { createDefaultTag, getTagColor, Tag } from '@/utils/tags';
import { Suspense } from 'react';
import { useAllLibraryTags } from '../../hooks/useAllLibraryTags';
import { LibraryListSkeleton } from './LibraryListSkeleton';

export interface LibraryListWithTagsProps {
  libraries: Library[];
  tagFilter: string;
}

export function LibraryListWithTags({ libraries }: LibraryListWithTagsProps) {
  const { tags: allTags } = useAllLibraryTags(50);

  // 태그 목록 생성
  const tags: Tag[] = [
    // "전체" 태그
    createDefaultTag(),
    // 모든 라이브러리 태그 기반으로 변환
    ...(allTags || []).map((tag, index) => ({
      id: String(tag.id),
      name: tag.tagName,
      color: getTagColor(index),
    })),
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {libraries.map(library => (
        <LibraryCard key={library.id} library={library} tags={tags} />
      ))}
    </div>
  );
}

export function LibraryListWithTagsWrapper(props: LibraryListWithTagsProps) {
  return (
    <Suspense fallback={<LibraryListSkeleton />}>
      <LibraryListWithTags {...props} />
    </Suspense>
  );
}
