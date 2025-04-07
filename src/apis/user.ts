import api from './axios';
import {
  UpdateUserInfoRequest,
  UpdateUserInfoResponse,
  User,
} from './types/auth';

/**
 * 현재 로그인한 사용자 정보를 가져옵니다.
 * 인증된 사용자만 접근 가능합니다.
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/user/me');
  return response.data;
};

/**
 * 사용자 정보를 업데이트합니다.
 * 인증된 사용자만 접근 가능합니다.
 */
export const updateUserInfo = async (
  data: UpdateUserInfoRequest
): Promise<UpdateUserInfoResponse> => {
  const response = await api.put('/user/update', data);
  return response.data;
};

/**
 * 사용자의 프로필 이미지를 업로드합니다.
 */
export const uploadProfileImage = async (
  file: File
): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post('/user/profile-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * 사용자의 비밀번호를 변경합니다.
 */
export const changePassword = async ({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> => {
  const response = await api.post('/user/change-password', {
    currentPassword,
    newPassword,
  });
  return response.data;
};

/**
 * 사용자 계정을 비활성화합니다.
 */
export const deactivateAccount = async (): Promise<{ message: string }> => {
  const response = await api.post('/user/deactivate');
  return response.data;
};

/**
 * 사용자 계정을 삭제합니다.
 */
export const deleteAccount = async (): Promise<{ message: string }> => {
  const response = await api.delete('/user/delete');
  return response.data;
};
