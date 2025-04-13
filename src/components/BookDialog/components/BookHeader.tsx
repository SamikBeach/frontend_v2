import { useSuspenseQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';

import { getBookByIsbn } from '@/apis/book';
import { Button } from '@/components/ui/button';
import { DialogTitle } from '@/components/ui/dialog';
import { useDialogQuery } from '@/hooks/useDialogQuery';

export function BookHeader() {
  const { isbn, close } = useDialogQuery({ type: 'book' });

  // 책 정보가 있을 때만 책 제목 가져오기
  const { data: book } = useSuspenseQuery({
    queryKey: ['book-detail', isbn],
    queryFn: () => (isbn ? getBookByIsbn(isbn) : null),
  });

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
