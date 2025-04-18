import { Library } from '@/apis/library/types';
import { LibraryCard, LibraryCardSkeleton } from '@/components/LibraryCard';
import { Button } from '@/components/ui/button';
import { createDefaultTag, getTagColor, Tag } from '@/utils/tags';
import { ArrowDown, CheckCircle2, Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAllLibraryTags } from '../hooks/useAllLibraryTags';
import { EmptyState } from './EmptyState';

// 라이브러리 카드에 전달할 태그 정보를 생성하는 컴포넌트
function LibraryListWithTags({ libraries, ...props }: LibraryListProps) {
  const { tags: allTags } = useAllLibraryTags(50);

  // 태그 목록 생성
  const tags: Tag[] = [
    // "전체" 태그
    createDefaultTag(),
    // 모든 라이브러리 태그 기반으로 변환
    ...(allTags || []).map((tag, index) => ({
      id: String(tag.tagId || tag.id),
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

interface LibraryListProps {
  libraries: Library[];
  searchQuery: string;
  tagFilter: string;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export function LibraryList({
  libraries,
  searchQuery,
  tagFilter,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: LibraryListProps) {
  if (libraries.length === 0) {
    return <EmptyState searchQuery={searchQuery} selectedTag={tagFilter} />;
  }

  return (
    <InfiniteScroll
      dataLength={libraries.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={
        <div className="mt-8 flex w-full justify-center py-4">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
            <span className="text-sm text-gray-500">서재를 불러오는 중...</span>
          </div>
        </div>
      }
      endMessage={
        libraries.length > 6 && (
          <div className="mt-8 flex w-full flex-col items-center justify-center py-6">
            <CheckCircle2 className="h-8 w-8 text-gray-400" />
            <p className="mt-2 text-center text-sm text-gray-500">
              더 이상 표시할 서재가 없습니다
            </p>
          </div>
        )
      }
      scrollThreshold={0.8}
    >
      <Suspense fallback={<LibraryListSkeleton />}>
        <LibraryListWithTags
          libraries={libraries}
          searchQuery={searchQuery}
          tagFilter={tagFilter}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </Suspense>

      {hasNextPage && !isFetchingNextPage && (
        <div className="mt-8 flex w-full justify-center">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => fetchNextPage()}
          >
            <ArrowDown className="h-4 w-4" />
            <span>더 불러오기</span>
          </Button>
        </div>
      )}
    </InfiniteScroll>
  );
}

// 로딩 스켈레톤
export function LibraryListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <LibraryCardSkeleton key={index} />
      ))}
    </div>
  );
}
