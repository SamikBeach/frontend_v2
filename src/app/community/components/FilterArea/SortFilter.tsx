import { cn } from '@/lib/utils';

export type SortOption = 'popular' | 'latest' | 'following';

interface SortFilterProps {
  selectedSort: SortOption;
  onSortClick: (sort: SortOption) => void;
}

export function SortFilter({ selectedSort, onSortClick }: SortFilterProps) {
  // 정렬 옵션
  const sortOptions = [
    { id: 'popular', name: '인기' },
    { id: 'following', name: '팔로잉' },
    { id: 'latest', name: '최신' },
  ];

  return (
    <div className="flex gap-2">
      {sortOptions.map(option => (
        <button
          key={option.id}
          onClick={() => onSortClick(option.id as SortOption)}
          className={cn(
            'flex h-9 cursor-pointer items-center rounded-full border px-4 text-[14px] font-medium transition-colors',
            selectedSort === option.id
              ? 'border-gray-300 bg-gray-100 text-gray-900'
              : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
          )}
        >
          {option.name}
        </button>
      ))}
    </div>
  );
}
