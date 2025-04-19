'use client';

import { MessageSquare, Star } from 'lucide-react';
import React from 'react';

import { Book } from '@/apis/book/types';

interface BookCardProps {
  book: Book;
  onClick?: (book: Book) => void;
}

// React.memo를 사용하여 props가 변경되지 않으면 리렌더링 방지
export const BookCard = React.memo(({ book, onClick }: BookCardProps) => {
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
      className="flex h-full w-full min-w-[140px] cursor-pointer flex-col overflow-hidden rounded-xl"
      onClick={handleBookClick}
    >
      <div className="group h-full w-full bg-white transition-all hover:bg-gray-50">
        <div className="relative flex aspect-[3/4.5] items-center justify-center overflow-hidden bg-gray-100">
          <img
            src={coverImage}
            alt={book.title}
            className="h-auto w-full object-contain transition-transform group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
        <div className="p-2.5">
          <h3 className="line-clamp-2 text-[15px] font-medium text-gray-900">
            {book.title}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-[13px] text-gray-500">
            {book.author}
          </p>
          <div className="mt-1.5 flex items-center gap-2 text-[13px] text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-[#FFAB00]" />
              <span>
                {rating.toFixed(1)}{' '}
                {totalRatings !== undefined && `(${totalRatings})`}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{reviews}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

BookCard.displayName = 'BookCard';
