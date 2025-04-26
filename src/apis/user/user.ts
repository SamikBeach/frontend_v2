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

  // 백엔드 응답에 profileImage가 없는 경우를 대비한 예외 처리
  if (!response.data.profileImage) {
    response.data.profileImage = null;
  }

  return response.data;
};

/**
 * 사용자 정보를 업데이트합니다.
 * 인증된 사용자만 접근 가능합니다.
 * @param data 업데이트할 사용자 정보
 * @param file 업로드할 프로필 이미지 (선택 사항)
 */
export const updateUserInfo = async (
  data: UpdateUserInfoRequest & { removeProfileImage?: boolean },
  file?: File
): Promise<UpdateUserInfoResponse> => {
  // FormData 생성
  const formData = new FormData();

  // 텍스트 데이터 추가
  if (data.username) formData.append('username', data.username);
  if (data.bio !== undefined) formData.append('bio', data.bio);

  // 프로필 이미지 처리
  if (data.removeProfileImage) {
    // 프로필 이미지 제거 요청
    formData.append('removeProfileImage', 'true');
    formData.append('profileImage', ''); // 빈 문자열로 profileImage 필드 명시
  } else if (file) {
    // 새 이미지 업로드
    formData.append('profileImage', file);
  } else {
    // 변경 없음 - profileImage 필드를 null로 명시 (백엔드에서 무시)
    formData.append('profileImage', '');
  }

  const response = await api.put('/user/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
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
 * @deprecated 프로필 업데이트 API에 통합되었습니다. updateUserInfo 함수를 사용하세요.
 */
export const uploadProfileImage = async (
  file: File
): Promise<UploadProfileImageResponse> => {
  const formData = new FormData();
  formData.append('profileImage', file);

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
 * @param page 페이지 번호 (기본값: 1)
 * @param limit 페이지당 아이템 수 (기본값: 10)
 */
export const getUserFollowers = async (
  userId: number,
  page: number = 1,
  limit: number = 10
): Promise<FollowersListResponseDto> => {
  const response = await api.get(`/user/${userId}/followers`, {
    params: { page, limit },
  });
  return response.data;
};

/**
 * 특정 사용자의 팔로잉 목록을 가져옵니다.
 * @param userId 사용자 ID
 * @param page 페이지 번호 (기본값: 1)
 * @param limit 페이지당 아이템 수 (기본값: 10)
 */
export const getUserFollowing = async (
  userId: number,
  page: number = 1,
  limit: number = 10
): Promise<FollowingListResponseDto> => {
  const response = await api.get(`/user/${userId}/following`, {
    params: { page, limit },
  });
  return response.data;
};
