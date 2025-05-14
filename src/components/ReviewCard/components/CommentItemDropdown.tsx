import { Button } from '@/components/ui/button';
import {
  ResponsiveAlertDialog,
  ResponsiveAlertDialogAction,
  ResponsiveAlertDialogCancel,
  ResponsiveAlertDialogContent,
  ResponsiveAlertDialogDescription,
  ResponsiveAlertDialogFooter,
  ResponsiveAlertDialogHeader,
  ResponsiveAlertDialogTitle,
  ResponsiveAlertDialogTrigger,
} from '@/components/ui/responsive-alert-dialog';
import {
  ResponsiveDropdownMenu,
  ResponsiveDropdownMenuContent,
  ResponsiveDropdownMenuItem,
  ResponsiveDropdownMenuTrigger,
} from '@/components/ui/responsive-dropdown-menu';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';

interface CommentItemDropdownProps {
  isDropdownOpen: boolean;
  setIsDropdownOpen: (state: boolean) => void;
  onEditComment: () => void;
  onDeleteComment: () => void;
  isDeleting: boolean;
}

export function CommentItemDropdown({
  isDropdownOpen,
  setIsDropdownOpen,
  onEditComment,
  onDeleteComment,
  isDeleting,
}: CommentItemDropdownProps) {
  return (
    <ResponsiveDropdownMenu
      open={isDropdownOpen}
      onOpenChange={setIsDropdownOpen}
    >
      <ResponsiveDropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </ResponsiveDropdownMenuTrigger>
      <ResponsiveDropdownMenuContent align="end" className="w-36">
        <ResponsiveDropdownMenuItem
          className="flex cursor-pointer items-center gap-2 text-sm"
          onSelect={onEditComment}
        >
          <Pencil className="h-3.5 w-3.5" />
          수정하기
        </ResponsiveDropdownMenuItem>
        <ResponsiveAlertDialog>
          <ResponsiveAlertDialogTrigger asChild>
            <ResponsiveDropdownMenuItem
              className="flex cursor-pointer items-center gap-2 text-sm text-red-500 hover:text-red-500 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-500"
              onSelect={e => e.preventDefault()}
            >
              <Trash className="h-3.5 w-3.5 text-red-500" />
              삭제하기
            </ResponsiveDropdownMenuItem>
          </ResponsiveAlertDialogTrigger>
          <ResponsiveAlertDialogContent>
            <ResponsiveAlertDialogHeader>
              <ResponsiveAlertDialogTitle>댓글 삭제</ResponsiveAlertDialogTitle>
              <ResponsiveAlertDialogDescription>
                이 댓글을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </ResponsiveAlertDialogDescription>
            </ResponsiveAlertDialogHeader>
            <ResponsiveAlertDialogFooter>
              <ResponsiveAlertDialogAction
                onClick={onDeleteComment}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                {isDeleting ? '삭제 중...' : '삭제'}
              </ResponsiveAlertDialogAction>
              <ResponsiveAlertDialogCancel className="cursor-pointer">
                취소
              </ResponsiveAlertDialogCancel>
            </ResponsiveAlertDialogFooter>
          </ResponsiveAlertDialogContent>
        </ResponsiveAlertDialog>
      </ResponsiveDropdownMenuContent>
    </ResponsiveDropdownMenu>
  );
}
