import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useDialogQuery } from '@/hooks/useDialogQuery';
import { useBookDetails } from '../hooks';

// 헤더 스켈레톤 컴포넌트
export function BookHeaderSkeleton() {
  return (
    <div className="sticky top-0 z-10 flex h-16 items-center justify-between rounded-t-lg bg-white/80 px-10 backdrop-blur-xl">
      <div className="pl-2">
        <Skeleton className="h-7 w-56 rounded-md" />
      </div>
      <Button variant="ghost" size="icon" className="rounded-full">
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function BookHeader() {
  const { close } = useDialogQuery({ type: 'book' });
  const { book } = useBookDetails();

  const bookTitle = book ? book.title : '도서 상세 정보';

  return (
    <div className="sticky top-0 z-10 flex h-16 items-center justify-between rounded-t-lg bg-white/80 px-10 backdrop-blur-xl">
      <DialogTitle className="max-w-[80%] truncate pl-2 text-xl font-bold text-gray-900">
        {bookTitle}
      </DialogTitle>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={() => close()}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
