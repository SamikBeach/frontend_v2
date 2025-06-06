import {
  ResponsiveAlertDialog,
  ResponsiveAlertDialogAction,
  ResponsiveAlertDialogCancel,
  ResponsiveAlertDialogContent,
  ResponsiveAlertDialogDescription,
  ResponsiveAlertDialogFooter,
  ResponsiveAlertDialogHeader,
  ResponsiveAlertDialogTitle,
} from '@/components/ui/responsive-alert-dialog';
import { josa } from 'josa';
import { useState } from 'react';
import { useLibraryBooks } from './hooks';

interface DeleteBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: number;
  bookTitle: string;
  libraryId: number;
  onDelete: () => void;
}

export function DeleteBookDialog({
  open,
  onOpenChange,
  bookId,
  bookTitle,
  libraryId,
  onDelete,
}: DeleteBookDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { removeBook } = useLibraryBooks(libraryId);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await removeBook(bookId);
      onDelete();
      onOpenChange(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ResponsiveAlertDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveAlertDialogContent className="max-w-md rounded-xl">
        <ResponsiveAlertDialogHeader>
          <ResponsiveAlertDialogTitle className="text-lg font-medium">
            {josa(`${bookTitle}#{을} 서재에서 삭제하시겠습니까?`)}
          </ResponsiveAlertDialogTitle>
          <ResponsiveAlertDialogDescription className="mt-2 text-sm text-gray-500">
            이 작업은 되돌릴 수 없습니다.
          </ResponsiveAlertDialogDescription>
        </ResponsiveAlertDialogHeader>
        <ResponsiveAlertDialogFooter drawerClassName="flex flex-col-reverse gap-2">
          <ResponsiveAlertDialogCancel
            className="cursor-pointer rounded-lg border-gray-200"
            disabled={isDeleting}
          >
            취소
          </ResponsiveAlertDialogCancel>
          <ResponsiveAlertDialogAction
            className="cursor-pointer rounded-lg bg-red-600 hover:bg-red-700 focus:ring-red-600"
            drawerClassName="cursor-pointer bg-red-600 hover:bg-red-700 focus:ring-red-600"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </ResponsiveAlertDialogAction>
        </ResponsiveAlertDialogFooter>
      </ResponsiveAlertDialogContent>
    </ResponsiveAlertDialog>
  );
}
