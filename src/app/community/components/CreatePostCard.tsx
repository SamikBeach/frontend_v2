import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BookOpen, Image, SendHorizontal } from 'lucide-react';
import { ChangeEvent, useRef } from 'react';
import { useCreatePost } from '../hooks';

interface CreatePostCardProps {
  user: {
    id: number;
    name: string;
    username: string;
    avatar: string;
  };
}

export function CreatePostCard({ user }: CreatePostCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    content,
    setContent,
    images,
    handleImageChange,
    handleCreatePost,
    isLoading,
  } = useCreatePost();

  // Safely get first letter of name for avatar fallback
  const getNameInitial = () => {
    if (!user?.name) return '?';
    return user.name.charAt(0);
  };

  // 파일 입력 핸들러
  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleImageChange(e.target.files);
  };

  // 이미지 버튼 클릭 시 파일 선택 다이얼로그 열기
  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="mb-6 border-gray-200">
      <CardContent className="p-5">
        <div className="flex gap-3">
          <Avatar className="h-11 w-11 border-0">
            <AvatarImage
              src={user?.avatar}
              alt={user?.name || 'User'}
              className="object-cover"
            />
            <AvatarFallback className="bg-gray-100 text-gray-800">
              {getNameInitial()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Input
              placeholder="어떤 책에 대해 이야기하고 싶으신가요?"
              className="h-10 rounded-xl border-gray-200 bg-[#F9FAFB] text-[15px]"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-xl border-gray-200 bg-white font-medium text-gray-700"
                onClick={handleImageButtonClick}
              >
                <Image className="mr-1.5 h-4 w-4 text-gray-500" />
                사진 추가
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-xl border-gray-200 bg-white font-medium text-gray-700"
              >
                <BookOpen className="mr-1.5 h-4 w-4 text-gray-500" />책 추가
              </Button>
              <Button
                size="icon"
                className="ml-auto h-9 w-9 rounded-xl bg-gray-900 font-medium text-white hover:bg-gray-800"
                onClick={handleCreatePost}
                disabled={!content.trim() || isLoading}
              >
                <SendHorizontal className="h-5 w-5" />
              </Button>
            </div>

            {/* 이미지 미리보기 */}
            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Image ${index + 1}`}
                      className="h-20 w-full rounded-md object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 이미지 입력 필드 (숨김) */}
            <input
              type="file"
              hidden
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleFileInputChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
