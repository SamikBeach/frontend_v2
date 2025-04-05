'use client';

import { CommandItem } from '@/components/ui/command';
import { BookOpen, MessageSquare, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import { DeleteButton } from './DeleteButton';

interface AuthorItemProps {
  author: any;
  onOpenChange: (open: boolean) => void;
  onClick: () => void;
  onDelete?: () => void;
  searchValue?: string;
}

export function AuthorItem({
  author,
  onOpenChange,
  onClick,
  onDelete,
  searchValue = '',
}: AuthorItemProps) {
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
      value={author.nameInKor}
      onSelect={handleClick}
      className="group relative cursor-pointer data-[highlighted]:bg-gray-50"
    >
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
        <Image
          src={
            author.imageUrl || `https://picsum.photos/seed/${author.id}/200/200`
          }
          alt={author.nameInKor}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
      <div className="flex h-16 flex-1 flex-col justify-between py-1 pl-2">
        <div className="flex flex-col gap-1">
          <h4 className="text-sm font-medium text-gray-900">
            {highlightText(author.nameInKor)}
          </h4>
          <p className="text-xs text-gray-500">
            {highlightText(author.name || '')}
          </p>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <span className="flex items-center gap-0.5 text-xs">
            <ThumbsUp className="h-3 w-3" />
            {author.likeCount || 0}
          </span>
          <span className="flex items-center gap-0.5 text-xs">
            <MessageSquare className="h-3 w-3" />
            {author.reviewCount || 0}
          </span>
          <span className="flex items-center gap-0.5 text-xs">
            <BookOpen className="h-3 w-3" />
            {author.bookCount || 0}
          </span>
        </div>
      </div>
      {onDelete && <DeleteButton onClick={onDelete} />}
    </CommandItem>
  );
}
