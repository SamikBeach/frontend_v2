import {
  Book,
  PopularBooksSortOptions,
  TimeRangeOptions,
} from '@/apis/book/types';
import { sortOptionAtom, timeRangeAtom } from '@/atoms/popular';
import { BookCard } from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useQueryParams } from '@/hooks';
import { useIsMobile } from '@/hooks/use-mobile';
import { useBookDetailOpen } from '@/hooks/useBookDetailOpen';
import { useAtom } from 'jotai';
import InfiniteScroll from 'react-infinite-scroll-component';
import { usePopularBooksQuery } from '../hooks';

export function BooksContent() {
  const isMobile = useIsMobile();
  const { updateQueryParams } = useQueryParams();
  const [, setSortOption] = useAtom(sortOptionAtom);
  const [, setTimeRange] = useAtom(timeRangeAtom);
  const openBookDetail = useBookDetailOpen();

  // Get books with infinite query
  const { books, hasNextPage, fetchNextPage, isFetchingNextPage } =
    usePopularBooksQuery();

  const handleBookSelect = (book: Book) => {
    // isbn13이 있으면 우선 사용하고, 없으면 isbn 사용
    const bookIsbn = book.isbn13 || book.isbn;
    openBookDetail(bookIsbn);
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
      {books && books.length > 0 ? (
        <InfiniteScroll
          dataLength={books.length}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={
            <div className="my-8 flex justify-center">
              <LoadingSpinner size="md" />
            </div>
          }
          scrollThreshold={0.9}
          className="flex w-full flex-col pb-4"
          style={{ overflow: 'visible' }} // 스크롤바 숨기기
        >
          {isMobile ? (
            <div className="flex flex-col gap-4 px-0.5 py-1">
              {books.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={handleBookSelect}
                  horizontal={true}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {books.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={handleBookSelect}
                />
              ))}
            </div>
          )}
        </InfiniteScroll>
      ) : (
        <div className="flex h-[calc(100vh-200px)] w-full flex-col items-center justify-center space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">
              검색 결과가 없습니다
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              다른 조건으로 검색해보세요
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="mt-4"
          >
            필터 초기화
          </Button>
        </div>
      )}
    </>
  );
}
