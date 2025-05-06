import {
  Book,
  PopularBooksSortOptions,
  TimeRangeOptions,
} from '@/apis/book/types';
import { sortOptionAtom, timeRangeAtom } from '@/atoms/popular';
import { BookCard } from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useDialogQuery, useQueryParams } from '@/hooks';
import { useAtom } from 'jotai';
import InfiniteScroll from 'react-infinite-scroll-component';
import { usePopularBooksQuery } from '../hooks';

export function BooksContent() {
  const { updateQueryParams } = useQueryParams();
  const [, setSortOption] = useAtom(sortOptionAtom);
  const [, setTimeRange] = useAtom(timeRangeAtom);
  const { open: openBookDialog } = useDialogQuery({ type: 'book' });

  // Get books with infinite query
  const { books, hasNextPage, fetchNextPage, isLoading } =
    usePopularBooksQuery();

  const handleBookSelect = (book: Book) => {
    // isbn13이 있으면 우선 사용하고, 없으면 isbn 사용
    const bookIsbn = book.isbn13 || book.isbn;
    openBookDialog(bookIsbn);
  };

  const handleClearFilters = () => {
    // 카테고리 필터는 유지하면서 정렬과 시간 필터만 초기화
    setSortOption(PopularBooksSortOptions.RATING_DESC);
    setTimeRange(TimeRangeOptions.ALL);

    updateQueryParams({
      sort: PopularBooksSortOptions.RATING_DESC,
      timeRange: TimeRangeOptions.ALL,
    });
  };

  return (
    <>
      {isLoading ? (
        <div className="flex h-[calc(100vh-200px)] w-full items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : books && books.length > 0 ? (
        <InfiniteScroll
          dataLength={books.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={
            <div className="my-8 flex justify-center">
              <LoadingSpinner size="md" />
            </div>
          }
          endMessage={null}
          scrollThreshold={0.8}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {books.map(book => (
              <BookCard key={book.id} book={book} onClick={handleBookSelect} />
            ))}
          </div>
        </InfiniteScroll>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg bg-gray-50 py-12 text-center">
          <div className="text-3xl">📚</div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            검색 결과가 없습니다
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            다른 카테고리를 선택하거나 필터를 초기화해보세요.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={handleClearFilters}
          >
            필터 초기화
          </Button>
        </div>
      )}
    </>
  );
}
