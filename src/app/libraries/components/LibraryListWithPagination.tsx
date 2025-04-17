import { Library } from '@/apis/library/types';
import { LibraryCard, LibraryCardSkeleton } from '@/components/LibraryCard';
import { Loader2 } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { EmptyState } from './EmptyState';

interface LibraryListProps {
  libraries: Library[];
  searchQuery: string;
  categoryFilter: string;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export function LibraryList({
  libraries,
  searchQuery,
  categoryFilter,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: LibraryListProps) {
  if (libraries.length === 0) {
    return (
      <EmptyState searchQuery={searchQuery} selectedCategory={categoryFilter} />
    );
  }

  return (
    <InfiniteScroll
      dataLength={libraries.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={
        <div className="mt-8 flex w-full justify-center py-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
      endMessage={null}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {libraries.map(library => (
          <LibraryCard key={library.id} library={library} />
        ))}
      </div>
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
