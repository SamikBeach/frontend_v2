import { Book } from '@/apis/book/types';
import { ReadingStatusType } from '@/apis/reading-status/types';
import { selectedBookIdAtom } from '@/atoms/book';
import { useBookDetailOpen } from '@/hooks/useBookDetailOpen';
import { useAtom } from 'jotai';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useUserBooks } from '../hooks';
import { BookGrid } from './BookGrid';
import { EmptyState } from './EmptyState';
import { LoadingSpinner } from './LoadingSpinner';

interface BooksListProps {
  status: ReadingStatusType | undefined;
}

export function BooksList({ status }: BooksListProps) {
  const { books = [], fetchNextPage, hasNextPage } = useUserBooks(status);
  const [, setSelectedBookId] = useAtom(selectedBookIdAtom);
  const openBookDetail = useBookDetailOpen();

  // 책 선택 핸들러
  const handleBookSelect = (book: Book) => {
    setSelectedBookId(book.id.toString());
    // isbn13이 있으면 우선 사용하고, 없으면 isbn 사용
    const bookIsbn = book.isbn13 || book.isbn;
    openBookDetail(bookIsbn || book.id.toString());
  };

  // 데이터가 없는 경우
  if (books.length === 0) {
    return <EmptyState />;
  }

  return (
    <InfiniteScroll
      dataLength={books.length}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={<LoadingSpinner />}
      scrollThreshold={0.9}
      className="flex w-full flex-col pb-4"
      style={{ overflow: 'visible' }} // 스크롤바 숨기기
    >
      <BookGrid books={books} onBookSelect={handleBookSelect} />
    </InfiniteScroll>
  );
}
