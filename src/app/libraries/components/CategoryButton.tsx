import { cn } from '@/lib/utils';
import { TagButtonProps } from '../types';

export function TagButton({ tag, isSelected, onClick }: TagButtonProps) {
  return (
    <button
      className={cn(
        'flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-full px-4 text-sm font-medium transition-all',
        isSelected
          ? 'bg-gray-900 text-white'
          : 'bg-[#F9FAFB] text-gray-700 hover:bg-gray-100'
      )}
      style={{
        backgroundColor: isSelected ? undefined : tag.color,
      }}
      onClick={() => onClick(tag.id)}
    >
      {tag.name}
    </button>
  );
}
