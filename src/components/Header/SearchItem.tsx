'use client';

import { CommandItem } from '@/components/ui/command';
import { MessageSquare, Star, X } from 'lucide-react';
import Image from 'next/image';

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
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="112px"
          />
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
                <span>{item.rating.toFixed(1)}</span>
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
          className="absolute top-1/2 right-4 flex-shrink-0 -translate-y-1/2 rounded-full p-1 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-600"
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </CommandItem>
  );
}
