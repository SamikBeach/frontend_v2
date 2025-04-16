'use client';

import { SearchResult } from '@/apis/search/types';
import {
  CommandEmpty,
  CommandGroup,
  CommandList,
} from '@/components/ui/command';
import { Clock, Loader2 } from 'lucide-react';
import { Suspense } from 'react';
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
    <CommandList className="h-full !max-h-none overflow-y-auto pt-4 pr-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent">
      {/* 최근 검색 목록 */}
      {recentSearches.length > 0 && (
        <CommandGroup heading="최근 검색 기록">
          <div className="mb-2 flex items-center justify-between px-2">
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
        </CommandGroup>
      )}

      {/* 인기 검색어 */}
      <Suspense fallback={<PopularSearchesSkeleton />}>
        <PopularSearchesContent
          onSearchClick={term => {
            setQuery(term);
          }}
        />
      </Suspense>
    </CommandList>
  );
}

// 인기 검색어 스켈레톤
function PopularSearchesSkeleton() {
  return (
    <CommandGroup heading="인기 검색어">
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
      <CommandList className="h-full !max-h-none overflow-y-auto pt-4 pr-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent">
        <div className="flex h-[540px] w-full translate-y-20 items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        </div>
      </CommandList>
    );
  }

  // 검색어 입력 후 결과가 없는 경우에만 없음 메시지 표시
  const hasNoResults = searchResults.length === 0 && query.trim() !== '';

  // 검색 결과 없음
  if (hasNoResults) {
    return (
      <CommandList className="h-full !max-h-none overflow-y-auto pt-4 pr-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent">
        <CommandEmpty className="py-6 text-center">
          <div className="flex h-[540px] w-full translate-y-20 items-center justify-center">
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                <span className="text-4xl">📚</span>
              </div>
              <p className="mb-3 text-xl font-medium text-gray-800">
                검색 결과가 없습니다
              </p>
              <p className="text-sm text-gray-500">
                다른 검색어로 시도해보세요
              </p>
            </div>
          </div>
        </CommandEmpty>
      </CommandList>
    );
  }

  // 검색 결과 목록
  return (
    <CommandList className="h-full !max-h-none overflow-y-auto pt-4 pr-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent">
      <CommandGroup heading={`"${query}" 검색 결과`}>
        {searchResults.map((book, index) => {
          // API 검색 결과를 UI 표시 모델로 변환
          const searchItem = {
            id: book.id,
            type: 'book',
            title: book.title,
            author: book.author,
            image: book.coverImage
              ? book.coverImage.replace(/^https?:\/\//, '//')
              : '/images/no-image.png',
            highlight: query,
            rating: book.rating,
            reviews: book.reviews || book.reviewCount,
            isbn: book.isbn || '',
            isbn13: book.isbn13 || '',
          };

          // ISBN13 또는 ISBN을 우선 사용하고, 둘 다 없는 경우 인덱스를 포함한 고유 키 생성
          const bookKey = `book-${index}-${book.id || ''}-${book.isbn13 || ''}-${book.isbn || ''}`;

          return (
            <SearchItem
              key={bookKey}
              item={searchItem}
              onClick={() => handleItemClick(searchItem)}
            />
          );
        })}
      </CommandGroup>
    </CommandList>
  );
}
