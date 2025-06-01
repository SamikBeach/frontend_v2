'use client';

import { MessageSquare, Star } from 'lucide-react';
import React from 'react';

import { Book } from '@/apis/book/types';
import { cn } from '@/lib/utils';

interface BookCardProps {
  book: Book;
  onClick?: (book: Book) => void;
  horizontal?: boolean;
}

// React.memo를 사용하여 props가 변경되지 않으면 리렌더링 방지
export const BookCard = React.memo(
  ({ book, onClick, horizontal = false }: BookCardProps) => {
    // 책 표지 이미지 - 없으면 기본 이미지 제공
    const coverImage =
      book.coverImage || `https://picsum.photos/seed/${book.id}/240/360`;

    // 평점과 리뷰 수가 문자열인 경우를 처리
    const rating =
      typeof book.rating === 'string'
        ? parseFloat(book.rating)
        : book.rating || 0;
    const reviews =
      typeof book.reviews === 'string'
        ? parseInt(book.reviews)
        : book.reviews || 0;

    // totalRatings 값 가져오기 (대체값 사용 안함)
    const totalRatings = (book as any).totalRatings;

    // 책 카드 클릭 핸들러
    const handleBookClick = () => {
      // 기존 onClick prop을 호출
      if (onClick) onClick(book);
    };

    return (
      <div
        className={cn(
          'cursor-pointer overflow-hidden',
          horizontal ? 'flex w-full' : 'flex h-full w-full flex-col'
        )}
        onClick={handleBookClick}
      >
        <div
          className={cn(
            'group w-full transition-all',
            horizontal ? 'flex h-auto items-start' : 'h-full bg-white'
          )}
        >
          <div
            className={cn(
              'relative flex flex-col items-center justify-end overflow-hidden rounded-md bg-white',
              horizontal ? 'h-auto w-32 flex-shrink-0' : 'aspect-[3/4.5] w-full'
            )}
          >
            <div className="h-auto max-h-full w-auto max-w-full overflow-hidden rounded-md border border-gray-200">
              <img
                src={coverImage}
                alt={book.title}
                className={cn(
                  'h-auto max-h-full w-auto max-w-full rounded-md object-contain object-bottom transition-transform group-hover:scale-[1.02]'
                )}
                loading="lazy"
              />
            </div>
          </div>
          <div
            className={cn(
              horizontal
                ? 'flex h-full flex-1 flex-col justify-between px-2 py-0.5'
                : 'px-2.5 pt-2.5 pb-2.5'
            )}
          >
            <div>
              <h3
                className={cn(
                  'line-clamp-2 font-medium text-gray-900',
                  horizontal
                    ? 'text-base sm:text-[15px]'
                    : 'text-base sm:text-[15px]'
                )}
              >
                {book.title}
              </h3>
              <p
                className={cn(
                  'mt-0.5 line-clamp-2 text-gray-500',
                  horizontal
                    ? 'text-sm sm:text-[13px]'
                    : 'text-sm sm:text-[13px]'
                )}
              >
                {book.author}
              </p>
            </div>
            <div
              className={cn(
                'flex items-center gap-2 pt-1 text-gray-600',
                horizontal
                  ? 'text-[15px] sm:text-[13px]'
                  : 'text-[15px] sm:text-[13px]'
              )}
            >
              <div className="flex items-center gap-1">
                <Star className="h-[18px] w-[18px] text-[#FFAB00] sm:h-3.5 sm:w-3.5" />
                <span>
                  {rating.toFixed(1)}{' '}
                  {totalRatings !== undefined && `(${totalRatings})`}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-[18px] w-[18px] sm:h-3.5 sm:w-3.5" />
                <span>{reviews}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

BookCard.displayName = 'BookCard';
