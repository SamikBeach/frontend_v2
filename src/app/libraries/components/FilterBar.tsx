'use client';

import { LibraryTagResponseDto } from '@/apis/library/types';
import { libraryTagFilterAtom } from '@/atoms/library';
import { Skeleton } from '@/components/ui/skeleton';
import { useAtom } from 'jotai';
import { Suspense } from 'react';
import { useAllLibraryTags } from '../hooks/useAllLibraryTags';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

// 태그 색상 배열 - 파스텔톤
const TAG_COLORS = [
  '#FFF8E2', // 파스텔 옐로우
  '#F2E2FF', // 파스텔 퍼플
  '#FFE2EC', // 파스텔 코럴
  '#E2FFFC', // 파스텔 민트
  '#E2F0FF', // 파스텔 블루
  '#FFECDA', // 파스텔 오렌지
  '#ECFFE2', // 파스텔 그린
  '#FFE2F7', // 파스텔 핑크
];

// 태그 인덱스에 따른 색상 반환
function getTagColor(index: number): string {
  return TAG_COLORS[index % TAG_COLORS.length];
}

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

  // 태그 생성
  const tags: Tag[] = [
    // "전체" 태그
    {
      id: 'all',
      name: '전체',
      color: '#E2E8F0',
    },
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
    <div className="no-scrollbar flex gap-2 overflow-x-auto py-1">
      <div className="flex gap-2 px-0.5">
        {tags.map((tag: Tag) => (
          <button
            key={tag.id}
            onClick={() => handleTagClick(tag.id)}
            className={`flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 text-sm font-medium transition-all ${
              tagFilter === tag.id
                ? 'bg-gray-900 text-white'
                : 'hover:bg-gray-50'
            }`}
            style={{
              backgroundColor: tagFilter === tag.id ? undefined : tag.color,
            }}
          >
            {tag.name}
          </button>
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
