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
    <ResponsiveAlertDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveAlertDialogContent
        className={`max-w-md rounded-2xl ${isDanger ? '' : ''}`}
      >
        <ResponsiveAlertDialogHeader>
          <ResponsiveAlertDialogTitle>{title}</ResponsiveAlertDialogTitle>
          <ResponsiveAlertDialogDescription>
            {message}
          </ResponsiveAlertDialogDescription>
        </ResponsiveAlertDialogHeader>
        <ResponsiveAlertDialogFooter drawerClassName="flex flex-col-reverse gap-2">
          {isDanger && (
            <ResponsiveAlertDialogCancel className="cursor-pointer rounded-xl">
              취소
            </ResponsiveAlertDialogCancel>
          )}
          <ResponsiveAlertDialogAction
            className={`cursor-pointer rounded-xl ${
              isDanger
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gray-900 hover:bg-gray-800'
            }`}
            drawerClassName={`${
              isDanger
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gray-900 hover:bg-gray-800'
            }`}
            onClick={onConfirm}
          >
            {confirmText}
          </ResponsiveAlertDialogAction>
        </ResponsiveAlertDialogFooter>
      </ResponsiveAlertDialogContent>
    </ResponsiveAlertDialog>
  );
}
