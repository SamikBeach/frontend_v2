import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useCallback } from 'react';
import { useBookDetails } from '../hooks';

export function BookCoverSection() {
  const { book, isbn } = useBookDetails();
  const isMobile = useIsMobile();

  // 알라딘으로 이동하는 함수
  const handleOpenAladin = useCallback(() => {
    if (!isbn) return;
    window.open(
      `https://www.aladin.co.kr/shop/wproduct.aspx?isbn=${isbn}`,
      '_blank'
    );
  }, [isbn]);

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
    <div className={cn('flex', isMobile ? 'flex-col gap-4' : 'flex-col gap-3')}>
      {/* 책 표지 이미지 */}
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl bg-gray-50',
          isMobile
            ? 'mx-auto w-44 cursor-pointer' // 약간 넓게 조정
            : 'flex w-full cursor-pointer items-center justify-center'
        )}
        onClick={handleOpenAladin}
      >
        <img
          src={book.coverImage}
          alt={book.title}
          className="h-auto w-full object-contain"
          loading="eager"
        />
      </div>

      {/* 책 정보(제목, 저자, 출판사, 출간일)는 이미지 아래에 배치 */}
      <div className={cn('space-y-2', isMobile ? 'px-1 text-center' : '')}>
        <div
          className={cn(
            'items-start gap-2',
            isMobile ? 'flex flex-col items-center' : 'flex'
          )}
        >
          <h2
            className={cn(
              'cursor-pointer font-bold text-gray-900',
              isMobile ? 'line-clamp-2 text-lg' : 'text-xl'
            )}
            onClick={handleOpenAladin}
          >
            {book.title}
          </h2>

          {/* 카테고리 태그 - 제목 우측으로 이동 */}
          {(book.category || book.subcategory) && (
            <div
              className={cn(
                'flex flex-wrap gap-1',
                isMobile ? 'mt-1 justify-center' : 'mt-1'
              )}
            >
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

        <p className={cn('text-gray-700', isMobile ? 'text-sm' : '')}>
          {book.author}
        </p>

        {book.publisher && (
          <p className="text-sm text-gray-500">{book.publisher}</p>
        )}
        {book.publishDate && (
          <p className="text-sm text-gray-500">출간일: {formattedDate}</p>
        )}
      </div>
    </div>
  );
}
