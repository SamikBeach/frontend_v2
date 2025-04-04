import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PenLine } from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProfileProps {
  user: UserProfile;
}

export function SidebarProfile({ user }: SidebarProfileProps) {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14 border">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500">@{user.username}</p>

            <div className="mt-4 flex justify-between">
              <div>
                <p className="font-medium text-gray-900">42</p>
                <p className="text-xs text-gray-500">팔로워</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">38</p>
                <p className="text-xs text-gray-500">팔로잉</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">24</p>
                <p className="text-xs text-gray-500">포스트</p>
              </div>
            </div>
          </div>
        </div>
        <Button className="mt-5 w-full bg-gray-900 hover:bg-gray-800">
          <PenLine className="mr-2 h-4 w-4" />
          게시물 작성하기
        </Button>
      </CardContent>
    </Card>
  );
}
