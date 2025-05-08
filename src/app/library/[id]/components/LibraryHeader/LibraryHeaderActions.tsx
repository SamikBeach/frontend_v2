import { Library } from '@/apis/library/types';
import { AuthDialog } from '@/components/Auth/AuthDialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

  // 구독 버튼 클릭 핸들러 (로그인 확인 추가)
  const handleSubscribeClick = async () => {
    if (!isLoggedIn) {
      setAuthDialogOpen(true);
      return;
    }
    await handleSubscriptionToggle();
  };

  if (isOwner) {
    return (
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 cursor-pointer rounded-full border-gray-300"
          >
            <MoreHorizontal className="h-5 w-5 text-gray-600" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => {
              setShowEditDialog(true);
              setIsDropdownOpen(false);
            }}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" />
            서재 정보 수정
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={handleVisibilityToggle}
            className="cursor-pointer"
          >
            {library.isPublic ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                비공개로 변경
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                공개로 변경
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              setShowDeleteDialog(true);
              setIsDropdownOpen(false);
            }}
            className="cursor-pointer text-red-600 hover:bg-red-50"
          >
            <Trash className="mr-2 h-4 w-4 text-red-600 group-hover:text-red-600" />
            <span className="text-red-600 group-hover:text-red-600">
              서재 삭제
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <Button
        variant={isSubscribed ? 'outline' : 'default'}
        size="lg"
        onClick={handleSubscribeClick}
        className={`relative h-10 w-32 cursor-pointer rounded-full font-medium ${
          isSubscribed
            ? 'border-gray-300 text-gray-800 hover:bg-gray-100'
            : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
        <span className="absolute left-5">
          <Bell
            className={`h-5 w-5 ${isSubscribed ? 'text-gray-800' : 'text-white'}`}
          />
        </span>
        <span className="ml-7">{isSubscribed ? '구독중' : '구독하기'}</span>
      </Button>

      {/* 로그인 다이얼로그 */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
};
