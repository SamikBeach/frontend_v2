'use client';

import { SearchResult } from '@/apis/search/types';
import { CommandEmpty, CommandGroup } from '@/components/ui/command';
import { Clock, Loader2 } from 'lucide-react';
import { Suspense, useRef } from 'react';
import { PopularSearchList } from './PopularSearchList';
import { RecentSearchList } from './RecentSearchList';
import { SearchItem } from './SearchItem';
import {
  useDeleteAllRecentSearches,
  useDeleteRecentSearch,
  useLogBookSelection,
  usePopularSearches,
  useRecentSearches,
} from './hooks';

interface SearchResultsProps {
  query: string;
  view: 'recent' | 'results';
  onItemClick: (item: any) => void;
  onOpenChange: (open: boolean) => void;
  setQuery: (query: string) => void;
  searchResults: SearchResult[];
  isLoading: boolean;
}

// 최근 검색어 컴포넌트
function RecentSearches({
  onItemClick,
  onOpenChange,
  setQuery,
}: Pick<SearchResultsProps, 'onItemClick' | 'onOpenChange' | 'setQuery'>) {
  const { data: recentSearchData } = useRecentSearches();
  const { mutate: deleteAllRecentSearches } = useDeleteAllRecentSearches();
  const { mutate: deleteRecentSearch } = useDeleteRecentSearch();

  const recentSearches = recentSearchData?.recentSearches || [];

  return (
    <div>
      {/* 최근 검색 목록 */}
      {recentSearches.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between px-4">
            <h3 className="flex items-center text-sm font-medium text-gray-700">
              <Clock className="mr-2 h-4 w-4 text-gray-500" />
              최근 검색 기록
            </h3>
            <button
              className="cursor-pointer text-xs text-gray-600 hover:text-gray-900 hover:underline"
              onClick={() => deleteAllRecentSearches()}
            >
              전체 삭제
            </button>
          </div>
          <RecentSearchList
            searches={recentSearches}
            onOpenChange={onOpenChange}
            onItemClick={onItemClick}
            onDeleteSearch={searchId => {
              // 특정 검색어 삭제
              deleteRecentSearch(searchId);
            }}
          />
        </div>
      )}

      {/* 인기 검색어 */}
      <Suspense fallback={<PopularSearchesSkeleton />}>
        <PopularSearchesContent
          onSearchClick={term => {
            setQuery(term);
          }}
        />
      </Suspense>
    </div>
  );
}

// 인기 검색어 스켈레톤
function PopularSearchesSkeleton() {
  return (
    <CommandGroup className="pt-4">
      <div className="mb-2 px-4">
        <h3 className="flex items-center text-sm font-medium text-gray-700">
          인기 검색어 로딩 중...
        </h3>
      </div>
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    </CommandGroup>
  );
}

// 인기 검색어 컴포넌트
function PopularSearchesContent({
  onSearchClick,
}: {
  onSearchClick: (term: string) => void;
}) {
  const { data: popularSearches } = usePopularSearches();

  return (
    <PopularSearchList
      popularSearches={popularSearches}
      onSearchClick={onSearchClick}
    />
  );
}

// 검색 결과 컴포넌트
export function SearchResults({
  query,
  view,
  onItemClick,
  onOpenChange,
  setQuery,
  searchResults,
  isLoading,
}: SearchResultsProps) {
  const { mutate: logSelection } = useLogBookSelection();
  const searchResultsRef = useRef<SearchResult[]>([]);

  // 검색 결과 캐싱
  if (searchResults && searchResults.length > 0) {
    searchResultsRef.current = searchResults;
  }

  // 검색 아이템 클릭 시 검색어 저장
  const handleItemClick = (item: any) => {
    // 책 선택 로그 저장 - 백엔드에서 자동으로 검색어도 함께 저장
    if (query) {
      logSelection({
        term: query,
        bookId: item.id,
        title: item.title,
        author: item.author || '',
        coverImage: item.image || '',
        publisher: item.publisher || '',
        description: item.description || '',
        isbn: item.isbn || '',
        isbn13: item.isbn13 || '',
      });
    }

    // 부모 컴포넌트에 아이템 클릭 이벤트 전달
    onItemClick(item);
  };

  // 최근 검색 화면
  if (view === 'recent') {
    return (
      <RecentSearches
        onItemClick={handleItemClick}
        onOpenChange={onOpenChange}
        setQuery={setQuery}
      />
    );
  }

  // 검색 결과 로딩 중
  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
      </div>
    );
  }

  const hasResults = searchResultsRef.current.length > 0;

  // 검색 결과 없음
  if (!hasResults) {
    return (
      <CommandEmpty className="flex flex-col items-center justify-center py-14">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <span className="text-2xl">📚</span>
        </div>
        <p className="mt-4 mb-1 text-base font-medium text-gray-800">
          검색 결과가 없습니다
        </p>
        <p className="text-sm text-gray-500">다른 검색어로 시도해보세요</p>
      </CommandEmpty>
    );
  }

  // 검색 결과 목록
  return (
    <>
      <CommandGroup className="pb-2">
        <div className="mb-2 px-4">
          <h3 className="flex items-center text-sm font-medium text-gray-700">
            &ldquo;{query}&rdquo; 검색 결과
          </h3>
        </div>
        {searchResultsRef.current.map(book => {
          // API 검색 결과를 UI 표시 모델로 변환
          const searchItem = {
            id: book.id,
            type: 'book',
            title: book.title,
            author: book.author,
            image: book.coverImage || '/images/no-image.png',
            highlight: query,
            rating: book.rating,
            reviews: book.reviews || book.reviewCount,
            isbn: book.isbn || '',
            isbn13: book.isbn13 || '',
          };

          return (
            <SearchItem
              key={`book-${book.title}`}
              item={searchItem}
              onClick={() => handleItemClick(searchItem)}
            />
          );
        })}
      </CommandGroup>
    </>
  );
}
