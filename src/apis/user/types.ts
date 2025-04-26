import { AuthProvider, UserStatus } from '../auth/types';

/**
 * 사용자 정보 인터페이스
 */
export interface User {
  id: number;
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
 * 사용자 정보 업데이트 요청 인터페이스
 */
export interface UpdateUserInfoRequest {
  name?: string;
  username?: string;
  bio?: string;
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

/**
 * 사용자 기본 정보 DTO
 */
export interface UserDetailDto {
  id: number;
  username: string;
  email?: string;
  bio?: string;
  provider: AuthProvider;
  createdAt: Date;
}

/**
 * 서재 소유자 DTO
 */
export interface LibraryOwnerDto {
  id: number;
  username: string;
  email: string;
}

/**
 * 서재 태그 DTO
 */
export interface LibraryTagDto {
  id: number;
  tagId: number;
  tagName: string;
  usageCount: number;
  libraryId: number;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 서재 미리보기 DTO
 */
export interface LibraryPreviewDto {
  id: number;
  name: string;
  description: string;
  isPublic: boolean;
  subscriberCount: number;
  owner: LibraryOwnerDto;
  tags: LibraryTagDto[];
  bookCount: number;
  previewBooks: BookPreviewDto[];
  isSubscribed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 책 미리보기 DTO
 */
export interface BookPreviewDto {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  isbn: string;
  publisher: string;
}

/**
 * 이미지 미리보기 DTO
 */
export interface ImagePreviewDto {
  id: number;
  url: string;
}

/**
 * 리뷰 미리보기 DTO
 */
export interface ReviewPreviewDto {
  id: number;
  content: string;
  type: string;
  previewImage: ImagePreviewDto;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
}

/**
 * 카테고리별 독서 통계 DTO
 */
export interface ReadingCategoryStatDto {
  category: string;
  count: number;
}

/**
 * 사용자 상세 정보 응답 DTO
 */
export interface UserDetailResponseDto {
  user: UserDetailDto;
  libraryCount: number;
  readCount: number;
  subscribedLibraryCount: number;
  reviewCount: number;
  followers: number;
  following: number;
  isEditable: boolean;
  isFollowing?: boolean;
  libraries?: LibraryPreviewDto[];
}

/**
 * 사용자 서재 목록 응답
 */
export interface UserLibrariesResponseDto {
  items: LibraryPreviewDto[];
  total: number;
}

/**
 * 사용자 리뷰 목록 응답
 */
export interface UserReviewsResponseDto {
  reviews: ReviewPreviewDto[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * 팔로워/팔로잉 사용자 응답 DTO
 */
export interface FollowerResponseDto {
  id: number;
  username: string;
  isFollowing: boolean;
}

/**
 * 팔로워 목록 응답 DTO
 */
export interface FollowersListResponseDto {
  followers: FollowerResponseDto[];
  total: number;
}

/**
 * 팔로잉 목록 응답 DTO
 */
export interface FollowingListResponseDto {
  following: FollowerResponseDto[];
  total: number;
}
