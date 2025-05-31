import { Book } from '@/apis/book/types';
import { BookCard } from '@/components/BookCard';

interface BookGridProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
}

export function BookGrid({ books, onSelectBook }: BookGridProps) {
  return (
    <div>
      {/* 도서 그리드 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {books.map(book => (
          <BookCard key={book.id} book={book} onClick={onSelectBook} />
        ))}
      </div>

      {/* 결과가 없을 때 */}
      {books.length === 0 && (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg bg-gray-50 py-16 text-center">
          <div className="text-3xl">📚</div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            도서가 없습니다
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            다른 컬렉션을 선택해보세요.
          </p>
        </div>
      )}
    </div>
  );
}
