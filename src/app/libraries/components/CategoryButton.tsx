import { cn } from '@/lib/utils';
import { CategoryButtonProps } from '../types';

export function CategoryButton({
  category,
  isSelected,
  onClick,
}: CategoryButtonProps) {
  return (
    <button
      onClick={() => onClick(category.id)}
      className={cn(
        'flex h-10 min-w-max cursor-pointer items-center rounded-full px-4 text-[15px] font-medium whitespace-nowrap transition-colors',
        isSelected ? 'bg-gray-900 text-white' : 'text-gray-700 hover:opacity-90'
      )}
      style={{
        backgroundColor: isSelected ? undefined : category.color || '#F9FAFB',
      }}
    >
      {category.name}
    </button>
  );
}
