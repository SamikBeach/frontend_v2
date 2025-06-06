import { Command, CommandInput } from '@/components/ui/command';
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogPortal,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { useBookDetailOpen } from '@/hooks/useBookDetailOpen';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, X } from 'lucide-react';
import { MutableRefObject, Suspense, useEffect, useRef, useState } from 'react';
import { SearchResults } from './SearchResults';
import { useSearchQuery } from './hooks';

interface BookSearchDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  searchBarRef?: MutableRefObject<HTMLDivElement | null>;
  overlayClassName?: string;
}

// 검색 결과를 로드하는 컴포넌트 (서스펜스로 감싸기 위함)
function SearchResultsLoader({
  query,
  view,
  onItemClick,
  onOpenChange,
  setQuery,
}: {
  query: string;
  view: 'recent' | 'results';
  onItemClick: (item: any) => void;
  onOpenChange: (open: boolean) => void;
  setQuery: (query: string) => void;
}) {
  // 디바운스된 쿼리를 사용하여 API 호출
  const debouncedQuery = useDebounce(query, 300);
  const { data, isFetching, fetchNextPage, hasNextPage } =
    useSearchQuery(debouncedQuery);

  // 디바운싱 중인지 확인 (현재 입력 중인 쿼리와 디바운스된 쿼리가 다르면 디바운싱 중)
  const isDebouncing =
    query.trim() !== debouncedQuery.trim() && query.trim() !== '';

  // 검색 결과를 하나의 배열로 변환
  const searchResults = data?.pages.flatMap(page => page.books) || [];

  // 총 검색 결과 수 (첫 번째 페이지의 total 값)
  const totalResults = data?.pages[0]?.total || 0;

  // 스크롤 핸들러
  const handleLoadMore = () => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  return (
    <SearchResults
      query={query}
      view={view}
      onItemClick={onItemClick}
      onOpenChange={onOpenChange}
      setQuery={setQuery}
      searchResults={searchResults}
      isLoading={isFetching || isDebouncing}
      onLoadMore={handleLoadMore}
      hasNextPage={hasNextPage}
      totalResults={totalResults}
    />
  );
}

export function BookSearchDialog({ isOpen, setIsOpen }: BookSearchDialogProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const openBookDetail = useBookDetailOpen();
  const isMobile = useIsMobile();

  // Dialog가 닫힐 때 검색어 초기화
  const handleOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);

    if (!isOpen) {
      setQuery('');
    }
  };

  // 검색 아이템 클릭 핸들러
  const handleItemClick = (item: any) => {
    const bookIsbn = item.isbn13 || item.isbn || '';
    openBookDetail(bookIsbn);
    if (isMobile) {
      setIsOpen(false);
      setQuery('');
    }
  };

  // 검색 결과 또는 최근 검색 표시 여부
  const view = query ? 'results' : 'recent';

  useEffect(() => {
    if (isOpen) {
      queryClient.invalidateQueries({ queryKey: ['search', 'recent'] });
    }
  }, [isOpen, queryClient]);

  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={handleOpenChange}
      shouldScaleBackground={false}
    >
      <ResponsiveDialogPortal>
        <ResponsiveDialogContent
          className={cn(
            'animate-expandDown fixed top-[6px] left-1/2 max-w-[calc(100vw-32px)] min-w-[800px] -translate-x-1/2 translate-y-0 gap-1 overflow-visible border-none bg-transparent p-0 shadow-none outline-none max-md:top-[16px] max-md:h-[calc(100vh-80px)] max-md:w-full',
            query && 'md:h-[calc(100vh-100px)]'
          )}
          drawerClassName="h-[100dvh] animate-expandUp flex min-h-0 w-full max-w-none flex-col gap-1 overflow-hidden p-0 shadow-none outline-none z-[100]"
          dialogOverlayClassName="bg-black/5"
          drawerOverlayClassName="bg-black/5"
        >
          <ResponsiveDialogTitle className="sr-only" drawerClassName="sr-only">
            도서 검색
          </ResponsiveDialogTitle>
          <div
            className={cn(
              'animate-expandDown flex h-full w-full flex-col overflow-hidden rounded-xl bg-white p-4 ring-1 ring-black/5 transition-all max-md:h-full max-md:rounded-none max-md:px-2 max-md:pt-2 max-md:pb-0 max-md:ring-0'
            )}
          >
            <div className="flex h-full flex-col overflow-hidden">
              <Command
                className="flex h-full flex-col overflow-hidden rounded-none border-0 shadow-none"
                shouldFilter={false}
                loop={true}
              >
                <CommandInput
                  ref={inputRef}
                  value={query}
                  onValueChange={setQuery}
                  className="h-12 rounded-none border-0 py-3 text-base shadow-none focus:ring-0 md:h-16 md:py-4"
                  placeholder="도서 제목을 검색해보세요"
                  autoFocus
                />
                <div className="min-h-0 flex-1 overflow-hidden">
                  <Suspense
                    fallback={
                      <div className="flex h-full min-h-0 w-full flex-col">
                        <div className="flex flex-1 items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                        </div>
                      </div>
                    }
                  >
                    <div className="h-full overflow-y-auto">
                      <SearchResultsLoader
                        query={query}
                        view={view}
                        onItemClick={handleItemClick}
                        onOpenChange={handleOpenChange}
                        setQuery={setQuery}
                      />
                    </div>
                  </Suspense>
                </div>
              </Command>
            </div>
          </div>
          <ResponsiveDialogClose
            className="absolute top-6 right-6 flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm text-gray-400 transition-colors hover:text-gray-600 focus:outline-none"
            drawerClassName="absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm text-gray-400 transition-colors hover:text-gray-600 focus:outline-none z-30"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </ResponsiveDialogClose>
        </ResponsiveDialogContent>
      </ResponsiveDialogPortal>
    </ResponsiveDialog>
  );
}
