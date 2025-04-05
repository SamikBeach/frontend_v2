'use client';

import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BookSearchDialog } from './BookSearchDialog';

// 중복 키 이벤트 처리 방지를 위한 플래그
let isHandlingKeyPress = false;

interface SearchBarProps {
  overlayClassName?: string;
}

export function SearchBar({
  overlayClassName = 'bg-black/10',
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);

  // 키보드 단축키 설정 ('/')
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.key === '/' &&
        !isOpen &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        !isHandlingKeyPress
      ) {
        isHandlingKeyPress = true;
        e.preventDefault();
        setIsOpen(true);

        // 다음 프레임에서 플래그 초기화
        requestAnimationFrame(() => {
          isHandlingKeyPress = false;
        });
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // 다이얼로그가 열릴 때 검색바 스타일 변경
  const searchBarClasses = cn(
    'flex cursor-pointer items-center gap-2 rounded-full border px-4 text-sm text-gray-500 transition-all duration-300',
    isOpen
      ? 'h-10 w-[600px] border-gray-200 bg-white max-md:w-[90%]'
      : 'h-10 w-64 border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100 max-md:w-48 max-sm:w-10 max-sm:px-0 max-sm:justify-center',
    isFocused && !isOpen && 'border-gray-300'
  );

  return (
    <>
      <div
        ref={searchBarRef}
        className={searchBarClasses}
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(true)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsOpen(true);
          }
        }}
      >
        <Search className="h-4 w-4 flex-shrink-0 text-gray-400" />
        <span className="flex-1 truncate max-sm:hidden">
          {isOpen ? '도서 제목을 검색해보세요' : '/를 눌러 검색하기'}
        </span>
        {!isOpen && (
          <kbd className="hidden rounded bg-gray-100 px-1.5 py-0.5 font-sans text-xs text-gray-400 md:inline-block">
            /
          </kbd>
        )}
      </div>

      <BookSearchDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        searchBarRef={searchBarRef}
        overlayClassName={overlayClassName}
      />
    </>
  );
}
