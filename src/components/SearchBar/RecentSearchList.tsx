'use client';

import { ReadingStatusType } from '@/apis/reading-status/types';
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
        // RecentSearch 모델을 SearchItem 모델로 매핑
        const searchItem = {
          id: search.bookId || index,
          type: 'book',
          title: search.title || search.term,
          author: search.author,
          image: search.coverImage
            ? search.coverImage.replace(/^https?:\/\//, '//')
            : undefined,
          coverImage: search.coverImage
            ? search.coverImage.replace(/^https?:\/\//, '//')
            : undefined,
          subtitle: search.author,
          isbn: search.isbn || '',
          isbn13: search.isbn13 || '',
          searchId: search.id,
          rating: search.rating,
          reviews: search.reviews,
          totalRatings: search.totalRatings,
          // 읽기 상태 정보가 있는 경우 전달
          readingStats: search.readingStats,
          userReadingStatus: search.userReadingStatus as ReadingStatusType,
        };

        return (
          <SearchItem
            key={`${search.term}-${index}`}
            item={searchItem}
            size="sm"
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
