import api from '../axios';
import {
  AccountActionResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  FollowersListResponseDto,
  FollowingListResponseDto,
  UpdateUserInfoRequest,
  UpdateUserInfoResponse,
  UploadProfileImageResponse,
  User,
  UserDetailResponseDto,
} from './types';

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
  const response = await api.put('/user/profile', data);
  return response.data;
};

/**
 * 사용자의 프로필 정보를 가져옵니다.
 * @param id 사용자 ID
 * @returns 사용자 프로필 상세 정보
 */
export const getUserProfile = async (
  id: number
): Promise<UserDetailResponseDto> => {
  const response = await api.get(`/user/${id}/profile`);
  return response.data;
};

/**
 * 사용자의 프로필 이미지를 업로드합니다.
 */
export const uploadProfileImage = async (
  file: File
): Promise<UploadProfileImageResponse> => {
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
export const changePassword = async (
  data: ChangePasswordRequest
): Promise<ChangePasswordResponse> => {
  const response = await api.post('/user/change-password', data);
  return response.data;
};

/**
 * 사용자 계정을 비활성화합니다.
 */
export const deactivateAccount = async (): Promise<AccountActionResponse> => {
  const response = await api.post('/user/deactivate');
  return response.data;
};

/**
 * 사용자 계정을 삭제합니다.
 */
export const deleteAccount = async (): Promise<AccountActionResponse> => {
  const response = await api.delete('/user/delete');
  return response.data;
};

/**
 * 특정 사용자를 팔로우합니다.
 * @param userId 팔로우할 사용자 ID
 */
export const followUser = async (userId: number): Promise<void> => {
  await api.post(`/user/${userId}/follow`);
};

/**
 * 특정 사용자 팔로우를 취소합니다.
 * @param userId 언팔로우할 사용자 ID
 */
export const unfollowUser = async (userId: number): Promise<void> => {
  await api.delete(`/user/${userId}/follow`);
};

/**
 * 특정 사용자의 팔로워 목록을 가져옵니다.
 * @param userId 사용자 ID
 */
export const getUserFollowers = async (
  userId: number
): Promise<FollowersListResponseDto> => {
  const response = await api.get(`/user/${userId}/followers`);
  return response.data;
};

/**
 * 특정 사용자의 팔로잉 목록을 가져옵니다.
 * @param userId 사용자 ID
 */
export const getUserFollowing = async (
  userId: number
): Promise<FollowingListResponseDto> => {
  const response = await api.get(`/user/${userId}/following`);
  return response.data;
};
