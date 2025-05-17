import { Book } from '@/apis/book/types';
import { selectedBookIdAtom } from '@/atoms/book';
import { BookCard } from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useDialogQuery, useQueryParams } from '@/hooks';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAtom } from 'jotai';
import { useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDiscoverBooksQuery } from '../hooks';

export function BooksContent() {
  const isMobile = useIsMobile();
  const { clearQueryParams } = useQueryParams();

  const [_, setSelectedBookId] = useAtom(selectedBookIdAtom);
  const { open: openBookDialog } = useDialogQuery({ type: 'book' });

  // 무한 스크롤로 도서 데이터 가져오기
  const { books, fetchNextPage, hasNextPage, isLoading } =
    useDiscoverBooksQuery();

  // 도서 선택 핸들러
  const handleBookSelect = useCallback(
    (book: Book) => {
      setSelectedBookId(book.id.toString());
      // isbn13이 있으면 우선 사용하고, 없으면 isbn 사용
      const bookIsbn = book.isbn13 || book.isbn;
      openBookDialog(bookIsbn);
    },
    [setSelectedBookId, openBookDialog]
  );

  // 필터 초기화 핸들러
  const handleClearFilters = useCallback(() => {
    clearQueryParams();
  }, [clearQueryParams]);

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
