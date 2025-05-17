import { HomeBookPreview } from '@/apis/book/types';
import { selectedBookIdAtom } from '@/atoms/book';
import { BookCard } from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDialogQuery } from '@/hooks';
import { useAtom } from 'jotai';
import { Lightbulb } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useHomePopularBooksQuery } from '../hooks';

export function PopularBooksSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="w-full">
          <div className="flex h-full w-full flex-col overflow-hidden rounded-xl">
            <div className="h-full w-full bg-white">
              <Skeleton className="relative flex aspect-[3/4.5] items-center justify-center overflow-hidden" />
              <div className="p-2.5">
                <Skeleton className="mb-1 h-5 w-full" />
                <Skeleton className="mb-1.5 h-4 w-3/4" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="mt-1.5 h-4 w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PopularBooksSection() {
  const router = useRouter();
  const { books, isLoading } = useHomePopularBooksQuery();
  const { open: openBookDialog } = useDialogQuery({ type: 'book' });
  const [, setSelectedBookId] = useAtom(selectedBookIdAtom);

  // 책 선택 핸들러
  const handleBookSelect = (book: HomeBookPreview) => {
    setSelectedBookId(book.id.toString());
    // isbn13이 있으면 우선 사용하고, 없으면 isbn 사용
    const bookIsbn = book.isbn13 || book.isbn;
    openBookDialog(bookIsbn);
  };

  return (
    <section className="h-auto p-2 sm:p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Lightbulb className="h-4 w-4 text-[#3182F6] sm:h-5 sm:w-5" />
          <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
            지금 인기 있는 책
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="cursor-pointer text-xs font-medium text-gray-500 hover:text-gray-900 sm:text-sm"
          onClick={() => router.push('/popular')}
        >
          더보기
        </Button>
      </div>

      {isLoading ? (
        <PopularBooksSkeleton />
      ) : books.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center">
          <p className="text-sm text-gray-500">인기 도서가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:gap-4">
          {books.slice(0, 4).map((book, index) => (
            <div
              key={book.id}
              className={`w-full ${index === 3 ? 'sm:hidden' : ''}`}
            >
              <BookCard
                book={book as any}
                onClick={() => handleBookSelect(book)}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
