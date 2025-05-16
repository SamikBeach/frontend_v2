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
        'flex h-8 cursor-pointer items-center rounded-full border px-3 text-[13px] font-medium transition-all',
        isSelected
          ? 'border-blue-200 bg-blue-50 text-blue-600'
          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
      )}
      onClick={() => onSelectSection(filter.id)}
    >
      <span>{filter.name}</span>
    </button>
  );
}
