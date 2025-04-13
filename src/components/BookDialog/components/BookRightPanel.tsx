import { BookQuotes } from '../BookQuotes';
import { BookReviews } from '../BookReviews';
import { BookShelves } from '../BookShelves';
import { useBookDetails } from '../hooks';

export function BookRightPanel() {
  const { book } = useBookDetails();

  if (!book) return null;

  return (
    <div className="space-y-7">
      {/* 리뷰 섹션 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900">
            리뷰 ({book.reviews?.length || 0})
          </p>
        </div>

        <BookReviews />
      </div>

      {/* 등록된 서재 섹션 */}
      <BookShelves />

      {/* 인상적인 구절 */}
      <BookQuotes />
    </div>
  );
}
