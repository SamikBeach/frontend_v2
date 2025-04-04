import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { SearchBarProps } from '../types';

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        placeholder="서재 검색..."
        value={value}
        onChange={onChange}
        className="h-10 rounded-xl border-gray-200 bg-[#F9FAFB] pl-9 focus-visible:ring-gray-300"
      />
    </div>
  );
}
