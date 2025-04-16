'use client';

import { CommandItem } from '@/components/ui/command';
import { MessageSquare, Star, X } from 'lucide-react';
import { useState } from 'react';

interface SearchItemProps {
  item: {
    id: number;
    type: string;
    title: string;
    subtitle?: string;
    image?: string;
    author?: string;
    highlight?: string;
    rating?: number;
    reviews?: number;
    isbn?: string;
    isbn13?: string;
  };
  onClick: () => void;
  onDelete?: () => void;
}

export function SearchItem({ item, onClick, onDelete }: SearchItemProps) {
  const [imageError, setImageError] = useState(false);

  // 하이라이트 텍스트 처리
  const highlightText = (text: string, highlight?: string) => {
    if (!highlight) return text;

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight?.toLowerCase() ? (
            <span key={index} className="font-medium text-gray-900">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // 평점 형식화 함수
  const formatRating = (rating: any): string => {
    if (typeof rating === 'number') {
      return rating.toFixed(1);
    }

    if (typeof rating === 'string') {
      const parsedRating = parseFloat(rating);
      return Number.isNaN(parsedRating) ? rating : parsedRating.toFixed(1);
    }

    return String(rating);
  };

  return (
    <CommandItem
      value={`${item.type}-${item.id}-${item.title}`}
      className="group relative flex cursor-pointer items-start gap-3 px-3 py-3 transition-colors hover:bg-gray-50"
      onSelect={onClick}
    >
      {/* 이미지 섬네일 */}
      {item.image ? (
        <div className="relative w-[140px] flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
          {!imageError ? (
            <img
              src={item.image}
              alt={item.title}
              className="h-auto w-full object-contain"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="flex h-[190px] w-full items-center justify-center bg-gray-50">
              <span className="text-3xl">📚</span>
            </div>
          )}
        </div>
      ) : (
        <div className="relative flex h-[190px] w-[140px] flex-shrink-0 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50">
          <span className="text-3xl">📚</span>
        </div>
      )}

      {/* 도서 정보 */}
      <div className="flex min-w-0 flex-1 flex-col justify-start pt-2">
        <h4 className="line-clamp-2 text-base font-medium text-gray-900 group-hover:text-gray-800">
          {highlightText(item.title, item.highlight)}
        </h4>
        {item.author && (
          <p className="mt-2 line-clamp-1 text-sm text-gray-500">
            {item.author}
          </p>
        )}

        {/* 평점 및 리뷰 수 표시 */}
        {(item.rating || item.reviews) && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            {item.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{formatRating(item.rating)}</span>
              </div>
            )}
            {item.rating && item.reviews && <span>·</span>}
            {item.reviews && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{item.reviews}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 삭제 버튼 (최근 검색어에만 표시) */}
      {onDelete && (
        <button
          className="absolute top-1/2 right-4 flex-shrink-0 -translate-y-1/2 transform cursor-pointer rounded-full p-1.5 text-gray-400 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-110 hover:bg-gray-300 hover:text-gray-700 focus:ring-2 focus:ring-gray-300 focus:outline-none"
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
          title="검색어 삭제"
          aria-label="검색어 삭제"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </CommandItem>
  );
}
