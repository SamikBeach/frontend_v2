'use client';

import { Book } from '@/apis/book/types';
import { Command, CommandInput } from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog';
import { useQueryParams } from '@/hooks';
import { useDebounce } from '@/hooks/useDebounce';
import { MutableRefObject, Suspense, useRef, useState } from 'react';
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
  // query가 공백이고 최근 검색어 보기 모드일 때는 API 호출을 하지 않음
  const { data } = useSearchQuery(query);
  const isLoading = !data && !!query.trim();

  return (
    <SearchResults
      query={query}
      view={view}
      onItemClick={onItemClick}
      onOpenChange={onOpenChange}
      setQuery={setQuery}
      searchResults={data?.books || []}
      isLoading={isLoading}
    />
  );
}

export function BookSearchDialog({
  isOpen,
  setIsOpen,
  searchBarRef,
  overlayClassName = 'bg-transparent',
}: BookSearchDialogProps) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const { updateQueryParams } = useQueryParams();

  // 다이얼로그 닫기 핸들러
  const handleClose = () => {
    setIsOpen(false);
  };

  // 검색 아이템 클릭 핸들러
  const handleItemClick = (item: any) => {
    // 책 정보로 변환
    const book: Book = {
      id: item.id,
      title: item.title,
      author: item.author || item.subtitle,
      coverImage:
        item.image || `https://picsum.photos/seed/book${item.id}/240/360`,
      category: item.category || 'general',
      subcategory: item.subcategory || 'general',
      rating: item.rating || 4.5,
      reviews: item.reviews || 120,
      description: item.description || `${item.title}에 대한 설명입니다.`,
      publishDate: item.publishDate || '2023-01-01',
      publisher: item.publisher || '출판사',
      isbn: item.isbn || '',
      isbn13: item.isbn13 || '',
    };

    // 북 다이얼로그 대신 URL 파라미터만 업데이트
    updateQueryParams({ book: book.id.toString() });
    handleClose();
  };

  // 검색 결과 또는 최근 검색 표시 여부
  const view = debouncedQuery ? 'results' : 'recent';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogPortal>
        <DialogOverlay
          className={`data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 ${overlayClassName}`}
          onClick={handleClose}
        />
        <DialogContent
          className="fixed top-[6px] left-1/2 z-50 w-[600px] max-w-[600px] -translate-x-1/2 translate-y-0 gap-1 overflow-visible border-none bg-transparent p-0 shadow-none outline-none max-md:top-0 max-md:h-full max-md:w-full"
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
            className="animate-expandDown overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5 transition-all"
            style={{
              width: '100%',
            }}
          >
            <Command className="border-0 shadow-none">
              <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
                <CommandInput
                  ref={inputRef}
                  value={query}
                  onValueChange={setQuery}
                  className="h-14 rounded-none border-0 text-sm shadow-none focus:ring-0"
                  placeholder="도서 제목을 검색해보세요"
                />
              </div>
              <div className="max-h-[80vh] overflow-y-auto py-2">
                <Suspense
                  fallback={
                    <div className="flex h-[300px] items-center justify-center">
                      로딩 중...
                    </div>
                  }
                >
                  <SearchResultsLoader
                    query={debouncedQuery}
                    view={view}
                    onItemClick={handleItemClick}
                    onOpenChange={setIsOpen}
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
