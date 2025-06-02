import { cn } from '@/lib/utils';

export type SortOption = 'popular' | 'latest' | 'following';

interface SortFilterProps {
  selectedSort: SortOption;
  onSortClick: (sort: SortOption) => void;
  className?: string;
}

export function SortFilter({
  selectedSort,
  onSortClick,
  className,
}: SortFilterProps) {
  // 정렬 옵션
  const sortOptions = [
    { id: 'following', name: '팔로잉' },
    { id: 'popular', name: '인기' },
    { id: 'latest', name: '최신' },
  ];

  return (
    <div
      className={cn(
        "no-scrollbar flex gap-2 overflow-x-auto pr-2 pl-2 after:block after:w-1 after:flex-shrink-0 after:content-[''] md:gap-2 md:pr-0 md:pl-0 md:after:content-none",
        className
      )}
    >
      {sortOptions.map(option => (
        <button
          key={option.id}
          onClick={() => onSortClick(option.id as SortOption)}
          className={cn(
            'flex shrink-0 cursor-pointer items-center justify-center rounded-full border px-3 text-sm font-medium transition-colors md:px-3 md:text-sm',
            'h-8 md:h-8',
            selectedSort === option.id
              ? 'border-blue-200 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
          )}
        >
          {option.name}
        </button>
      ))}
    </div>
  );
}
