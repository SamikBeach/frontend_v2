import { Book } from '@/apis/book/types';
import { selectedBookIdAtom } from '@/atoms/book';
import { BookCard } from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useQueryParams } from '@/hooks';
import { useBookDetailOpen } from '@/hooks/useBookDetailOpen';
import { useAtom } from 'jotai';
import { useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDiscoverBooksQuery } from '../hooks';

export function BooksContent() {
  const { clearQueryParams } = useQueryParams();

  const [, setSelectedBookId] = useAtom(selectedBookIdAtom);
  const openBookDetail = useBookDetailOpen();

  const { books = [], fetchNextPage, hasNextPage } = useDiscoverBooksQuery();

  const handleBookSelect = useCallback(
    (book: Book) => {
      setSelectedBookId(book.id.toString());
      const bookIsbn = book.isbn13 || book.isbn;
      openBookDetail(bookIsbn || book.id.toString());
    },
    [setSelectedBookId, openBookDetail]
  );

  const handleClearFilters = useCallback(() => {
    clearQueryParams();
  }, [clearQueryParams]);

  if (books.length === 0) {
    return (
      <div className="flex h-[calc(100vh-200px)] w-full flex-col items-center justify-center space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">
            검색 결과가 없습니다
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            다른 조건으로 검색해보세요
          </p>
        </div>
        <Button variant="outline" onClick={handleClearFilters} className="mt-4">
          필터 초기화
        </Button>
      </div>
    );
  }

  return (
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
      style={{ overflow: 'visible' }}
    >
      <div className="flex flex-col gap-4 px-0.5 py-1 md:grid md:grid-cols-3 md:gap-3 md:px-0 md:py-0 lg:grid-cols-4 xl:grid-cols-5">
        {books.map(book => (
          <BookCard
            key={book.id}
            book={book}
            onClick={handleBookSelect}
            forceHorizontal={true}
          />
        ))}
      </div>
    </InfiniteScroll>
  );
}
