'use client';

import { CommandGroup } from '@/components/ui/command';
import { AuthorItem } from './AuthorItem';
import { BookItem } from './BookItem';

interface RecentSearchListProps {
  searches: any[];
  onOpenChange: (open: boolean) => void;
}

export function RecentSearchList({
  searches,
  onOpenChange,
}: RecentSearchListProps) {
  // 검색 히스토리 삭제 핸들러 (실제로는 API 호출 필요)
  const handleDelete = (searchId: number) => {
    console.log('검색 기록 삭제:', searchId);
  };

  return (
    <CommandGroup heading="최근 검색">
      {searches.map(search => {
        if (search.book) {
          return (
            <BookItem
              key={search.id}
              book={search.book}
              onOpenChange={onOpenChange}
              onClick={() => console.log('책 선택:', search.book?.id)}
              onDelete={() => handleDelete(search.id)}
            />
          );
        }
        if (search.author) {
          return (
            <AuthorItem
              key={search.id}
              author={search.author}
              onOpenChange={onOpenChange}
              onClick={() => console.log('작가 선택:', search.author?.id)}
              onDelete={() => handleDelete(search.id)}
            />
          );
        }
        return null;
      })}
    </CommandGroup>
  );
}
