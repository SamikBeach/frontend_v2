import { useUserFollow } from '@/app/profile/hooks';
import { AuthDialog } from '@/components/Auth/AuthDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { FC, useState } from 'react';

interface LibrarySidebarOwnerProps {
  owner: {
    id: number;
    username: string;
    isFollowing?: boolean;
    profileImage?: string;
  };
}

export const LibrarySidebarOwner: FC<LibrarySidebarOwnerProps> = ({
  owner,
}) => {
  const currentUser = useCurrentUser();
  const { isFollowing, toggleFollow, isLoading } = useUserFollow(
    owner.isFollowing || false
  );
  const isOwnProfile = currentUser?.id === owner.id;

  // 로그인 다이얼로그 상태
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  // 팔로우 핸들러
  const handleFollowClick = async () => {
    if (!currentUser) {
      // 로그인 다이얼로그 표시
      setAuthDialogOpen(true);
      return;
    }

    await toggleFollow(owner.id);
  };

  // 비로그인 사용자에게도 항상 팔로우 버튼 표시 (자기 자신이 아닌 경우)
  const showFollowButton = !isOwnProfile;

  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${owner.id}`}>
            <Avatar className="h-12 w-12 cursor-pointer border border-gray-200 transition-opacity hover:opacity-90">
              <AvatarImage src={owner.profileImage} alt={owner.username} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {owner.username[0]}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link href={`/profile/${owner.id}`}>
              <h3 className="cursor-pointer font-medium text-gray-900 hover:underline">
                {owner.username}
              </h3>
            </Link>
          </div>
        </div>

        {showFollowButton && (
          <Button
            variant={isFollowing ? 'outline' : 'default'}
            size="sm"
            className={`h-7 cursor-pointer rounded-full text-xs ${
              isFollowing
                ? 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
            onClick={handleFollowClick}
            disabled={isLoading}
          >
            {isFollowing ? (
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3" />
                팔로잉
              </span>
            ) : (
              '팔로우'
            )}
          </Button>
        )}
      </div>

      {/* 로그인 다이얼로그 */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </div>
  );
};
