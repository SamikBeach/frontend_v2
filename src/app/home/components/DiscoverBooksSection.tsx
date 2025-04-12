import { HomeBookPreview, HomeDiscoverBooksResponse } from '@/apis/book/types';
import { BookCard } from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Compass } from 'lucide-react';
import Link from 'next/link';

interface DiscoverBooksSectionProps {
  discoverData: HomeDiscoverBooksResponse[];
  isLoading?: boolean;
  onSelectBook?: (book: HomeBookPreview) => void;
}

export function DiscoverBooksSection({
  discoverData,
  isLoading = false,
  onSelectBook,
}: DiscoverBooksSectionProps) {
  // 모든 카테고리의 책을 하나의 배열로 합친 후 최대 3개만 표시
  const allBooks = discoverData.flatMap(category => category.books || []);
  const displayBooks = allBooks.slice(0, 3);

  return (
    <section className="h-auto p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-[#00C471]" />
          <h2 className="text-xl font-semibold text-gray-900">오늘의 발견</h2>
        </div>
        <Link href="/discover">
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
      ) : displayBooks.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center">
          <p className="text-sm text-gray-500">오늘의 발견이 없습니다.</p>
        </div>
      ) : (
        <div className="flex gap-4">
          {displayBooks.map(book => (
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
