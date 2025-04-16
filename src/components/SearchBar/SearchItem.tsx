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
  size?: 'sm' | 'md' | 'lg';
}

export function SearchItem({
  item,
  onClick,
  onDelete,
  size = 'md',
}: SearchItemProps) {
  const [imageError, setImageError] = useState(false);

  const isSmall = size === 'sm';

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
      className={`group relative flex cursor-pointer items-start gap-3 px-3 ${isSmall ? 'py-2' : 'py-3'} transition-colors hover:bg-gray-50`}
      onSelect={onClick}
    >
      {/* 이미지 섬네일 */}
      {item.image ? (
        <div
          className={`relative flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white ${isSmall ? 'w-[80px]' : 'w-[140px]'}`}
        >
          {!imageError ? (
            <img
              src={item.image}
              alt={item.title}
              className="h-auto w-full object-contain"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div
              className={`flex w-full items-center justify-center bg-gray-50 ${isSmall ? 'h-[110px]' : 'h-[190px]'}`}
            >
              <span className={`${isSmall ? 'text-2xl' : 'text-3xl'}`}>📚</span>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`relative flex flex-shrink-0 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50 ${isSmall ? 'h-[110px] w-[80px]' : 'h-[190px] w-[140px]'}`}
        >
          <span className={`${isSmall ? 'text-2xl' : 'text-3xl'}`}>📚</span>
        </div>
      )}

      {/* 도서 정보 */}
      <div className="flex min-w-0 flex-1 flex-col justify-start pt-2">
        <h4
          className={`line-clamp-2 ${isSmall ? 'text-sm' : 'text-base'} font-medium text-gray-900 group-hover:text-gray-800`}
        >
          {highlightText(item.title, item.highlight)}
        </h4>
        {item.author && (
          <p
            className={`${isSmall ? 'mt-0.5 text-xs' : 'mt-2 text-sm'} line-clamp-1 text-gray-500`}
          >
            {item.author}
          </p>
        )}

        {/* 평점 및 리뷰 수 표시 */}
        {(item.rating || item.reviews) && (
          <div
            className={`${isSmall ? 'mt-1' : 'mt-3'} flex items-center gap-2 text-sm text-gray-600`}
          >
            {item.rating && (
              <div className="flex items-center gap-1">
                <Star
                  className={`${isSmall ? 'h-3 w-3' : 'h-4 w-4'} text-yellow-500`}
                />
                <span className={isSmall ? 'text-xs' : ''}>
                  {formatRating(item.rating)}
                </span>
              </div>
            )}
            {item.rating && item.reviews && <span>·</span>}
            {item.reviews && (
              <div className="flex items-center gap-1">
                <MessageSquare
                  className={`${isSmall ? 'h-3 w-3' : 'h-4 w-4'}`}
                />
                <span className={isSmall ? 'text-xs' : ''}>{item.reviews}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 삭제 버튼 (최근 검색어에만 표시) */}
      {onDelete && (
        <button
          className={`absolute top-1/2 right-4 flex-shrink-0 -translate-y-1/2 transform cursor-pointer rounded-full text-gray-400 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-110 hover:bg-gray-300 hover:text-gray-700 focus:ring-2 focus:ring-gray-300 focus:outline-none ${isSmall ? 'p-1' : 'p-1.5'}`}
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
          title="검색어 삭제"
          aria-label="검색어 삭제"
        >
          <X className={`${isSmall ? 'h-3 w-3' : 'h-4 w-4'}`} />
        </button>
      )}
    </CommandItem>
  );
}
