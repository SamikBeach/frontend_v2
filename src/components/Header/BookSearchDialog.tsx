'use client';

import { Book } from '@/components/BookCard';
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
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { SearchResults } from './SearchResults';

interface BookSearchDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  searchBarRef: MutableRefObject<HTMLDivElement | null>;
  overlayClassName?: string;
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

  // isOpen 상태가 변경될 때 검색어 초기화
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  // Dialog close 핸들러
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
      category: 'book',
      subcategory: 'general',
      rating: item.rating || 4.5,
      reviews: item.reviews || 120,
      description: `${item.title}에 대한 설명입니다.`,
      publishDate: '2023-01-01',
      publisher: '출판사',
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
                <SearchResults
                  query={debouncedQuery}
                  view={view}
                  onItemClick={handleItemClick}
                />
              </div>
            </Command>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
