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

interface ReviewAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  isDanger?: boolean;
}

export function ReviewAlertDialog({
  open,
  onOpenChange,
  title,
  message,
  onConfirm,
  confirmText = '확인',
  isDanger = false,
}: ReviewAlertDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {isDanger && (
            <AlertDialogCancel className="cursor-pointer rounded-xl">
              취소
            </AlertDialogCancel>
          )}
          <AlertDialogAction
            className={`cursor-pointer rounded-xl ${
              isDanger
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gray-900 hover:bg-gray-800'
            }`}
            onClick={onConfirm}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
