import { useUserFollow } from '@/app/profile/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Check, FC } from 'lucide-react';

interface LibrarySidebarOwnerProps {
  owner: {
    id: number;
    username: string;
    isFollowing?: boolean;
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

  // 팔로우 핸들러
  const handleFollowClick = async () => {
    if (!currentUser) {
      // TODO: 로그인 다이얼로그 표시
      return;
    }

    await toggleFollow(owner.id);
  };

  // 자기 자신이면 팔로우 버튼 숨김
  const showFollowButton = !isOwnProfile && currentUser;

  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border border-gray-200">
            <AvatarImage
              src={`https://i.pravatar.cc/150?u=${owner.id}`}
              alt={owner.username}
            />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {owner.username[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-gray-900">{owner.username}</h3>
            <p className="text-sm text-gray-500">@{owner.username}</p>
          </div>
        </div>

        {showFollowButton && (
          <Button
            variant={isFollowing ? 'outline' : 'default'}
            size="sm"
            className={`h-7 rounded-full text-xs ${
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
    </div>
  );
};
