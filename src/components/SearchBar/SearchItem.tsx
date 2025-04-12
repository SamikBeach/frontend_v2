'use client';

import { CommandItem } from '@/components/ui/command';
import { MessageSquare, Star, X } from 'lucide-react';
import Image from 'next/image';
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
      className="group relative flex cursor-pointer items-start gap-3 px-4 py-2 transition-colors hover:bg-gray-50"
      onSelect={onClick}
    >
      {/* 이미지 섬네일 */}
      {item.image && (
        <div className="relative h-28 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <span className="text-xl text-gray-300">📖</span>
          </div>
          {!imageError ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              sizes="112px"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
          )}
        </div>
      )}

      {/* 도서 정보 */}
      <div className="min-w-0 flex-1 pt-1">
        <h4 className="truncate text-base font-medium text-gray-900 group-hover:text-gray-800">
          {highlightText(item.title, item.highlight)}
        </h4>
        {item.author && (
          <p className="mt-1 truncate text-sm text-gray-500">{item.author}</p>
        )}

        {/* 평점 및 리뷰 수 표시 */}
        {(item.rating || item.reviews) && (
          <div className="mt-2 flex items-center gap-2 text-[13px] text-gray-600">
            {item.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-yellow-500" />
                <span>{formatRating(item.rating)}</span>
              </div>
            )}
            {item.rating && item.reviews && <span>·</span>}
            {item.reviews && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>{item.reviews}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 삭제 버튼 (최근 검색어에만 표시) */}
      {onDelete && (
        <button
          className="absolute top-1/2 right-4 flex-shrink-0 -translate-y-1/2 transform cursor-pointer rounded-full p-1.5 text-gray-400 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-110 hover:bg-gray-900 hover:text-white hover:shadow-md focus:ring-2 focus:ring-gray-300 focus:outline-none"
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
