import {
  UpdateUserInfoRequest,
  UserDetailResponseDto,
} from '@/apis/user/types';
import { updateUserInfo } from '@/apis/user/user';
import { Button } from '@/components/ui/button';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
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
    mutationFn: async ({
      userData,
      file,
    }: {
      userData: UpdateUserInfoRequest;
      file?: File;
    }) => {
      return updateUserInfo(userData, file);
    },
    onSuccess: () => {
      // 프로필 정보 업데이트
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      // 사용자 정보 업데이트
      queryClient.invalidateQueries({ queryKey: ['user-libraries'] });
      // 현재 로그인한 사용자 정보 업데이트
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
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

      // ProfileFormData에서 profileImage가 null인 경우는 프로필 이미지 삭제 요청
      const removeProfileImage = formData.profileImage === null;

      // 프로필 정보 및 이미지 업데이트
      await updateProfile({
        userData: {
          username: formData.username,
          bio: formData.bio,
          ...(removeProfileImage && { removeProfileImage: true }),
        },
        file: formData.profileImage || undefined,
      });
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={onClose}>
      <ResponsiveDialogContent className="sm:max-w-[400px]">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>프로필 수정</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        <ProfileEditForm
          profileData={profileData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />

        <ResponsiveDialogFooter className="mt-4 flex flex-row justify-end gap-2">
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
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
