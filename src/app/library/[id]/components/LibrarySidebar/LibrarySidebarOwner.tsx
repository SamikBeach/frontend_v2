import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FC } from 'react';

interface LibrarySidebarOwnerProps {
  owner: {
    id: number;
    username: string;
  };
}

export const LibrarySidebarOwner: FC<LibrarySidebarOwnerProps> = ({
  owner,
}) => {
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

        <Button
          variant="ghost"
          size="sm"
          className="h-7 rounded-full bg-gray-200 text-xs hover:bg-gray-300"
          // TODO: 유저 팔로우 기능 - 추후 구현 예정
        >
          팔로우
        </Button>
      </div>
    </div>
  );
};
