import { cn } from '@/lib/utils';

interface MenuItemProps {
  id: string;
  name: string;
  count: number;
  isSelected: boolean;
  onClick: () => void;
}

export function MenuItem({
  id,
  name,
  count,
  isSelected,
  onClick,
}: MenuItemProps) {
  return (
    <button
      className={cn(
        'flex h-8 cursor-pointer items-center rounded-full border px-3 text-[13px] font-medium transition-all',
        isSelected
          ? 'border-blue-200 bg-blue-50 text-blue-600'
          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
      )}
      onClick={onClick}
    >
      <span>{name}</span>
      <span className="ml-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-100 px-1 text-[11px] text-gray-600">
        {count}
      </span>
    </button>
  );
}
