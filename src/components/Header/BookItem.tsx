'use client';

import { CommandItem } from '@/components/ui/command';
import { BookOpen, MessageSquare, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import { DeleteButton } from './DeleteButton';

interface BookItemProps {
  book: any;
  onOpenChange: (open: boolean) => void;
  onClick: () => void;
  onDelete?: () => void;
  searchValue?: string;
}

export function BookItem({
  book,
  onOpenChange,
  onClick,
  onDelete,
  searchValue = '',
}: BookItemProps) {
  const handleClick = () => {
    onClick();
    onOpenChange(false);
    // 실제로는 라우팅하는 코드가 여기 들어가야 함
  };

  // 검색어 하이라이트 기능
  const highlightText = (text: string) => {
    if (!searchValue || !text) return text;

    const parts = text.split(new RegExp(`(${searchValue})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchValue.toLowerCase() ? (
        <span key={i} className="font-bold text-blue-500">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <CommandItem
      value={book.title}
      onSelect={handleClick}
      className="group relative cursor-pointer data-[highlighted]:bg-gray-50"
    >
      <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded-md">
        <Image
          src={book.imageUrl || `https://picsum.photos/seed/${book.id}/200/300`}
          alt={book.title}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
      <div className="flex h-24 flex-1 flex-col justify-between py-1.5 pl-2">
        <div className="flex flex-col gap-1">
          <h4 className="line-clamp-1 text-sm font-medium text-gray-900 max-sm:line-clamp-2">
            {highlightText(book.title)}
          </h4>
          <p className="line-clamp-1 text-xs text-gray-500">
            {highlightText(
              book.authorBooks
                ?.map((ab: any) => ab.author.nameInKor)
                .join(', ') || ''
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <span className="flex items-center gap-0.5 text-xs">
            <ThumbsUp className="h-3 w-3" />
            {book.likeCount || 0}
          </span>
          <span className="flex items-center gap-0.5 text-xs">
            <MessageSquare className="h-3 w-3" />
            {book.reviewCount || 0}
          </span>
          <span className="flex items-center gap-0.5 text-xs">
            <BookOpen className="h-3 w-3" />
            {book.totalTranslationCount || 0}
          </span>
        </div>
      </div>
      {onDelete && <DeleteButton onClick={onDelete} />}
    </CommandItem>
  );
}
