import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useBookDetails } from '../hooks';

export function BookCoverSection() {
  const { book, handleOpenAladin } = useBookDetails();

  if (!book) return null;

  // 출간일 포맷팅
  const formattedDate = book.publishDate
    ? typeof book.publishDate === 'string'
      ? format(parseISO(book.publishDate), 'yyyy년 MM월 dd일', {
          locale: ko,
        })
      : format(new Date(book.publishDate), 'yyyy년 MM월 dd일', {
          locale: ko,
        })
    : '';

  return (
    <>
      {/* 책 표지 이미지 */}
      <div
        className="relative aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl bg-gray-50"
        onClick={handleOpenAladin}
      >
        <img
          src={book.coverImage}
          alt={book.title}
          className="h-full w-full object-cover"
          loading="eager"
        />
      </div>

      {/* 책 정보(제목, 저자, 출판사, 출간일)는 이미지 아래에 배치 */}
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <h2
            className="cursor-pointer text-xl font-bold text-gray-900"
            onClick={handleOpenAladin}
          >
            {book.title}
          </h2>

          {/* 카테고리 태그 - 제목 우측으로 이동 */}
          {(book.category || book.subcategory) && (
            <div className="mt-1 flex flex-wrap gap-1">
              {book.category && (
                <Badge className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] font-medium text-white">
                  {book.category.name}
                </Badge>
              )}
              {book.subcategory && (
                <Badge className="rounded-full bg-gray-600 px-2 py-0.5 text-[10px] font-medium text-white">
                  {book.subcategory.name}
                </Badge>
              )}
            </div>
          )}
        </div>

        <p className="text-gray-700">{book.author}</p>

        {book.publisher && (
          <p className="text-sm text-gray-500">{book.publisher}</p>
        )}
        {book.publishDate && (
          <p className="text-sm text-gray-500">출간일: {formattedDate}</p>
        )}
      </div>
    </>
  );
}
