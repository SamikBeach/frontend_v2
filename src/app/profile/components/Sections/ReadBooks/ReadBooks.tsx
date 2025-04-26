import { Book } from '@/apis/book/types';
import { ReadingStatusType } from '@/apis/reading-status/types';
import { useUserBooks } from '@/app/profile/hooks';
import { selectedBookIdAtom } from '@/atoms/book';
import { BookCard } from '@/components/BookCard';
import { useDialogQuery } from '@/hooks';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

// 독서 상태 필터 매핑 - 순서 변경: 전체, 읽고 싶어요, 읽는중, 읽었어요
const readingStatusFilters = [
  { id: 'ALL', name: '전체', type: undefined },
  {
    id: 'WANT_TO_READ',
    name: '읽고 싶어요',
    type: ReadingStatusType.WANT_TO_READ,
  },
  {
    id: 'READING',
    name: '읽는중',
    type: ReadingStatusType.READING,
  },
  {
    id: 'READ',
    name: '읽었어요',
    type: ReadingStatusType.READ,
  },
];

// 책 목록 컴포넌트 - 무한 스크롤 구현
function BooksList({ status }: { status: ReadingStatusType | undefined }) {
  const {
    books = [],
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    total,
  } = useUserBooks(status);
  const [, setSelectedBookId] = useAtom(selectedBookIdAtom);
  const { open: openBookDialog } = useDialogQuery({ type: 'book' });

  // 책 선택 핸들러
  const handleBookSelect = (book: Book) => {
    setSelectedBookId(book.id.toString());
    // isbn13이 있으면 우선 사용하고, 없으면 isbn 사용
    const bookIsbn = book.isbn13 || book.isbn;
    openBookDialog(bookIsbn || book.id.toString());
  };

  // 로딩 중 상태
  if (isLoading) {
    return <BooksListSkeleton />;
  }

  // 데이터가 없는 경우
  if (books.length === 0) {
    return (
      <div className="flex h-40 w-full items-center justify-center rounded-lg bg-gray-50">
        <p className="text-sm text-gray-500">책 목록이 없습니다.</p>
      </div>
    );
  }

  return (
    <InfiniteScroll
      dataLength={books.length}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={
        <div className="mt-6 flex w-full justify-center py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
        </div>
      }
      scrollThreshold={0.9}
      className="flex w-full flex-col pb-4"
      style={{ overflow: 'visible' }} // 스크롤바 숨기기
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {books.map(book => {
          // BookCard에 필요한 최소한의 필드만 전달
          const bookData: Partial<Book> = {
            id: book.id,
            title: book.title,
            author: book.author,
            coverImage: book.coverImage,
            rating: book.rating || 0,
            reviews: book.reviews || 0,
            isbn: book.isbn || '',
            description: '',
            publisher: book.publisher || '',
          };

          // 추가 필드 적용 (any 타입 캐스팅 사용)
          if (book.totalRatings !== undefined) {
            (bookData as any).totalRatings = book.totalRatings;
          }

          if (book.isbn13) {
            bookData.isbn13 = book.isbn13;
          }

          return (
            <BookCard
              key={book.id}
              book={bookData as Book}
              onClick={handleBookSelect}
            />
          );
        })}
      </div>
    </InfiniteScroll>
  );
}

// 스켈레톤 컴포넌트 (BookList가 로딩 중일 때 표시)
function BooksListSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="flex h-full w-full flex-col">
          <div className="h-full w-full">
            <div className="relative aspect-[3/4.5] w-full overflow-hidden rounded-lg bg-gray-100">
              <div className="h-full w-full animate-pulse bg-gray-200" />
            </div>
            <div className="mt-2.5 space-y-1.5">
              <div className="h-[15px] w-full animate-pulse rounded bg-gray-200" />
              <div className="h-[13px] w-[70%] animate-pulse rounded bg-gray-200" />
              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="h-3.5 w-3.5 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-[13px] w-12 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3.5 w-3.5 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-[13px] w-8 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 메인 컴포넌트 - 필터 탭 포함
export default function ReadBooks() {
  const params = useParams();
  const userId = Number(params.id as string);
  const [selectedStatus, setSelectedStatus] = useState<
    ReadingStatusType | undefined
  >(undefined);

  // 각 상태별 책 수를 가져오기 위한 쿼리들
  const { total: totalBooks } = useUserBooks(undefined);
  const { total: wantToReadBooks } = useUserBooks(
    ReadingStatusType.WANT_TO_READ
  );
  const { total: readingBooks } = useUserBooks(ReadingStatusType.READING);
  const { total: readBooks } = useUserBooks(ReadingStatusType.READ);

  // 각 상태별 책 수를 포함한 필터 데이터
  const filtersWithCount = [
    { ...readingStatusFilters[0], count: totalBooks },
    { ...readingStatusFilters[1], count: wantToReadBooks },
    { ...readingStatusFilters[2], count: readingBooks },
    { ...readingStatusFilters[3], count: readBooks },
  ];

  const handleStatusChange = (statusType: ReadingStatusType | undefined) => {
    setSelectedStatus(statusType);
  };

  return (
    <div>
      {/* 독서 상태 필터 */}
      <div className="mb-6 flex flex-wrap gap-3">
        {filtersWithCount.map(status => (
          <button
            key={status.id}
            className={cn(
              'flex h-8 cursor-pointer items-center rounded-full border px-3 text-[13px] font-medium transition-all',
              selectedStatus === status.type
                ? 'border-blue-200 bg-blue-50 text-blue-600'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            )}
            onClick={() => handleStatusChange(status.type)}
          >
            <span>{status.name}</span>
            <span className="ml-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-100 px-1 text-[11px] text-gray-600">
              {status.count || 0}
            </span>
          </button>
        ))}
      </div>

      {/* 책 목록 컴포넌트 */}
      <BooksList status={selectedStatus} />
    </div>
  );
}
