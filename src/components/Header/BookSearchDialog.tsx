'use client';

import { Command, CommandInput } from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog';
import { useDebounce } from '@/hooks/useDebounce';
import { useRef, useState } from 'react';
import { SearchResults } from './SearchResults';

interface BookSearchDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  searchBarRef: React.RefObject<HTMLDivElement>;
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

  // Dialog close 핸들러
  const handleClose = () => {
    setIsOpen(false);
    setQuery('');
  };

  // 검색 아이템 클릭 핸들러
  const handleItemClick = () => {
    handleClose();
    // 실제 구현에서는 여기서 해당 도서 페이지로 이동
    console.log('Item clicked');
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
          <div
            className="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-black/5 transition-all"
            style={{
              width: '100%',
              animation: isOpen ? 'expandDown 200ms ease-out forwards' : 'none',
            }}
          >
            <Command className="border-0 shadow-none">
              <div className="sticky top-0 z-10 border-b border-gray-100 bg-white">
                <CommandInput
                  ref={inputRef}
                  value={query}
                  onValueChange={setQuery}
                  className="h-10 rounded-none border-0 text-sm shadow-none focus:ring-0"
                  placeholder="도서 제목을 검색해보세요"
                />
              </div>
              <div className="max-h-[70vh] overflow-y-auto py-2">
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
      <style jsx global>{`
        @keyframes expandDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
            max-height: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            max-height: 80vh;
          }
        }
      `}</style>
    </Dialog>
  );
}
