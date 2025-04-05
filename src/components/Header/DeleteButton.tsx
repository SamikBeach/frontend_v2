'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface DeleteButtonProps {
  onClick: () => void;
}

export function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={e => {
        e.stopPropagation();
        onClick();
      }}
      className="absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2 rounded-full p-0 hover:bg-gray-200 max-md:opacity-100 md:opacity-0 md:group-hover:opacity-100"
    >
      <X className="h-4 w-4 text-gray-400" />
      <span className="sr-only">삭제</span>
    </Button>
  );
}
