import {
  Book,
  PopularBooksSortOptions,
  TimeRangeOptions,
} from '@/apis/book/types';
import { selectedBookIdAtom } from '@/atoms/book';
import { sortOptionAtom, timeRangeAtom } from '@/atoms/popular';
import { BookCard } from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useQueryParams } from '@/hooks';
import { useBookDetailOpen } from '@/hooks/useBookDetailOpen';
import { useAtom } from 'jotai';
import InfiniteScroll from 'react-infinite-scroll-component';
import { usePopularBooksQuery } from '../hooks';

export function BooksContent() {
  const { updateQueryParams } = useQueryParams();

  // 프로필 페이지와 동일한 atom 사용 방식
  const [, setSelectedBookId] = useAtom(selectedBookIdAtom);
  const [, setSortOption] = useAtom(sortOptionAtom);
  const [, setTimeRange] = useAtom(timeRangeAtom);
  const openBookDetail = useBookDetailOpen();

  // Get books with infinite query - 프로필 페이지와 동일한 구조
  const { books = [], hasNextPage, fetchNextPage } = usePopularBooksQuery();

  // 도서 선택 핸들러 - 프로필 페이지와 완전히 동일
  const handleBookSelect = (book: Book) => {
    setSelectedBookId(book.id.toString());
    // isbn13이 있으면 우선 사용하고, 없으면 isbn 사용
    const bookIsbn = book.isbn13 || book.isbn;
    openBookDetail(bookIsbn || book.id.toString());
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

  // 데이터가 없는 경우 - 프로필 페이지와 동일한 구조
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
      style={{ overflow: 'visible' }} // 스크롤바 숨기기
    >
      {/* 모바일: flex-col (horizontal 카드), 데스크톱: grid */}
      <div className="flex flex-col gap-4 px-0.5 py-1 md:grid md:grid-cols-3 md:gap-3 md:px-0 md:py-0 lg:grid-cols-4 xl:grid-cols-5">
        {books.map(book => (
          <div key={book.id} className="md:hidden">
            <BookCard
              book={book}
              onClick={handleBookSelect}
              horizontal={true}
            />
          </div>
        ))}
        {books.map(book => (
          <div key={`desktop-${book.id}`} className="hidden md:block">
            <BookCard
              book={book}
              onClick={handleBookSelect}
              horizontal={false}
            />
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
}
