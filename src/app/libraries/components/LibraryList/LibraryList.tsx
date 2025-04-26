import { Library } from '@/apis/library/types';
import { Button } from '@/components/ui/button';
import { ArrowDown, CheckCircle2, Loader2 } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { EmptyState } from './EmptyState';
import { LibraryListWithTagsWrapper } from './LibraryListWithTags';

export interface LibraryListProps {
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
      <LibraryListWithTagsWrapper libraries={libraries} tagFilter={tagFilter} />

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
