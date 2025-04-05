'use client';

import { CommandItem } from '@/components/ui/command';
import { X } from 'lucide-react';
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
            <span key={index} className="font-medium text-blue-600">
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
      className="group relative flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50"
      onSelect={onClick}
    >
      {/* 이미지 섬네일 */}
      {item.image && (
        <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <span className="text-xl text-gray-300">📖</span>
          </div>
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
      )}

      {/* 도서 정보 */}
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-base font-medium text-gray-900 group-hover:text-blue-600">
          {highlightText(item.title, item.highlight)}
        </h4>
        {item.subtitle && (
          <p className="mt-0.5 truncate text-sm text-gray-500">
            {item.subtitle}
          </p>
        )}
        {item.author && (
          <p className="mt-1 truncate text-xs text-gray-400">{item.author}</p>
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
