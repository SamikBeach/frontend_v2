import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ResponsiveDialogTitle } from '@/components/ui/responsive-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDialogQuery } from '@/hooks/useDialogQuery';
import { cn } from '@/lib/utils';
import { useBookDetails } from '../hooks';

// 헤더 스켈레톤 컴포넌트
export function BookHeaderSkeleton() {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        'sticky top-0 z-10 flex items-center justify-between rounded-t-lg bg-white/80 backdrop-blur-xl',
        isMobile ? 'h-12 px-4' : 'h-16 px-10'
      )}
    >
      <div className="pl-2">
        <Skeleton className="h-7 w-56 rounded-md" />
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="cursor-pointer rounded-full"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface BookHeaderProps {
  isDialog?: boolean;
}

export function BookHeader({ isDialog = false }: BookHeaderProps) {
  const { close } = useDialogQuery({ type: 'book' });
  const { book } = useBookDetails();
  const isMobile = useIsMobile();
  const bookTitle = book ? book.title : '도서 상세 정보';

  return (
    <div
      className={cn(
        'sticky top-0 z-10 flex items-center justify-between rounded-t-lg bg-white/80 backdrop-blur-xl',
        isMobile ? 'h-12 px-4' : 'h-16 px-10'
      )}
    >
      {isDialog ? (
        <ResponsiveDialogTitle
          className="max-w-[80%] truncate pl-2 text-xl font-bold text-gray-900"
          drawerClassName="max-w-[80%] truncate pl-1 text-lg font-bold text-gray-900"
        >
          {bookTitle}
        </ResponsiveDialogTitle>
      ) : (
        <h1 className="max-w-[80%] truncate pl-2 text-xl font-bold text-gray-900">
          {bookTitle}
        </h1>
      )}
      {isDialog && (
        <Button
          variant="ghost"
          size={isMobile ? 'sm' : 'icon'}
          className={cn(
            'cursor-pointer transition-colors',
            isMobile ? 'h-8 w-8 rounded-full p-0' : 'rounded-full'
          )}
          onClick={() => close()}
        >
          <X className={isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
        </Button>
      )}
    </div>
  );
}
