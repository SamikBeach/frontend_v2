import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BookOpen, Image, SendHorizontal } from 'lucide-react';
import { UserProfile } from '../types';

interface CreatePostCardProps {
  user: UserProfile;
}

export function CreatePostCard({ user }: CreatePostCardProps) {
  return (
    <Card className="mb-6 border-gray-200">
      <CardContent className="p-5">
        <div className="flex gap-3">
          <Avatar className="h-11 w-11 border-0">
            <AvatarImage
              src={user.avatar}
              alt={user.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-gray-100 text-gray-800">
              {user.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Input
              placeholder="어떤 책에 대해 이야기하고 싶으신가요?"
              className="h-10 rounded-xl border-gray-200 bg-[#F9FAFB] text-[15px]"
            />
            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-xl border-gray-200 bg-white font-medium text-gray-700"
              >
                <BookOpen className="mr-1.5 h-4 w-4 text-gray-500" />책 추가
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-xl border-gray-200 bg-white font-medium text-gray-700"
              >
                <Image className="mr-1.5 h-4 w-4 text-gray-500" />
                사진 추가
              </Button>
              <Button
                size="icon"
                className="ml-auto h-9 w-9 rounded-xl bg-gray-900 font-medium text-white hover:bg-gray-800"
              >
                <SendHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
