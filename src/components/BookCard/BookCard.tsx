'use client';

import { MessageSquare, Star } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import { Book } from '@/apis/book/types';
import { cn } from '@/lib/utils';

interface BookCardProps {
  book: Book;
  onClick?: (book: Book) => void;
  horizontal?: boolean;
  priority?: boolean; // 이미지 우선 로딩 여부
}

// React.memo를 사용하여 props가 변경되지 않으면 리렌더링 방지
export const BookCard = React.memo(
  ({ book, onClick, horizontal = false, priority = false }: BookCardProps) => {
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
            horizontal ? 'flex items-start' : 'h-full bg-white'
          )}
        >
          <div
            className={cn(
              'relative flex flex-col items-center overflow-hidden rounded-md bg-gray-100',
              horizontal
                ? 'w-32 flex-shrink-0 justify-start'
                : 'aspect-[3/4.5] w-full justify-end'
            )}
          >
            <Image
              src={coverImage}
              alt={book.title}
              width={horizontal ? 128 : 240}
              height={horizontal ? 192 : 360}
              className={cn(
                'rounded-md border border-gray-200 bg-gray-100 object-cover transition-transform group-hover:scale-[1.02]',
                horizontal ? 'h-auto w-full' : 'h-full w-full object-center'
              )}
              priority={priority}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjM2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjQwIiBoZWlnaHQ9IjM2MCIgZmlsbD0iI2Y5ZmFmYiIvPgo8L3N2Zz4K"
              sizes={
                horizontal
                  ? '128px'
                  : '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
              }
              style={{ backgroundColor: '#f3f4f6' }}
              onError={e => {
                // 이미지 로드 실패 시 기본 이미지로 대체
                const target = e.currentTarget as HTMLImageElement;
                target.src = `https://placehold.co/${horizontal ? '128x192' : '240x360'}/f3f4f6/9ca3af?text=${encodeURIComponent(book.title.slice(0, 10))}`;
              }}
            />
          </div>
          <div
            className={cn(
              horizontal
                ? 'flex h-full flex-1 flex-col justify-between px-2 py-0.5'
                : 'px-2.5 pt-2.5 pb-2.5'
            )}
          >
            <div className={horizontal ? 'flex-1' : ''}>
              <h3
                className={cn(
                  'line-clamp-2 font-medium text-gray-900',
                  'text-base sm:text-[15px]'
                )}
              >
                {book.title}
              </h3>
              <p
                className={cn(
                  'mt-0.5 line-clamp-2 text-gray-500',
                  'text-sm sm:text-[13px]'
                )}
              >
                {book.author}
              </p>
            </div>
            <div
              className={cn(
                'flex items-center gap-2 text-gray-600',
                horizontal
                  ? 'mt-auto pt-1 text-[15px] sm:text-[13px]'
                  : 'pt-1 text-[15px] sm:text-[13px]'
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
