import { Book as BookType } from '@/apis/book';
import { useLibraryDetail } from '@/app/libraries/hooks/useLibraryDetail';
import { selectedBookAtom, selectedBookIdAtom } from '@/atoms/book';
import { BookCard } from '@/components/BookCard';
import { Separator } from '@/components/ui/separator';
import { useSetAtom } from 'jotai';
import { useParams } from 'next/navigation';

export function LibraryContent() {
  const params = useParams();
  const libraryId = parseInt(params.id as string, 10);
  const { library } = useLibraryDetail(libraryId);

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
    <div className="space-y-3">
      {/* 서재 설명 */}
      <div className="rounded-xl bg-white py-2">
        <p className="text-gray-700">
          {library.description || '설명이 없습니다.'}
        </p>
      </div>

      <Separator className="border-gray-100" />

      {/* 책 목록 */}
      <div>
        <div className="mb-4 flex items-center">
          <h2 className="text-lg font-medium text-gray-900">담긴 책</h2>
          <div className="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-600">
            {booksWithDetails.length}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {booksWithDetails.length > 0 ? (
            booksWithDetails.map(book => (
              <BookCard
                key={book.id}
                book={book as BookType}
                onClick={handleBookClick}
              />
            ))
          ) : (
            <div className="col-span-full py-8 text-center">
              <p className="text-gray-500">아직 추가된 책이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
