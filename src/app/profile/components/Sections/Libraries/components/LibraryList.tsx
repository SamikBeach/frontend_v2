import { LibraryPreviewDto } from '@/apis/user/types';
import { LibraryCard } from '@/components/LibraryCard';
import { Tag } from '@/utils/tags';
import InfiniteScroll from 'react-infinite-scroll-component';

interface LibraryListProps {
  libraries: LibraryPreviewDto[];
  tags: Tag[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
}

export function LibraryList({
  libraries,
  tags,
  fetchNextPage,
  hasNextPage,
}: LibraryListProps) {
  return (
    <InfiniteScroll
      dataLength={libraries.length}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={
        <div className="mt-6 flex justify-center py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
        </div>
      }
      scrollThreshold={0.9}
      className="flex w-full flex-col pb-4"
      style={{ overflow: 'visible' }} // 스크롤바 숨기기
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {libraries.map(library => (
          <LibraryCard key={library.id} library={library} tags={tags} />
        ))}
      </div>
    </InfiniteScroll>
  );
}
