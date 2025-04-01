'use client';

import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export function SearchBar() {
  return (
    <Button
      variant="outline"
      className="w-60 cursor-pointer justify-start rounded-full text-gray-400 transition-[width] duration-300 hover:text-gray-400 max-md:w-[50vw]"
    >
      <Search className="mr-2 h-5 w-5" />
      <span className="truncate">검색어를 입력하세요</span>
    </Button>
  );
}
