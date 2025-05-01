import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CreateLibraryButtonProps {
  onClick: () => void;
}

export function CreateLibraryButton({ onClick }: CreateLibraryButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
      variant="outline"
    >
      <Plus className="h-4 w-4" />새 서재 만들기
    </Button>
  );
}
