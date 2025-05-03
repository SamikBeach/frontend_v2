export enum NotificationType {
  COMMENT = 'comment',
  LIBRARY_UPDATE = 'library_update',
  LIBRARY_SUBSCRIBE = 'library_subscribe',
  LIKE = 'like',
  FOLLOW = 'follow',
  COMMENT_LIKE = 'comment_like',
  SYSTEM = 'system',
}

/**
 * 사용자 정보 DTO
 */
export interface UserInfoDto {
  id: number;
  username: string;
  profileImage?: string;
}

/**
 * 도서 정보 DTO
 */
export interface BookInfoDto {
  id: number;
  title: string;
  author: string;
  coverImage?: string;
  isbn?: string;
}

/**
 * 리뷰 정보 DTO
 */
export interface ReviewInfoDto {
  id: number;
  content: string;
  type: string;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  author?: UserInfoDto;
  books?: BookInfoDto[];
}

/**
 * 댓글 정보 DTO
 */
export interface CommentInfoDto {
  id: number;
  content: string;
  createdAt: Date;
  author?: UserInfoDto;
  reviewId: number;
  parentCommentId?: number;
  likeCount: number;
}

/**
 * 서재 정보 DTO
 */
export interface LibraryInfoDto {
  id: number;
  name: string;
  description?: string;
  isPublic: boolean;
  ownerId: number;
  subscriberCount: number;
}

/**
 * 알림 상세 데이터 인터페이스
 */
export interface NotificationDetailData {
  // 공통 필드
  action?: string;

  // 댓글 관련 필드
  commenterId?: number;
  commenterName?: string;
  commentContent?: string;

  // 좋아요 관련 필드
  likerId?: number;
  likerName?: string;

  // 팔로우 관련 필드
  followerId?: number;
  followerName?: string;

  // 서재 관련 필드
  libraryId?: number;
  libraryName?: string;
  bookId?: number;
  bookTitle?: string;

  // 기타 필드 - 필요에 따라 확장 가능
  [key: string]: any;
}

/**
 * 알림 상세 정보 DTO
 */
export interface NotificationDetailsDto {
  id: number;
  data?: NotificationDetailData;
  metadata?: string;
}

/**
 * 알림 엔티티 인터페이스
 */
export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  content?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  sourceId?: number;
  sourceType?: string;
  imageUrl?: string;
  linkUrl?: string;

  // 확장된 정보
  user?: UserInfoDto;
  actor?: UserInfoDto;
  review?: ReviewInfoDto;
  comment?: CommentInfoDto;
  library?: LibraryInfoDto;
  details?: NotificationDetailsDto;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  page?: number;
  limit?: number;
}

export interface UnreadCountResponse {
  count: number;
}

export interface MarkAsReadRequest {
  isRead: boolean;
}
