import { Tag } from '@/utils/tags';

interface TagButtonProps {
  tag: Tag;
  isSelected: boolean;
  onClick: (id: string) => void;
}

export function TagButton({ tag, isSelected, onClick }: TagButtonProps) {
  return (
    <button
      onClick={() => onClick(tag.id)}
      className={`flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 text-sm font-medium transition-all ${
        isSelected ? 'bg-gray-900 text-white' : 'hover:bg-gray-50'
      }`}
      style={{
        backgroundColor: isSelected ? undefined : tag.color,
      }}
    >
      {tag.name}
    </button>
  );
}
