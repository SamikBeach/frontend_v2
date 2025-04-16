'use client';

import { Command, CommandInput } from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDialogQuery } from '@/hooks';
import { useDebounce } from '@/hooks/useDebounce';
import { useQueryClient } from '@tanstack/react-query';
import { MutableRefObject, Suspense, useEffect, useRef, useState } from 'react';
import { SearchResults } from './SearchResults';
import { useSearchQuery } from './hooks';

interface BookSearchDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  searchBarRef: MutableRefObject<HTMLDivElement | null>;
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
  const { data, isFetching } = useSearchQuery(debouncedQuery);

  // 디바운싱 중인지 확인 (현재 입력 중인 쿼리와 디바운스된 쿼리가 다르면 디바운싱 중)
  const isDebouncing =
    query.trim() !== debouncedQuery.trim() && query.trim() !== '';

  return (
    <SearchResults
      query={query}
      view={view}
      onItemClick={onItemClick}
      onOpenChange={onOpenChange}
      setQuery={setQuery}
      searchResults={data?.books || []}
      isLoading={isFetching || isDebouncing}
    />
  );
}

export function BookSearchDialog({
  isOpen,
  setIsOpen,
  overlayClassName = 'bg-transparent',
}: BookSearchDialogProps) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const { open: openBookDialog } = useDialogQuery({ type: 'book' });
  const queryClient = useQueryClient();

  // 다이얼로그 닫기 핸들러
  const handleClose = () => {
    setIsOpen(false);
    setQuery(''); // 검색어 초기화
  };

  // Dialog가 닫힐 때 검색어 초기화
  const handleOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (!isOpen) {
      setQuery(''); // 검색어 초기화
    }
  };

  // 검색 아이템 클릭 핸들러
  const handleItemClick = (item: any) => {
    // isbn13을 우선적으로 사용하고, 없으면 isbn 사용
    const bookIsbn = item.isbn13 || item.isbn || '';
    openBookDialog(bookIsbn);
    handleClose();
  };

  // 검색 결과 또는 최근 검색 표시 여부
  const view = query ? 'results' : 'recent';

  // 다이얼로그가 열릴 때 최근 검색어 데이터를 다시 가져오도록 수정
  useEffect(() => {
    if (isOpen) {
      queryClient.invalidateQueries({ queryKey: ['search', 'recent'] });
    }
  }, [isOpen, queryClient]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogOverlay
          className={`data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 ${overlayClassName}`}
          onClick={handleClose}
        />
        <DialogContent
          className={`fixed top-[6px] left-1/2 z-50 w-[800px] max-w-[800px] ${query ? 'h-[800px] max-h-[800px]' : 'max-h-[800px]'} -translate-x-1/2 translate-y-0 gap-1 overflow-visible border-none bg-transparent p-0 shadow-none outline-none max-md:top-0 max-md:h-full max-md:w-full`}
          overlayClassName={overlayClassName}
          closeClassName="hidden"
          onOpenAutoFocus={e => {
            e.preventDefault();
            setTimeout(() => {
              inputRef.current?.focus();
            }, 100);
          }}
        >
          <DialogTitle className="sr-only">도서 검색</DialogTitle>
          <div
            className={`animate-expandDown flex ${query ? 'h-full' : 'auto'} flex-col overflow-hidden rounded-xl bg-white p-4 shadow-lg ring-1 ring-black/5 transition-all`}
            style={{
              width: '100%',
            }}
          >
            <Command
              className={`flex ${query ? 'flex-1' : ''} flex-col border-0 shadow-none`}
            >
              <div className="sticky top-0 z-10 flex-shrink-0 border-b border-gray-200 bg-white">
                <CommandInput
                  ref={inputRef}
                  value={query}
                  onValueChange={setQuery}
                  className="h-16 rounded-none border-0 py-4 text-base shadow-none focus:ring-0"
                  placeholder="도서 제목을 검색해보세요"
                />
              </div>
              <div
                className={`scrollbar-gutter-stable ${query ? 'flex-1' : ''} overflow-y-auto pt-4 pr-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent`}
              >
                <Suspense
                  fallback={
                    <div className="flex h-[600px] items-center justify-center">
                      로딩 중...
                    </div>
                  }
                >
                  <SearchResultsLoader
                    query={query}
                    view={view}
                    onItemClick={handleItemClick}
                    onOpenChange={handleOpenChange}
                    setQuery={setQuery}
                  />
                </Suspense>
              </div>
            </Command>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
