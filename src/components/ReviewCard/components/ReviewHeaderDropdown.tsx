import { Button } from '@/components/ui/button';
import {
  ResponsiveDropdownMenu,
  ResponsiveDropdownMenuContent,
  ResponsiveDropdownMenuItem,
  ResponsiveDropdownMenuTrigger,
} from '@/components/ui/responsive-dropdown-menu';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';

interface ReviewHeaderDropdownProps {
  isDropdownOpen: boolean;
  setIsDropdownOpen: (state: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ReviewHeaderDropdown({
  isDropdownOpen,
  setIsDropdownOpen,
  onEdit,
  onDelete,
}: ReviewHeaderDropdownProps) {
  return (
    <ResponsiveDropdownMenu
      open={isDropdownOpen}
      onOpenChange={setIsDropdownOpen}
    >
      <ResponsiveDropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 p-0 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </ResponsiveDropdownMenuTrigger>
      <ResponsiveDropdownMenuContent align="end" className="w-36">
        <ResponsiveDropdownMenuItem
          className="flex cursor-pointer items-center gap-2 text-sm"
          onSelect={() => {
            onEdit();
            setIsDropdownOpen(false);
          }}
        >
          <Pencil className="h-3.5 w-3.5" />
          수정하기
        </ResponsiveDropdownMenuItem>
        <ResponsiveDropdownMenuItem
          className="flex cursor-pointer items-center gap-2 text-sm text-red-500 hover:text-red-500 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-500"
          onSelect={() => {
            onDelete();
            setIsDropdownOpen(false);
          }}
        >
          <Trash className="h-3.5 w-3.5 text-red-500" />
          삭제하기
        </ResponsiveDropdownMenuItem>
      </ResponsiveDropdownMenuContent>
    </ResponsiveDropdownMenu>
  );
}
