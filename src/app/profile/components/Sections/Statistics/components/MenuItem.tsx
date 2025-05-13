import { cn } from '@/lib/utils';

interface MenuItemProps {
  filter: {
    id: string;
    name: string;
  };
  selectedSection: string;
  onSelectSection: (section: string) => void;
}

export function MenuItem({
  filter,
  selectedSection,
  onSelectSection,
}: MenuItemProps) {
  const isSelected = selectedSection === filter.id;

  return (
    <button
      className={cn(
        'flex cursor-pointer items-center rounded-full border text-center transition-all',
        'h-7 px-2 text-[11px] font-medium sm:h-8 sm:px-3 sm:text-[13px]',
        'min-w-[60px] break-words whitespace-normal',
        isSelected
          ? 'border-blue-200 bg-blue-50 text-blue-600'
          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
      )}
      onClick={() => onSelectSection(filter.id)}
    >
      <span className="mx-auto leading-tight">{filter.name}</span>
    </button>
  );
}
