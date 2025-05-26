import { SearchResult } from '@/apis/search/types';
import { CommandEmpty, CommandGroup } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Command as CommandPrimitive } from 'cmdk';
import { Clock, Loader2 } from 'lucide-react';
import { Suspense, useEffect, useRef } from 'react';
import {
  useDeleteAllRecentSearches,
  useDeleteRecentSearch,
  useLogBookSelection,
  usePopularSearches,
  useRecentSearches,
} from './hooks';
import { PopularSearchList } from './PopularSearchList';
import { RecentSearchList } from './RecentSearchList';
import { SearchItem } from './SearchItem';

interface SearchResultsProps {
  query: string;
  view: 'recent' | 'results';
  onItemClick: (item: any) => void;
  onOpenChange: (open: boolean) => void;
  setQuery: (query: string) => void;
  searchResults: SearchResult[];
  isLoading: boolean;
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  totalResults?: number;
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

  const recentSearches = recentSearchData?.books || [];

  return (
    <CommandPrimitive.List
      className={cn(
        'h-full !max-h-none overflow-y-auto pr-0',
        'md:[&::-webkit-scrollbar]:w-2 md:[&::-webkit-scrollbar-thumb]:rounded-full md:[&::-webkit-scrollbar-thumb]:bg-gray-200 md:[&::-webkit-scrollbar-track]:bg-transparent'
      )}
    >
      {/* 최근 검색 목록 */}
      <div>
        <div className="mb-2 flex items-center justify-between px-4 pt-2">
          <h3 className="flex items-center text-sm font-medium text-gray-700">
            <Clock className="mr-2 h-4 w-4 text-gray-500" />
            최근 검색 기록
          </h3>
          {recentSearches.length > 0 && (
            <button
              className="cursor-pointer text-xs text-gray-600 hover:text-gray-900 hover:underline"
              onClick={() => deleteAllRecentSearches()}
            >
              전체 삭제
            </button>
          )}
        </div>

        {recentSearches.length > 0 ? (
          <RecentSearchList
            searches={recentSearches}
            onOpenChange={onOpenChange}
            onItemClick={onItemClick}
            onDeleteSearch={searchId => {
              // 특정 검색어 삭제
              deleteRecentSearch(searchId);
            }}
          />
        ) : (
          <div className="flex h-32 flex-col items-center justify-center px-4 py-6 text-center">
            <p className="text-sm text-gray-500">최근 검색 기록이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 인기 검색어 */}
      <Suspense fallback={<PopularSearchesSkeleton />}>
        <PopularSearchesContent
          onSearchClick={term => {
            setQuery(term);
          }}
        />
      </Suspense>
    </CommandPrimitive.List>
  );
}

// 인기 검색어 스켈레톤
function PopularSearchesSkeleton() {
  return (
    <CommandGroup>
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
  onLoadMore,
  hasNextPage,
  totalResults,
}: SearchResultsProps) {
  const { mutate: logSelection } = useLogBookSelection();
  const listRef = useRef<HTMLDivElement>(null);

  // 검색 아이템 클릭 시 검색어 저장
  const handleItemClick = (item: any) => {
    // 책 선택 로그 저장 - 백엔드에서 자동으로 검색어도 함께 저장
    if (query) {
      logSelection({
        term: query,
        bookId: item.bookId,
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

  // 스크롤 이벤트 처리
  useEffect(() => {
    if (view !== 'results' || !onLoadMore || !hasNextPage) return;

    const listElement = listRef.current;
    if (!listElement) return;

    const handleScroll = () => {
      if (!listElement) return;

      // 스크롤이 바닥에 도달했는지 확인 (바닥에서 50px 위까지 스크롤되면 로드)
      const scrollBottom =
        listElement.scrollHeight -
        listElement.scrollTop -
        listElement.clientHeight;
      if (scrollBottom < 200 && hasNextPage && !isLoading) {
        onLoadMore();
      }
    };

    listElement.addEventListener('scroll', handleScroll);
    return () => {
      listElement.removeEventListener('scroll', handleScroll);
    };
  }, [view, onLoadMore, hasNextPage, isLoading]);

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

  // 검색 결과 로딩 중 (첫 로딩만 전체 화면 로딩 표시)
  if (isLoading && searchResults.length === 0) {
    return (
      <CommandPrimitive.List
        ref={listRef}
        className={cn(
          'h-full !max-h-none overflow-y-auto',
          'md:[&::-webkit-scrollbar]:w-2 md:[&::-webkit-scrollbar-thumb]:rounded-full md:[&::-webkit-scrollbar-thumb]:bg-gray-200 md:[&::-webkit-scrollbar-track]:bg-transparent'
        )}
      >
        <div className="flex h-full min-h-[400px] w-full items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        </div>
      </CommandPrimitive.List>
    );
  }

  // 검색어 입력 후 결과가 없는 경우에만 없음 메시지 표시
  const hasNoResults = searchResults.length === 0 && query.trim() !== '';

  // 검색 결과 없음
  if (hasNoResults) {
    return (
      <CommandEmpty className="py-6 text-center">
        <div className="flex h-full min-h-[400px] w-full items-center justify-center">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <span className="text-4xl">📚</span>
            </div>
            <p className="mb-3 text-xl font-medium text-gray-800">
              검색 결과가 없습니다
            </p>
            <p className="text-sm text-gray-500">다른 검색어로 시도해보세요</p>
          </div>
        </div>
      </CommandEmpty>
    );
  }

  // 검색 결과 목록
  return (
    <CommandPrimitive.List
      ref={listRef}
      className={cn(
        'h-full !max-h-none overflow-y-auto',
        'md:[&::-webkit-scrollbar]:w-2 md:[&::-webkit-scrollbar-thumb]:rounded-full md:[&::-webkit-scrollbar-thumb]:bg-gray-200 md:[&::-webkit-scrollbar-track]:bg-transparent'
      )}
    >
      {/* 검색 결과 헤더 */}
      <div className="sticky top-0 z-10 bg-white px-4 py-2 text-xs font-medium text-gray-500">
        &ldquo;{query}&rdquo; 검색 결과
        {totalResults ? ` (${totalResults})` : ''}
      </div>

      <CommandGroup>
        {searchResults.map(book => {
          // ISBN13 또는 ISBN을 우선 사용하고, 둘 다 없는 경우 인덱스를 포함한 고유 키 생성
          const bookKey =
            (book?.isbn13 ?? '') + (book?.isbn ?? '') + book.title;

          return (
            <SearchItem
              key={bookKey}
              item={{
                id: book.id,
                bookId: book.bookId,
                type: 'book',
                title: book.title,
                author: book.author,
                image: book.coverImage
                  ? book.coverImage.replace(/^https?:\/\//, '//')
                  : undefined,
                coverImage: book.coverImage
                  ? book.coverImage.replace(/^https?:\/\//, '//')
                  : undefined,
                highlight: query,
                rating: book.rating,
                reviews: book.reviews,
                totalRatings: book.totalRatings,
                isbn: book.isbn || '',
                isbn13: book.isbn13 || '',
                readingStats: book.readingStats,
                userReadingStatus: book.userReadingStatus,
                userRating: book.userRating,
              }}
              onClick={() =>
                handleItemClick({
                  id: book.id,
                  bookId: book.bookId,
                  title: book.title,
                  author: book.author,
                  image: book.coverImage,
                  coverImage: book.coverImage,
                  isbn: book.isbn,
                  isbn13: book.isbn13,
                  rating: book.rating,
                  reviews: book.reviews,
                  totalRatings: book.totalRatings,
                  readingStats: book.readingStats,
                  userReadingStatus: book.userReadingStatus,
                })
              }
            />
          );
        })}
        {isLoading && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        )}
      </CommandGroup>
    </CommandPrimitive.List>
  );
}
