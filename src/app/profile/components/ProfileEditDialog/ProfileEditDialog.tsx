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

      // 프로필 정보 및 이미지 업데이트
      await updateProfile({
        userData: {
          username: formData.username,
          bio: formData.bio,
          // formData.removeProfileImage가 true인 경우에만 이미지 삭제 요청
          ...(formData.removeProfileImage && { removeProfileImage: true }),
        },
        // 파일이 제공된 경우에만 전달 (undefined는 기존 이미지 유지)
        file:
          formData.profileImage instanceof File
            ? formData.profileImage
            : undefined,
      });
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={onClose}>
      <ResponsiveDialogContent
        className="overflow-hidden p-0 sm:max-w-[450px]"
        drawerClassName="p-0 max-h-[90vh] overflow-hidden"
      >
        <ResponsiveDialogHeader
          className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 px-4 py-4 backdrop-blur-sm"
          drawerClassName="sticky top-0 z-10 bg-white/95 backdrop-blur-sm px-4 py-4 border-b border-gray-100"
        >
          <ResponsiveDialogTitle className="text-lg font-medium">
            프로필 수정
          </ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        <div className="max-h-[calc(80vh-120px)] overflow-y-auto px-4 py-4">
          <ProfileEditForm
            profileData={profileData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>

        <ResponsiveDialogFooter
          className="sticky bottom-0 z-10 mt-0 border-t border-gray-100 bg-white px-4 py-4"
          drawerClassName="sticky bottom-0 z-10 px-4 py-4 bg-white border-t border-gray-100 mt-0 pb-safe"
        >
          <div className="flex w-full gap-3 sm:justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-11 flex-1 sm:flex-none"
            >
              취소
            </Button>
            <Button
              type="submit"
              form="profile-edit-form"
              disabled={isSubmitting}
              className="h-11 flex-1 sm:flex-none"
            >
              {isSubmitting ? '저장 중...' : '저장'}
            </Button>
          </div>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
