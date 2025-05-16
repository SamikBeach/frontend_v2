'use client';

import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BookSearchDialog } from './BookSearchDialog';

// 중복 키 이벤트 처리 방지를 위한 플래그
let isHandlingKeyPress = false;

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchBarRef = useRef<HTMLDivElement | null>(null);

  // 키보드 단축키 설정 ('/')
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // 입력 필드가 포커스된 상태인지 확인 (입력 필드에 입력 중인 경우 무시)
      const isInputFocused =
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA';

      // 검색 다이얼로그가 이미 열려있거나, 입력 중인 상태라면 무시
      if (
        isOpen ||
        isInputFocused ||
        isHandlingKeyPress ||
        e.key !== '/' ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey
      ) {
        return;
      }

      isHandlingKeyPress = true;
      e.preventDefault(); // '/'가 입력되는 것을 방지
      setIsOpen(true);

      // 다음 프레임에서 플래그 초기화
      requestAnimationFrame(() => {
        isHandlingKeyPress = false;
      });
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <div
        ref={searchBarRef}
        className={cn(
          'flex cursor-pointer items-center rounded-full border',
          // 모바일 (sm 이하)
          'h-10 w-10 justify-center border-gray-200 bg-gray-50 sm:w-auto sm:px-4 sm:justify-start',
          // 데스크톱 (sm 초과)
          'sm:gap-2 sm:text-sm sm:text-gray-500 sm:transition-all sm:duration-300',
          isOpen && 'bg-white sm:w-[600px]',
          !isOpen && 'sm:w-64 sm:hover:border-gray-300 sm:hover:bg-gray-100',
          isFocused && !isOpen && 'border-gray-300'
        )}
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
        <span className="hidden sm:flex sm:flex-1 sm:items-center sm:truncate">
          <kbd className="mr-1.5 rounded bg-gray-100 px-1.5 py-0.5 font-sans text-xs text-gray-400">
            /
          </kbd>
          <span>를 눌러 검색하기</span>
        </span>
      </div>

      <BookSearchDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        searchBarRef={searchBarRef}
      />
    </>
  );
}
