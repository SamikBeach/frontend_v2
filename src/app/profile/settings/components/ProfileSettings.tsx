import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface ProfileSettingsProps {
  user: {
    name: string;
    username: string;
    email: string;
    bio?: string;
    avatar?: string;
  };
  onSave: () => void;
}

export default function ProfileSettings({
  user,
  onSave,
}: ProfileSettingsProps) {
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio || '');

  return (
    <div className="bg-white p-6">
      <h2 className="mb-6 text-lg font-semibold text-gray-900">프로필 정보</h2>
      <div className="space-y-6">
        {/* 프로필 이미지 */}
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
          <Label className="text-sm font-medium text-gray-700 sm:w-36">
            프로필 이미지
          </Label>
          <div className="flex items-end gap-3">
            <Avatar className="h-20 w-20 border border-gray-200">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gray-100 text-gray-800">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="h-9 rounded-md bg-gray-900 px-4 text-white hover:bg-gray-800"
              >
                변경
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-md border-gray-200 px-4 text-gray-500 hover:bg-gray-50"
              >
                삭제
              </Button>
            </div>
          </div>
        </div>

        {/* 이름 */}
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
          <Label
            htmlFor="name"
            className="text-sm font-medium text-gray-700 sm:w-36"
          >
            이름
          </Label>
          <Input
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="h-10 max-w-md rounded-md border-gray-200 text-sm"
          />
        </div>

        {/* 사용자명 */}
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
          <Label
            htmlFor="username"
            className="text-sm font-medium text-gray-700 sm:w-36"
          >
            사용자명
          </Label>
          <div className="w-full max-w-md">
            <Input
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="h-10 rounded-md border-gray-200 text-sm"
            />
            <p className="mt-1.5 text-xs text-gray-500">
              URL에 표시되는 이름입니다: example.com/@{username}
            </p>
          </div>
        </div>

        {/* 이메일 */}
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
          <Label
            htmlFor="email"
            className="text-sm font-medium text-gray-700 sm:w-36"
          >
            이메일
          </Label>
          <div className="w-full max-w-md">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="h-10 rounded-md border-gray-200 text-sm"
            />
            <p className="mt-1.5 text-xs text-gray-500">
              이 이메일은 로그인 및 알림에 사용됩니다.
            </p>
          </div>
        </div>

        {/* 소개 */}
        <div className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
          <Label
            htmlFor="bio"
            className="pt-2 text-sm font-medium text-gray-700 sm:w-36"
          >
            소개
          </Label>
          <div className="w-full max-w-md">
            <textarea
              id="bio"
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-gray-300 focus:ring-gray-300"
              rows={3}
            ></textarea>
            <p className="mt-1.5 text-xs text-gray-500">
              간단한 자기소개를 200자 이내로 작성해주세요.
            </p>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={onSave}
            className="h-10 rounded-md bg-gray-900 px-5 hover:bg-gray-800"
          >
            변경사항 저장
          </Button>
        </div>
      </div>
    </div>
  );
}
