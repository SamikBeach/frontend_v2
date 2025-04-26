import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface SearchBarProps {
  value: string;
  onSearchChange: (value: string) => void;
}

export function SearchBar({ value, onSearchChange }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState(value);
  const debouncedValue = useDebounce(searchValue, 300);

  // 검색어 변경 핸들러 - useCallback으로 메모이제이션
  const handleSearchChange = useCallback(() => {
    onSearchChange(debouncedValue);
  }, [debouncedValue, onSearchChange]);

  // 검색어가 변경되면 부모 컴포넌트에 알림
  useEffect(() => {
    handleSearchChange();
  }, [handleSearchChange]);

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        placeholder="서재 검색..."
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        className="h-10 rounded-xl border-gray-200 bg-[#F9FAFB] pl-9 focus-visible:ring-gray-300"
      />
    </div>
  );
}
