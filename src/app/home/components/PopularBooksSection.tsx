import { HomeBookPreview } from '@/apis/book/types';
import { BookCard } from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Lightbulb } from 'lucide-react';
import Link from 'next/link';

interface PopularBooksSectionProps {
  books: HomeBookPreview[];
  isLoading?: boolean;
  onSelectBook?: (book: HomeBookPreview) => void;
}

export function PopularBooksSection({
  books,
  isLoading = false,
  onSelectBook,
}: PopularBooksSectionProps) {
  return (
    <section className="h-auto p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-[#3182F6]" />
          <h2 className="text-xl font-semibold text-gray-900">
            지금 인기 있는 책
          </h2>
        </div>
        <Link href="/popular">
          <Button
            variant="ghost"
            size="sm"
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            더보기
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-[200px] items-center justify-center">
          <LoadingSpinner />
        </div>
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
                onClick={() => onSelectBook?.(book)}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
