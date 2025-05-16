import { Library, deleteLibrary } from '@/apis/library';
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
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface DeleteLibraryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  library: Library;
}

export function DeleteLibraryDialog({
  isOpen,
  onOpenChange,
  library,
}: DeleteLibraryDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const { mutateAsync } = useMutation({
    mutationFn: (id: number) => deleteLibrary(id),
    onSuccess: () => {
      toast.success('서재가 삭제되었습니다.');
      router.back(); // 이전 페이지로 이동
    },
    onError: (error: any) => {
      let errorMessage = '서재 삭제 중 오류가 발생했습니다.';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      onOpenChange(false);
    },
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    onOpenChange(false);
    try {
      await mutateAsync(library.id);
    } catch (error) {
      console.error('서재 삭제 중 오류:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ResponsiveAlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <ResponsiveAlertDialogContent>
        <ResponsiveAlertDialogHeader>
          <ResponsiveAlertDialogTitle>
            서재를 삭제하시겠습니까?
          </ResponsiveAlertDialogTitle>
          <ResponsiveAlertDialogDescription>
            &quot;{library.name}&quot; 서재를 삭제하면 서재에 담긴 모든 책과
            태그 정보가 함께 삭제되며, 이 작업은 되돌릴 수 없습니다.
          </ResponsiveAlertDialogDescription>
        </ResponsiveAlertDialogHeader>
        <ResponsiveAlertDialogFooter drawerClassName="flex flex-col-reverse gap-2">
          <ResponsiveAlertDialogCancel
            disabled={isDeleting}
            className="cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            취소
          </ResponsiveAlertDialogCancel>
          <ResponsiveAlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="cursor-pointer bg-red-500 hover:bg-red-600"
            drawerClassName="cursor-pointer bg-red-500 hover:bg-red-600"
          >
            {isDeleting ? '삭제 중...' : '삭제하기'}
          </ResponsiveAlertDialogAction>
        </ResponsiveAlertDialogFooter>
      </ResponsiveAlertDialogContent>
    </ResponsiveAlertDialog>
  );
}
