import { Book } from '@/apis/book/types';
import { selectedBookIdAtom } from '@/atoms/book';
import { BookCard } from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useQueryParams } from '@/hooks';
import { useIsMobile } from '@/hooks/use-mobile';
import { useBookDetailOpen } from '@/hooks/useBookDetailOpen';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import { useDiscoverBooksQuery } from '../hooks';

export function BooksContent() {
  const isMobile = useIsMobile();
  const { clearQueryParams } = useQueryParams();

  const [_, setSelectedBookId] = useAtom(selectedBookIdAtom);
  const openBookDetail = useBookDetailOpen();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 무한 스크롤로 도서 데이터 가져오기
  const { books, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useDiscoverBooksQuery();

  // 도서 선택 핸들러
  const handleBookSelect = useCallback(
    (book: Book) => {
      setSelectedBookId(book.id.toString());
      // isbn13이 있으면 우선 사용하고, 없으면 isbn 사용
      const bookIsbn = book.isbn13 || book.isbn;
      openBookDetail(bookIsbn);
    },
    [setSelectedBookId, openBookDetail]
  );

  // 필터 초기화 핸들러
  const handleClearFilters = useCallback(() => {
    clearQueryParams();
  }, [clearQueryParams]);

  // 무한스크롤 처리
  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    // 스크롤이 바닥에서 200px 위에 도달하면 다음 페이지 로드
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <>
      {isLoading ? (
        <div className="flex h-[calc(100vh-200px)] w-full items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : books && books.length > 0 ? (
        <div ref={scrollContainerRef}>
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

          {/* 로딩 인디케이터 */}
          {isFetchingNextPage && (
            <div className="my-8 flex justify-center">
              <LoadingSpinner size="md" />
            </div>
          )}
        </div>
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
