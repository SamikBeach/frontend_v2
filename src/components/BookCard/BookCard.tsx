'use client';

import { MessageSquare, Star } from 'lucide-react';
import React from 'react';

import { Book } from '@/apis/book/types';
import { useDialogQuery } from '@/hooks';

interface BookCardProps {
  book: Book;
  onClick?: (book: Book) => void;
}

// React.memo를 사용하여 props가 변경되지 않으면 리렌더링 방지
export const BookCard = React.memo(({ book, onClick }: BookCardProps) => {
  // useDialogQuery 훅 사용
  const { open: openBookDialog } = useDialogQuery({ type: 'book' });

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

  // 책 카드 클릭 핸들러
  const handleBookClick = () => {
    // ISBN13 또는 ISBN 사용해서 책 다이얼로그 열기
    const bookIsbn = book.isbn13 || book.isbn || book.id.toString();
    openBookDialog(bookIsbn);

    // 기존 onClick prop이 있으면 함께 호출
    if (onClick) onClick(book);
  };

  return (
    <div
      className="flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xl"
      onClick={handleBookClick}
    >
      <div className="group h-full w-full bg-[#F9FAFB] transition-all hover:bg-[#F2F4F6]">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={coverImage}
            alt={book.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
        <div className="p-2.5">
          <h3 className="line-clamp-1 text-[15px] font-medium text-gray-900 group-hover:text-[#3182F6]">
            {book.title}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-[13px] text-gray-500">
            {book.author}
          </p>
          <div className="mt-1.5 flex items-center gap-2 text-[13px] text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-[#FFAB00]" />
              <span>{rating.toFixed(1)}</span>
            </div>
            <span>·</span>
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
