'use client';

import { MessageSquare, Star } from 'lucide-react';
import React from 'react';

export interface Book {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  category: string;
  subcategory: string;
  rating: number;
  reviews: number;
  description: string;
  publishDate: string;
  publisher: string;
}

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
}

// React.memo를 사용하여 props가 변경되지 않으면 리렌더링 방지
export const BookCard = React.memo(({ book, onClick }: BookCardProps) => {
  return (
    <div className="cursor-pointer" onClick={() => onClick(book)}>
      <div className="group h-full rounded-xl bg-[#F9FAFB] transition-all hover:bg-[#F2F4F6]">
        <div className="relative aspect-[5/7] overflow-hidden rounded-t-xl">
          <img
            src={book.coverImage}
            alt={book.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
        <div className="p-3">
          <h3 className="line-clamp-1 text-[15px] font-medium text-gray-900 group-hover:text-[#3182F6]">
            {book.title}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-[13px] text-gray-500">
            {book.author}
          </p>
          <div className="mt-2 flex items-center gap-2 text-[13px] text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-[#FFAB00]" />
              <span>{book.rating.toFixed(1)}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{book.reviews}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
