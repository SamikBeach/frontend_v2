import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConflictAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  libraryName: string;
}

/**
 * 책을 서재에 추가할 때 이미 해당 서재에 책이 존재하는 경우 표시되는 알림 다이얼로그
 */
export function ConflictAlertDialog({
  open,
  onOpenChange,
  libraryName,
}: ConflictAlertDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent onEscapeKeyDown={() => onOpenChange(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-normal text-gray-700">
            이 책은 이미 &quot;{libraryName}&quot; 서재에 담겨 있습니다.
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="cursor-pointer">확인</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
