import {
  ResponsiveAlertDialog,
  ResponsiveAlertDialogAction,
  ResponsiveAlertDialogContent,
  ResponsiveAlertDialogFooter,
  ResponsiveAlertDialogHeader,
  ResponsiveAlertDialogTitle,
} from '@/components/ui/responsive-alert-dialog';

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
    <ResponsiveAlertDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveAlertDialogContent onEscapeKeyDown={() => onOpenChange(false)}>
        <ResponsiveAlertDialogHeader>
          <ResponsiveAlertDialogTitle className="text-base font-normal text-gray-700">
            이 책은 이미 &quot;{libraryName}&quot; 서재에 담겨 있습니다.
          </ResponsiveAlertDialogTitle>
        </ResponsiveAlertDialogHeader>
        <ResponsiveAlertDialogFooter drawerClassName="flex flex-col-reverse gap-2">
          <ResponsiveAlertDialogAction
            className="cursor-pointer"
            drawerClassName="cursor-pointer"
          >
            확인
          </ResponsiveAlertDialogAction>
        </ResponsiveAlertDialogFooter>
      </ResponsiveAlertDialogContent>
    </ResponsiveAlertDialog>
  );
}
