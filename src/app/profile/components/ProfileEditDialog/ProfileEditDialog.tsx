'use client';

import { UserDetailResponseDto } from '@/apis/user/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { ProfileEditForm, ProfileFormData } from './ProfileEditForm';

interface ProfileEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: UserDetailResponseDto;
}

export function ProfileEditDialog({
  isOpen,
  onClose,
  profileData,
}: ProfileEditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: ProfileFormData) => {
    try {
      setIsSubmitting(true);
      // 실제 API 연동은 추후 구현
      console.log('프로필 업데이트:', {
        displayName: formData.displayName, // 닉네임만 업데이트
        bio: formData.bio,
        avatar: formData.avatar ? '프로필 이미지 변경됨' : '이미지 변경 없음',
      });

      // API 호출 성공 가정
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 1000);
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>프로필 수정</DialogTitle>
        </DialogHeader>

        <ProfileEditForm
          profileData={profileData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />

        <DialogFooter className="mt-4 flex flex-row justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            취소
          </Button>
          <Button
            type="submit"
            form="profile-edit-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? '저장 중...' : '저장'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
