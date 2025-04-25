import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfile } from '../CreateReviewCard';

interface UserAvatarProps {
  user: UserProfile;
}

export function UserAvatar({ user }: UserAvatarProps) {
  // Safely get first letter of name for avatar fallback
  const getNameInitial = () => {
    if (!user?.name) return '?';
    return user.name.charAt(0);
  };

  return (
    <Avatar className="h-10 w-10">
      <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
      <AvatarFallback className="bg-gray-100 text-gray-800">
        {getNameInitial()}
      </AvatarFallback>
    </Avatar>
  );
}
