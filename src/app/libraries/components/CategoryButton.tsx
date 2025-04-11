import { cn } from '@/lib/utils';
import { CategoryButtonProps } from '../types';

export function CategoryButton({
  category,
  isSelected,
  onClick,
}: CategoryButtonProps) {
  return (
    <button
      className={cn(
        'flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-full px-4 text-sm font-medium transition-all',
        isSelected
          ? 'bg-gray-900 text-white'
          : 'bg-[#F9FAFB] text-gray-700 hover:bg-gray-100'
      )}
      style={{
        backgroundColor: isSelected ? undefined : category.color,
      }}
      onClick={() => onClick(category.id)}
    >
      {category.name}
    </button>
  );
}
