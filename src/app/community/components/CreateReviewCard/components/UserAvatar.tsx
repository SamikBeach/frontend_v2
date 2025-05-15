import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfile } from '../CreateReviewCard';

interface UserAvatarProps {
  user: UserProfile;
}

export function UserAvatar({ user }: UserAvatarProps) {
  // Safely get first letter of name for avatar fallback
  const getNameInitial = () => {
    if (!user?.username) return '?';
    return user.username.charAt(0);
  };

  return (
    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
      <AvatarImage
        src={user.profileImage}
        alt={user.username}
        className="object-cover"
      />
      <AvatarFallback className="bg-gray-100 text-xs text-gray-800 sm:text-sm">
        {getNameInitial()}
      </AvatarFallback>
    </Avatar>
  );
}
