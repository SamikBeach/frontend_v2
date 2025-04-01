'use client';

import { Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { LeftSlot } from './LeftSlot';
import { RightSlot } from './RightSlot';
import { SearchBar } from './SearchBar';

export function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex min-h-[56px] items-center justify-between border-b-[1px] bg-white px-4">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="hidden max-md:flex">
          <Menu className="h-5 w-5" />
        </Button>
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
