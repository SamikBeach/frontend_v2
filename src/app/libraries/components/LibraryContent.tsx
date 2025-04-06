import { Book, BookCard } from '@/components/BookCard/BookCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Grid, List } from 'lucide-react';
import { useState } from 'react';
import { Library } from '../types';

export interface LibraryContentProps {
  library: Library;
  onBookClick: (book: Book) => void;
}

export function LibraryContent({ library, onBookClick }: LibraryContentProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 라이브러리 책을 BookCard 형식으로 변환
  const booksWithDetails = library.books.map(book => ({
    ...book,
    category: library.category,
    subcategory: library.tags[0] || '',
    rating: 4.5, // 예시 데이터
    reviews: 120, // 예시 데이터
    description: `${book.title}에 대한 설명입니다.`,
    publishDate: '2023-01-01',
    publisher: '출판사',
  }));

  return (
    <div className="space-y-8">
      {/* 서재 설명 */}
      <div>
        <p className="text-gray-700">{library.description}</p>

        {/* 태그 목록 */}
        <div className="mt-4 flex flex-wrap gap-2">
          {library.tags.map(tag => (
            <Badge
              key={tag}
              variant="secondary"
              className="rounded-full bg-gray-100 text-xs"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <Separator className="border-none" />

      {/* 책 목록 */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            포함된 책 ({library.books.length})
          </h2>

          <div className="mr-8 flex rounded-md p-1">
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 rounded-sm ${
                viewMode === 'grid' ? 'bg-gray-100' : ''
              }`}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
              <span className="sr-only">그리드 보기</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 rounded-sm ${
                viewMode === 'list' ? 'bg-gray-100' : ''
              }`}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">리스트 보기</span>
            </Button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="mr-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {booksWithDetails.map(book => (
              <BookCard key={book.id} book={book} onClick={onBookClick} />
            ))}
          </div>
        ) : (
          <div className="mr-8 space-y-2">
            {library.books.map(book => (
              <div
                key={book.id}
                className="flex cursor-pointer gap-4 rounded-xl p-2 transition-colors hover:bg-gray-50"
                onClick={() => onBookClick(book as unknown as Book)}
              >
                <div className="h-32 w-20 flex-shrink-0 overflow-hidden rounded-md">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <h3 className="text-base font-medium text-gray-900 group-hover:text-blue-600">
                    {book.title}
                  </h3>
                  <p className="mt-0.5 text-sm text-gray-500">{book.author}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
