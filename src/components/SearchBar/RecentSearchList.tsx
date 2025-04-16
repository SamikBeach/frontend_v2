'use client';

import { RecentSearch } from '@/apis/search/types';
import { CommandGroup } from '@/components/ui/command';
import { SearchItem } from './SearchItem';

interface RecentSearchListProps {
  searches: RecentSearch[];
  onOpenChange: (open: boolean) => void;
  onItemClick: (item: any) => void;
  onDeleteSearch: (searchId: number) => void;
}

export function RecentSearchList({
  searches,
  onOpenChange,
  onItemClick,
  onDeleteSearch,
}: RecentSearchListProps) {
  return (
    <CommandGroup heading="">
      {searches.map((search, index) => {
        // Map the API search model to the UI search item model
        const searchItem = {
          id: search.bookId || index,
          type: 'book',
          title: search.title || search.term,
          author: search.author,
          image: search.coverImage
            ? search.coverImage.replace(/^https?:\/\//, '//')
            : '/images/no-image.png',
          subtitle: search.author,
          isbn: search.isbn || '',
          isbn13: search.isbn13 || '',
          searchId: search.id,
        };

        return (
          <SearchItem
            key={`${search.term}-${index}`}
            item={searchItem}
            onClick={() => {
              onItemClick(searchItem);
              onOpenChange(false);
            }}
            onDelete={() => {
              // search.id가 존재할 때만 삭제 요청
              if (typeof search.id === 'number') {
                onDeleteSearch(search.id);
              } else {
                console.error('검색어 ID가 정의되지 않았습니다.');
              }
            }}
          />
        );
      })}
    </CommandGroup>
  );
}
