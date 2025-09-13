import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMemo } from 'react';
import { UserProfile } from '../CreateReviewCard';

interface UserAvatarProps {
  user: UserProfile;
}

export function UserAvatar({ user }: UserAvatarProps) {
  const nameInitial = useMemo(() => {
    return user?.username?.charAt(0) ?? '?';
  }, [user?.username]);

  return (
    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
      <AvatarImage
        src={user.profileImage}
        alt={user.username}
        className="object-cover"
      />
      <AvatarFallback className="text-xs sm:text-sm">
        {nameInitial}
      </AvatarFallback>
    </Avatar>
  );
}
