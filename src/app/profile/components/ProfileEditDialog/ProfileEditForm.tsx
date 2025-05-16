'use client';

import { UserDetailResponseDto } from '@/apis/user/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { AvatarUpload } from './AvatarUpload';

interface ProfileEditFormProps {
  profileData: UserDetailResponseDto;
  onSubmit: (formData: ProfileFormData) => void;
  isSubmitting: boolean;
}

export interface ProfileFormData {
  username: string;
  bio: string;
  profileImage?: File | null;
  removeProfileImage?: boolean;
}

export function ProfileEditForm({
  profileData,
  onSubmit,
  isSubmitting,
}: ProfileEditFormProps) {
  const { user } = profileData;

  // 사용자 표시 정보 설정
  const displayName = user.username || user.email?.split('@')[0] || '';

  const [formData, setFormData] = useState<ProfileFormData>({
    username: displayName,
    bio: user.bio || '',
    profileImage: undefined,
    removeProfileImage: false,
  });

  // 프로필 데이터가 변경되면 폼 데이터 업데이트
  useEffect(() => {
    setFormData({
      username: user.username || '',
      bio: user.bio || '',
      profileImage: undefined,
      removeProfileImage: false,
    });
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (file: File | null) => {
    if (file === null) {
      // 프로필 이미지 삭제
      setFormData(prev => ({
        ...prev,
        profileImage: null,
        removeProfileImage: true,
      }));
    } else {
      // 새 이미지 업로드
      setFormData(prev => ({
        ...prev,
        profileImage: file,
        removeProfileImage: false,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form id="profile-edit-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-center py-2">
        <AvatarUpload
          initialImage={user.profileImage || ''}
          onChange={handleAvatarChange}
          username={displayName}
        />
      </div>

      <div className="space-y-5">
        <div className="space-y-2.5">
          <Label
            htmlFor="username"
            className="text-sm font-medium text-gray-700"
          >
            닉네임
          </Label>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="변경할 닉네임을 입력하세요"
            className="h-12 rounded-lg border-gray-200 px-3 py-2 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
            자기소개
          </Label>
          <Textarea
            id="bio"
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            disabled={isSubmitting}
            className="min-h-[120px] resize-none rounded-lg border-gray-200 px-3 py-2.5 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="자기소개를 입력하세요 (최대 200자)"
            maxLength={200}
          />
          <div className="flex justify-end">
            <span className="text-xs text-gray-500">
              {formData.bio.length}/200
            </span>
          </div>
        </div>
      </div>
    </form>
  );
}
