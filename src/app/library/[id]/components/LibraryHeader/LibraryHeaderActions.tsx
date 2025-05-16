import { Library } from '@/apis/library/types';
import { AuthDialog } from '@/components/Auth/AuthDialog';
import { Button } from '@/components/ui/button';
import {
  ResponsiveDropdownMenu,
  ResponsiveDropdownMenuContent,
  ResponsiveDropdownMenuItem,
  ResponsiveDropdownMenuTrigger,
} from '@/components/ui/responsive-dropdown-menu';
import { Bell, Edit, Eye, EyeOff, MoreHorizontal, Trash } from 'lucide-react';
import { Dispatch, FC, SetStateAction, useState } from 'react';

interface LibraryHeaderActionsProps {
  library: Library;
  isOwner: boolean;
  isSubscribed: boolean;
  handleSubscriptionToggle: () => Promise<void>;
  handleVisibilityToggle: () => Promise<void>;
  isDropdownOpen: boolean;
  setIsDropdownOpen: Dispatch<SetStateAction<boolean>>;
  setShowEditDialog: Dispatch<SetStateAction<boolean>>;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
  isLoggedIn: boolean;
}

export const LibraryHeaderActions: FC<LibraryHeaderActionsProps> = ({
  library,
  isOwner,
  isSubscribed,
  handleSubscriptionToggle,
  handleVisibilityToggle,
  isDropdownOpen,
  setIsDropdownOpen,
  setShowEditDialog,
  setShowDeleteDialog,
  isLoggedIn,
}) => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const handleSubscribeClick = async () => {
    if (!isLoggedIn) {
      setAuthDialogOpen(true);
      return;
    }
    await handleSubscriptionToggle();
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {/* 구독 버튼 */}
        {!isOwner && (
          <Button
            variant={isSubscribed ? 'outline' : 'default'}
            className="cursor-pointer gap-1.5 rounded-full text-sm"
            onClick={handleSubscribeClick}
          >
            <Bell className="h-3.5! w-3.5!" />
            {isSubscribed ? '구독 중' : '구독하기'}
          </Button>
        )}

        {/* 더보기 버튼 - 소유자인 경우에만 표시 */}
        {isOwner && (
          <ResponsiveDropdownMenu
            open={isDropdownOpen}
            onOpenChange={setIsDropdownOpen}
          >
            <ResponsiveDropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9 cursor-pointer rounded-full"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </ResponsiveDropdownMenuTrigger>
            <ResponsiveDropdownMenuContent align="end">
              <ResponsiveDropdownMenuItem
                onSelect={() => {
                  setShowEditDialog(true);
                  setIsDropdownOpen(false);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                서재 수정하기
              </ResponsiveDropdownMenuItem>

              <ResponsiveDropdownMenuItem onSelect={handleVisibilityToggle}>
                {library.isPublic ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    비공개로 변경하기
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    공개로 변경하기
                  </>
                )}
              </ResponsiveDropdownMenuItem>

              <ResponsiveDropdownMenuItem
                onSelect={() => {
                  setShowDeleteDialog(true);
                  setIsDropdownOpen(false);
                }}
                variant="destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                서재 삭제하기
              </ResponsiveDropdownMenuItem>
            </ResponsiveDropdownMenuContent>
          </ResponsiveDropdownMenu>
        )}
      </div>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
};
