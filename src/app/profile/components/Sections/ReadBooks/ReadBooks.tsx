import { Book } from '@/apis/book/types';
import { ReadingStatusType } from '@/apis/reading-status/types';
import { UserReadingStatusCountsDto } from '@/apis/user/types';
import { getUserReadingStatusCounts } from '@/apis/user/user';
import { useUserBooks } from '@/app/profile/hooks';
import { selectedBookIdAtom } from '@/atoms/book';
import { BookCard } from '@/components/BookCard';
import { useDialogQuery } from '@/hooks';
import { cn } from '@/lib/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { BooksGridSkeleton, FilterMenuSkeleton } from './ReadBooksSkeleton';

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
    isLoading,
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
    return <BooksGridSkeleton />;
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

// 메인 컴포넌트 - 필터 탭 포함
export default function ReadBooks() {
  const params = useParams();
  const userId = Number(params.id);
  const [selectedStatus, setSelectedStatus] = useState<
    ReadingStatusType | undefined
  >(undefined);

  // 독서 상태 카운트 직접 쿼리
  const { data: statusCounts, isLoading } =
    useSuspenseQuery<UserReadingStatusCountsDto>({
      queryKey: ['user-reading-status-counts', userId],
      queryFn: () => getUserReadingStatusCounts(userId),
    });

  // 독서 상태 변경 핸들러
  const handleStatusChange = (statusType: ReadingStatusType | undefined) => {
    setSelectedStatus(statusType);
  };

  // 필터에 표시할 카운트 데이터 매핑
  const getCountForStatus = (statusType: ReadingStatusType | undefined) => {
    if (!statusCounts) return 0;

    if (!statusType) return statusCounts.total || 0;

    // 타입을 그대로 키로 사용
    return statusCounts[statusType] || 0;
  };

  return (
    <div>
      {/* 독서 상태 필터 */}
      {isLoading ? (
        <FilterMenuSkeleton />
      ) : (
        <div className="mb-6 flex flex-wrap gap-3">
          {readingStatusFilters.map(filter => (
            <button
              key={filter.id}
              className={cn(
                'flex h-8 items-center rounded-full border px-3 text-[13px] font-medium transition-all',
                selectedStatus === filter.type
                  ? 'border-blue-200 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              )}
              onClick={() => handleStatusChange(filter.type)}
            >
              <span>{filter.name}</span>
              <span className="ml-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-100 px-1 text-[11px] text-gray-600">
                {getCountForStatus(filter.type)}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* 책 목록 섹션 - 필터 선택에 따라 이 부분만 다시 로드됨 */}
      <Suspense fallback={<BooksGridSkeleton />}>
        <BooksList status={selectedStatus} />
      </Suspense>
    </div>
  );
}
