import { QueryClient } from '@tanstack/react-query';

/**
 * 현재 경로가 자신의 프로필 페이지인지 확인하는 함수
 * @param pathname 현재 경로
 * @param currentUserId 현재 로그인한 사용자 ID
 * @returns 자신의 프로필 페이지인지 여부
 */
export function isCurrentUserProfilePage(
  pathname: string,
  currentUserId?: number | null
): boolean {
  if (!currentUserId) return false;

  // /profile/123 형식의 경로에서 ID 추출
  const match = pathname.match(/^\/profile\/(\d+)/);
  const profileId = match ? match[1] : null;

  // 현재 사용자 ID와 프로필 ID 비교
  return profileId ? currentUserId.toString() === profileId : false;
}

/**
 * 사용자 프로필 관련 쿼리를 무효화하는 함수
 * @param queryClient React Query 클라이언트
 * @param pathname 현재 경로
 * @param currentUserId 현재 사용자 ID
 */
export function invalidateUserProfileQueries(
  queryClient: QueryClient,
  pathname: string,
  currentUserId?: number | null
): void {
  // 자신의 프로필 페이지가 아니면 무효화하지 않음
  if (!isCurrentUserProfilePage(pathname, currentUserId)) return;

  // 프로필 데이터 쿼리 무효화
  queryClient.invalidateQueries({
    queryKey: ['profile', currentUserId],
  });

  // 사용자 책 목록 쿼리 무효화
  queryClient.invalidateQueries({
    queryKey: ['user-books', currentUserId],
    exact: false,
  });

  // 사용자 리뷰 관련 쿼리 무효화
  queryClient.invalidateQueries({
    queryKey: ['user-reviews-infinite', currentUserId],
    exact: false,
  });

  // 사용자 별점 관련 쿼리 무효화
  queryClient.invalidateQueries({
    queryKey: ['user-ratings-infinite', currentUserId],
    exact: false,
  });

  // 사용자 활동 관련 쿼리 무효화
  queryClient.invalidateQueries({
    queryKey: ['user-activity-infinite', currentUserId],
    exact: false,
  });

  // 리뷰 타입 카운트 쿼리 무효화
  queryClient.invalidateQueries({
    queryKey: ['user-review-type-counts', currentUserId],
    exact: true,
  });

  // 읽기 상태 카운트 쿼리 무효화
  queryClient.invalidateQueries({
    queryKey: ['user-reading-status-counts', currentUserId],
    exact: true,
  });
}
