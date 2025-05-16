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
    { id: 'popular', name: '인기' },
    { id: 'following', name: '팔로잉' },
    { id: 'latest', name: '최신' },
  ];

  return (
    <div className={cn('flex gap-1.5 md:gap-2', className)}>
      {sortOptions.map(option => (
        <button
          key={option.id}
          onClick={() => onSortClick(option.id as SortOption)}
          className={cn(
            'flex min-w-[50px] cursor-pointer items-center justify-center rounded-full border text-xs font-medium transition-all md:min-w-[60px] md:text-sm',
            'h-8 md:h-8',
            selectedSort === option.id
              ? 'border-blue-200 bg-blue-50 text-blue-600'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
          )}
        >
          {option.name}
        </button>
      ))}
    </div>
  );
}
