import { PopularSearch } from '@/apis/search/types';
import { CommandGroup, CommandItem } from '@/components/ui/command';
import { TrendingUp } from 'lucide-react';

interface PopularSearchListProps {
  popularSearches?: PopularSearch[];
  onSearchClick: (term: string) => void;
}

export function PopularSearchList({
  popularSearches,
  onSearchClick,
}: PopularSearchListProps) {
  // 데이터가 없거나 로딩 중일 때
  if (!popularSearches || popularSearches.length === 0) {
    return (
      <CommandGroup>
        <div className="mb-2 px-4">
          <h3 className="flex items-center text-sm font-medium text-gray-700">
            인기 검색어
          </h3>
        </div>
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-sm text-gray-500">인기 검색어가 없습니다.</p>
        </div>
      </CommandGroup>
    );
  }

  return (
    <CommandGroup>
      <div className="mb-2 px-2">
        <h3 className="flex items-center text-sm font-medium text-gray-700">
          <TrendingUp className="mr-2 h-4 w-4 text-gray-500" />
          실시간 인기 검색어
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-2 p-3 pt-1 max-sm:grid-cols-1">
        {popularSearches.map((trending, index) => (
          <CommandItem
            key={trending.term}
            value={trending.term}
            className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-left transition-colors hover:bg-gray-100"
            onSelect={() => onSearchClick(trending.term)}
          >
            <div className="flex items-center gap-2">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full ${index < 3 ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'} `}
              >
                <span className="text-xs font-medium">{index + 1}</span>
              </div>
              <span className="text-sm font-medium text-gray-800">
                {trending.term}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>{trending.count.toLocaleString()}</span>
            </div>
          </CommandItem>
        ))}
      </div>
    </CommandGroup>
  );
}
