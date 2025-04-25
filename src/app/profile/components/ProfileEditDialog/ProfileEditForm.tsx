'use client';

import { UserDetailResponseDto } from '@/apis/user/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { AvatarUpload } from './AvatarUpload';

interface ProfileEditFormProps {
  profileData: UserDetailResponseDto;
  onSubmit: (formData: ProfileFormData) => void;
  isSubmitting: boolean;
}

export interface ProfileFormData {
  displayName: string;
  bio: string;
  avatar?: File | null;
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
    displayName: displayName,
    bio: '고전 문학을 좋아하는 독서가입니다. 플라톤부터 도스토예프스키까지 다양한 작품을 읽고 있습니다.',
    avatar: null,
  });

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
      avatar: file,
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
          initialImage=""
          onChange={handleAvatarChange}
          username={displayName}
        />
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="displayName">닉네임</Label>
          <Input
            id="displayName"
            name="displayName"
            value={formData.displayName}
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
            placeholder="자기소개를 입력하세요"
          />
        </div>
      </div>
    </form>
  );
}
