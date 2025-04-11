import { Book as BookType } from '@/apis/book';
import { useLibraryDetail } from '@/app/libraries/hooks/useLibraryDetail';
import { selectedBookAtom, selectedBookIdAtom } from '@/atoms/book';
import { BookCard } from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSetAtom } from 'jotai';
import { Grid, List } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export function LibraryContent() {
  const params = useParams();
  const libraryId = parseInt(params.id as string, 10);
  const { library } = useLibraryDetail(libraryId);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const setSelectedBookId = useSetAtom(selectedBookIdAtom);
  const setSelectedBook = useSetAtom(selectedBookAtom);

  if (!library) {
    return null;
  }

  // 라이브러리 책 형식 변환
  const booksWithDetails =
    library.books?.map(libraryBook => ({
      ...libraryBook.book,
      id: libraryBook.bookId,
    })) || [];

  // 책 선택 핸들러
  const handleBookClick = (book: BookType) => {
    // 선택된 책 ID 및 데이터 모두 저장
    setSelectedBookId(book.id.toString());
    setSelectedBook(book);
  };

  return (
    <div className="space-y-3 px-6">
      {/* 서재 설명 */}
      <div className="rounded-xl bg-white py-2">
        <p className="text-gray-700">
          {library.description || '설명이 없습니다.'}
        </p>
      </div>

      <Separator className="border-gray-100" />

      {/* 책 목록 */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-lg font-medium text-gray-900">포함된 책</h2>
            <div className="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-600">
              {booksWithDetails.length}
            </div>
          </div>

          <div className="flex rounded-2xl bg-gray-100 p-1">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-xl ${
                viewMode === 'grid' ? 'bg-white' : ''
              }`}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
              <span className="sr-only">그리드 보기</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-xl ${
                viewMode === 'list' ? 'bg-white' : ''
              }`}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">리스트 보기</span>
            </Button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {booksWithDetails.length > 0 ? (
              booksWithDetails.map(book => (
                <div key={book.id} className="flex aspect-[3/4] flex-col">
                  <BookCard book={book as BookType} onClick={handleBookClick} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center">
                <p className="text-gray-500">아직 추가된 책이 없습니다.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {booksWithDetails.length > 0 ? (
              booksWithDetails.map(book => (
                <div
                  key={book.id}
                  className="flex cursor-pointer gap-4 rounded-xl bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                  onClick={() => handleBookClick(book as BookType)}
                >
                  <div className="h-32 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <h3 className="text-base font-medium text-gray-900">
                      {book.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{book.author}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500">아직 추가된 책이 없습니다.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
