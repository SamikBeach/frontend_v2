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
    <div className="flex gap-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="w-1/3">
          <div className="flex h-full w-full min-w-[140px] flex-col overflow-hidden rounded-xl">
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
    <section className="h-auto p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-[#3182F6]" />
          <h2 className="text-xl font-semibold text-gray-900">
            지금 인기 있는 책
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm font-medium text-gray-500 hover:text-gray-900"
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
        <div className="flex gap-4">
          {books.slice(0, 3).map(book => (
            <div key={book.id} className="w-1/3">
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
