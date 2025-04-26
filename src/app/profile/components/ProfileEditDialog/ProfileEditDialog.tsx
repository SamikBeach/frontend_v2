'use client';

import { UserDetailResponseDto } from '@/apis/user/types';
import { updateUserInfo } from '@/apis/user/user';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
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
  const queryClient = useQueryClient();

  // 프로필 업데이트 mutation
  const { mutateAsync: updateProfile } = useMutation({
    mutationFn: updateUserInfo,
    onSuccess: () => {
      // 프로필 정보 업데이트
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      // 사용자 정보 업데이트
      queryClient.invalidateQueries({ queryKey: ['user-libraries'] });
      onClose();
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

  const handleSubmit = async (formData: ProfileFormData) => {
    try {
      setIsSubmitting(true);

      // 프로필 정보 업데이트
      await updateProfile({
        username: formData.username,
        bio: formData.bio,
      });

      // 프로필 이미지 업로드가 있는 경우 처리 (추후 구현)
      if (formData.avatar) {
        // TODO: 프로필 이미지 업로드 API 구현 및 연동
        console.log('프로필 이미지 업데이트:', formData.avatar);
      }
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
