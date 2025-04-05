'use client';

import { Button } from '@/components/ui/button';
import { Command, CommandInput, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { SearchDialogContent } from './SearchDialogContent';

// 임의의 검색 기능을 위한 debounce 함수
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [inputValue, setInputValue] = useState('');

  // 디바운스 검색 함수 생성
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchKeyword(value);
    }, 300),
    [setSearchKeyword]
  );

  // 입력값 변경 핸들러
  const handleChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  // 컴포넌트 언마운트 시 디바운스 함수 취소
  useEffect(() => {
    return () => {
      debouncedSearch.cancel?.();
    };
  }, [debouncedSearch]);

  // 모달이 닫힐 때 상태 초기화
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSearchKeyword('');
      setInputValue('');
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="top-[6px] w-[600px] max-w-[90vw] translate-y-0 gap-1 bg-white p-2 shadow-2xl max-md:top-0 max-md:h-full max-md:w-full"
        onPointerDownOutside={e => e.preventDefault()}
      >
        {open && (
          <Command shouldFilter={false}>
            <DialogTitle className="sr-only">검색</DialogTitle>
            <div className="relative">
              <CommandInput
                className="h-10 w-full border-0 bg-transparent text-sm text-gray-800 focus-visible:ring-0"
                placeholder="책이나 작가를 검색하세요."
                value={inputValue}
                onValueChange={handleChange}
              />
              <Button
                variant="ghost"
                onClick={() => handleOpenChange(false)}
                className="absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2 rounded-full p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4 text-gray-400" />
                <span className="sr-only">닫기</span>
              </Button>
            </div>
            <CommandList>
              <SearchDialogContent
                keyword={searchKeyword}
                onOpenChange={handleOpenChange}
              />
            </CommandList>
          </Command>
        )}
      </DialogContent>
    </Dialog>
  );
}
