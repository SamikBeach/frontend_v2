import { AuthProvider, UserStatus } from '../auth/types';

/**
 * 사용자 정보 인터페이스
 */
export interface User {
  id: string;
  email: string;
  username?: string;
  name?: string;
  avatar?: string;
  bio?: string;
  provider: AuthProvider;
  providerId?: string;
  status: UserStatus;
  isEmailVerified: boolean;
  marketingConsent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 사용자 정보 업데이트 요청
 */
export interface UpdateUserInfoRequest {
  username?: string;
}

/**
 * 사용자 정보 업데이트 응답
 */
export interface UpdateUserInfoResponse {
  id: string;
  email: string;
  username?: string;
}

/**
 * 비밀번호 변경 요청
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * 비밀번호 변경 응답
 */
export interface ChangePasswordResponse {
  message: string;
}

/**
 * 프로필 이미지 업로드 응답
 */
export interface UploadProfileImageResponse {
  url: string;
}

/**
 * 계정 비활성화/삭제 응답
 */
export interface AccountActionResponse {
  message: string;
}
