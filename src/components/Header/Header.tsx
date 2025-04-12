'use client';

import { SearchBar } from '@/components/SearchBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { LeftSlot } from './LeftSlot';
import { RightSlot } from './RightSlot';

export function Header() {
  const isMobile = useIsMobile();

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 flex min-h-[56px] items-center justify-between border-b border-gray-200/50 bg-white ${
        isMobile ? 'px-2' : 'px-4'
      }`}
    >
      <div className="flex items-center gap-1">
        <LeftSlot />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:hidden sm:block">
        <SearchBar />
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden max-sm:block">
          <SearchBar />
        </div>
        <RightSlot />
      </div>
    </header>
  );
}
