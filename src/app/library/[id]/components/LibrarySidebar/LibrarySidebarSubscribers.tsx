import { useUserFollow } from '@/app/profile/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { FC } from 'react';

interface Subscriber {
  id: number;
  username: string;
  profileImage?: string;
  isFollowing?: boolean;
}

interface LibrarySidebarSubscribersProps {
  subscribers: Subscriber[];
  isCurrentUserSubscriber: (id: number) => boolean;
}

export const LibrarySidebarSubscribers: FC<LibrarySidebarSubscribersProps> = ({
  subscribers,
  isCurrentUserSubscriber,
}) => {
  const currentUser = useCurrentUser();

  if (!subscribers || subscribers.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <h3 className="font-medium text-gray-900">구독자</h3>

      <div className="mt-3 space-y-3">
        {subscribers.length > 0 ? (
          subscribers.map(subscriber => (
            <SubscriberItem
              key={subscriber.id}
              subscriber={subscriber}
              isCurrentUser={currentUser?.id === subscriber.id}
            />
          ))
        ) : (
          <p className="text-center text-sm text-gray-500">
            아직 구독자가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
};

interface SubscriberItemProps {
  subscriber: Subscriber;
  isCurrentUser: boolean;
}

const SubscriberItem: FC<SubscriberItemProps> = ({
  subscriber,
  isCurrentUser,
}) => {
  const { isFollowing, toggleFollow, isLoading } = useUserFollow(
    subscriber.isFollowing || false
  );

  // 팔로우 핸들러
  const handleFollowClick = async () => {
    await toggleFollow(subscriber.id);
  };

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8 border border-gray-200">
        <AvatarImage src={subscriber.profileImage} alt={subscriber.username} />
        <AvatarFallback className="bg-gray-200">
          {subscriber.username[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">
          {subscriber.username}
        </p>
      </div>
      {!isCurrentUser && (
        <Button
          variant={isFollowing ? 'outline' : 'ghost'}
          size="sm"
          className="h-7 cursor-pointer rounded-full text-xs"
          onClick={handleFollowClick}
          disabled={isLoading}
        >
          {isFollowing ? '팔로잉' : '팔로우'}
        </Button>
      )}
    </div>
  );
};
