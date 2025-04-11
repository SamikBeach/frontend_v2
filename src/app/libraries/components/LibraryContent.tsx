import { Book as BookType } from '@/apis/book';
import { Library } from '@/apis/library';
import { BookCard } from '@/components/BookCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Grid, List } from 'lucide-react';
import { useState } from 'react';

export interface LibraryContentProps {
  library: Library;
  onBookClick: (book: BookType) => void;
}

export function LibraryContent({ library, onBookClick }: LibraryContentProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 라이브러리 책 형식 변환
  const booksWithDetails =
    library.books?.map(libraryBook => ({
      ...libraryBook.book,
      id: libraryBook.bookId,
    })) || [];

  // 메인 태그 (첫 번째 태그만 사용)
  const mainTag =
    library.tags && library.tags.length > 0 ? library.tags[0] : null;

  return (
    <div className="space-y-8">
      {/* 서재 설명 */}
      <div>
        <p className="text-gray-700">
          {library.description || '설명이 없습니다.'}
        </p>

        {/* 메인 태그 표시 */}
        {mainTag && (
          <div className="mt-4">
            <Badge
              variant="secondary"
              className="rounded-full bg-gray-100 text-xs"
            >
              {mainTag.name}
            </Badge>
          </div>
        )}
      </div>

      <Separator className="border-none" />

      {/* 책 목록 */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            포함된 책 ({booksWithDetails.length})
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
              <BookCard
                key={book.id}
                book={book as BookType}
                onClick={onBookClick}
              />
            ))}
          </div>
        ) : (
          <div className="mr-8 space-y-2">
            {booksWithDetails.map(book => (
              <div
                key={book.id}
                className="flex cursor-pointer gap-4 rounded-xl p-2 transition-colors hover:bg-gray-50"
                onClick={() => onBookClick(book as BookType)}
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
