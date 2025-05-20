import { cn } from '@/lib/utils';
import { Tag } from '@/utils/tags';

interface TagButtonProps {
  tag: Tag;
  isSelected: boolean;
  onClick: (tagId: string) => void;
}

export function TagButton({ tag, isSelected, onClick }: TagButtonProps) {
  return (
    <button
      onClick={() => onClick(tag.id)}
      className={cn(
        'flex shrink-0 cursor-pointer items-center justify-center rounded-full px-4 text-sm font-medium transition-all md:px-4 md:text-sm',
        'h-9 md:h-9',
        isSelected ? 'bg-gray-900 text-white' : 'hover:bg-gray-50'
      )}
      style={{
        backgroundColor: isSelected ? undefined : tag.color || '#F9FAFB',
      }}
    >
      {tag.name}
    </button>
  );
}
