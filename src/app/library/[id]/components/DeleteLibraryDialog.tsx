'use client';

import { Library, deleteLibrary } from '@/apis/library';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface DeleteLibraryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  library: Library;
}

export function DeleteLibraryDialog({
  isOpen,
  onClose,
  library,
}: DeleteLibraryDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const { mutateAsync } = useMutation({
    mutationFn: (id: number) => deleteLibrary(id),
    onSuccess: () => {
      toast.success('서재가 삭제되었습니다.');
      router.push('/libraries'); // 서재 목록 페이지로 이동
    },
    onError: (error: any) => {
      let errorMessage = '서재 삭제 중 오류가 발생했습니다.';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      onClose();
    },
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await mutateAsync(library.id);
    } catch (error) {
      console.error('서재 삭제 중 오류:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>서재를 삭제하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            &quot;{library.name}&quot; 서재를 삭제하면 서재에 담긴 모든 책과
            태그 정보가 함께 삭제되며, 이 작업은 되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? '삭제 중...' : '삭제하기'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
 