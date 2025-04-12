'use client';

import { RecentSearch } from '@/apis/search/types';
import { CommandGroup } from '@/components/ui/command';
import { SearchItem } from './SearchItem';

interface RecentSearchListProps {
  searches: RecentSearch[];
  onOpenChange: (open: boolean) => void;
  onItemClick: (item: any) => void;
  onDeleteSearch: (term: string) => void;
}

export function RecentSearchList({
  searches,
  onOpenChange,
  onItemClick,
  onDeleteSearch,
}: RecentSearchListProps) {
  return (
    <CommandGroup heading="최근 검색">
      {searches.map((search, index) => {
        // Map the API search model to the UI search item model
        const searchItem = {
          id: search.bookId || index,
          type: 'book',
          title: search.title || search.term,
          author: search.author,
          image: search.coverImage,
          subtitle: search.author,
        };

        return (
          <SearchItem
            key={`${search.term}-${index}`}
            item={searchItem}
            onClick={() => {
              onItemClick(searchItem);
              onOpenChange(false);
            }}
            onDelete={() => onDeleteSearch(search.term)}
          />
        );
      })}
    </CommandGroup>
  );
}
