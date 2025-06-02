import { X } from 'lucide-react';

import {
  ResponsiveDialogClose,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { useBookDetails } from '../hooks';

// 헤더 스켈레톤 컴포넌트
export function BookHeaderSkeleton() {
  return (
    <div className="sticky top-0 z-10 flex h-12 items-center justify-between rounded-t-lg bg-white/80 px-4 backdrop-blur-xl md:h-16 md:px-8">
      <Skeleton className="h-6 w-56 rounded-md" />
      <div className="h-8 w-8 rounded-full bg-gray-100" />
    </div>
  );
}

interface BookHeaderProps {
  isDialog?: boolean;
}

export function BookHeader({ isDialog = false }: BookHeaderProps) {
  const { book } = useBookDetails();
  const isMobile = useIsMobile();
  const bookTitle = book ? book.title : '도서 상세 정보';

  return (
    <div className="sticky top-0 z-10 flex h-12 items-center justify-between rounded-t-lg border-b-0 bg-white/80 px-4 backdrop-blur-xl md:h-16 md:px-8">
      {isDialog ? (
        <ResponsiveDialogTitle
          className="max-w-[80%] truncate text-xl font-bold text-gray-900"
          drawerClassName="max-w-[80%] truncate pl-1 text-lg font-bold text-gray-900"
        >
          {bookTitle}
        </ResponsiveDialogTitle>
      ) : (
        <h1 className="max-w-[80%] truncate text-xl font-bold text-gray-900">
          {bookTitle}
        </h1>
      )}
      {isDialog && !isMobile && (
        <ResponsiveDialogClose className="rounded-full">
          <X className="h-4 w-4" />
        </ResponsiveDialogClose>
      )}
    </div>
  );
}
