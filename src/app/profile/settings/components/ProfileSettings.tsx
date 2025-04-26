import { User } from '@/apis/user/types';
import { updateUserInfo } from '@/apis/user/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, useRef, useState } from 'react';
import { toast } from 'sonner';

interface ProfileSettingsProps {
  user: User | null;
  onSave: () => void;
}

export default function ProfileSettings({
  user,
  onSave,
}: ProfileSettingsProps) {
  // 사용자 정보 상태 관리
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.profileImage || null
  );
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  if (!user) return null;

  // 프로필 업데이트 mutation
  const { mutateAsync: updateProfile } = useMutation({
    mutationFn: async (params: {
      data: { username: string; bio: string; removeProfileImage?: boolean };
      file?: File | null;
    }) => {
      return updateUserInfo(params.data, params.file || undefined);
    },
    onSuccess: () => {
      // 프로필 정보 업데이트
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('프로필이 성공적으로 업데이트되었습니다.');
    },
    onError: (error: any) => {
      console.error('프로필 업데이트 오류:', error);
      toast.error('프로필 업데이트에 실패했습니다.');
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleDeleteProfileImage = async () => {
    try {
      setIsSubmitting(true);
      setProfileImage(null);
      setNewProfileImage(null);

      await updateProfile({
        data: {
          username,
          bio,
          removeProfileImage: true,
        },
      });
    } catch (error) {
      console.error('프로필 이미지 삭제 오류:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSubmitting(true);

      await updateProfile({
        data: {
          username,
          bio,
        },
        file: newProfileImage,
      });

      // 저장 후 새 이미지 상태 초기화
      setNewProfileImage(null);
      onSave();
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일 검증
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('5MB 이하의 이미지만 업로드할 수 있습니다.');
      return;
    }

    // 로컬 프리뷰 생성
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    setNewProfileImage(file);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white p-6">
      <h2 className="mb-6 text-lg font-semibold text-gray-900">프로필 정보</h2>
      <div className="space-y-6">
        {/* 숨겨진 파일 입력 */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleProfileImageChange}
        />

        {/* 프로필 이미지 섹션 */}
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
          <Label className="text-sm font-medium text-gray-700 sm:w-36">
            프로필 이미지
          </Label>
          <div className="flex items-end gap-3">
            <Avatar
              className="h-20 w-20 cursor-pointer border border-gray-200"
              onClick={handleImageClick}
            >
              <AvatarImage
                src={profileImage || undefined}
                alt={username}
                className="object-cover"
              />
              <AvatarFallback className="bg-gray-100 text-gray-800">
                {username[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="h-9 rounded-md bg-gray-900 px-4 text-white hover:bg-gray-800"
                onClick={handleImageClick}
              >
                변경
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-md border-gray-200 px-4 text-gray-500 hover:bg-gray-50"
                onClick={handleDeleteProfileImage}
                disabled={isSubmitting || !profileImage}
              >
                삭제
              </Button>
            </div>
          </div>
        </div>

        {/* 사용자명 필드 */}
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
              URL에 표시되는 이름입니다: example.com/{username}
            </p>
          </div>
        </div>

        {/* 이메일 필드 */}
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
              disabled
            />
            <p className="mt-1.5 text-xs text-gray-500">
              이 이메일은 로그인 및 알림에 사용됩니다.
            </p>
          </div>
        </div>

        {/* 소개 필드 */}
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
            onClick={handleSaveProfile}
            className="h-10 rounded-md bg-gray-900 px-5 hover:bg-gray-800"
            disabled={isSubmitting}
          >
            {isSubmitting ? '저장 중...' : '변경사항 저장'}
          </Button>
        </div>
      </div>
    </div>
  );
}
