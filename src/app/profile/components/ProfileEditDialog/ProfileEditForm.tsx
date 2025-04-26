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
    profileImage: null,
  });

  // 프로필 데이터가 변경되면 폼 데이터 업데이트
  useEffect(() => {
    setFormData({
      username: user.username || '',
      bio: user.bio || '',
      profileImage: null,
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
    setFormData(prev => ({
      ...prev,
      profileImage: file,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form id="profile-edit-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-6 flex justify-center">
        <AvatarUpload
          initialImage={user.profileImage || ''}
          onChange={handleAvatarChange}
          username={displayName}
        />
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="username">닉네임</Label>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="변경할 닉네임을 입력하세요"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="bio">자기소개</Label>
          <Textarea
            id="bio"
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            disabled={isSubmitting}
            className="resize-none"
            placeholder="자기소개를 입력하세요 (최대 200자)"
            maxLength={200}
          />
        </div>
      </div>
    </form>
  );
}
