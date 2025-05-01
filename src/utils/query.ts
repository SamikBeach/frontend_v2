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

  // 사용자 서재 목록 쿼리 무효화
  queryClient.invalidateQueries({
    queryKey: ['user-libraries-infinite', currentUserId],
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

/**
 * 사용자 별점과 관련된 쿼리만 무효화하는 함수
 * @param queryClient React Query 클라이언트
 * @param pathname 현재 경로
 * @param currentUserId 현재 사용자 ID
 */
export function invalidateUserRatingQueries(
  queryClient: QueryClient,
  pathname: string,
  currentUserId?: number | null
): void {
  // 자신의 프로필 페이지가 아니면 무효화하지 않음
  if (!isCurrentUserProfilePage(pathname, currentUserId)) return;

  // 사용자 별점 관련 쿼리 무효화
  queryClient.invalidateQueries({
    queryKey: ['user-ratings-infinite', currentUserId],
    exact: false,
  });

  // 사용자 리뷰 관련 쿼리 무효화 - 별점만 변경했을 때도 리뷰 목록 갱신하기 위함
  queryClient.invalidateQueries({
    queryKey: ['user-reviews-infinite', currentUserId],
    exact: false,
  });

  // 사용자 활동 관련 쿼리 무효화 - rating 변경될 때도 활동 목록을 갱신하기 위함
  queryClient.invalidateQueries({
    queryKey: ['user-activity-infinite', currentUserId],
    exact: false,
  });

  // 커뮤니티 페이지에서도 갱신되도록 추가
  queryClient.invalidateQueries({
    queryKey: ['communityReviews'],
    exact: false,
  });
}

/**
 * 리뷰와 별점을 함께 처리할 때 사용하는 무효화 함수
 * 활동 쿼리를 한 번만 무효화하여 중복 API 호출 방지
 * @param queryClient React Query 클라이언트
 * @param pathname 현재 경로
 * @param currentUserId 현재 사용자 ID
 */
export function invalidateReviewAndRatingQueries(
  queryClient: QueryClient,
  pathname: string,
  currentUserId?: number | null
): void {
  // 커뮤니티 리뷰 목록 항상 무효화 (위치에 관계없이)
  queryClient.invalidateQueries({
    queryKey: ['communityReviews'],
    exact: false,
  });

  // 자신의 프로필 페이지가 아니면 아래 프로필 관련 무효화를 건너뜀
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

  // 사용자 활동 관련 쿼리 무효화 (한 번만 호출됨)
  queryClient.invalidateQueries({
    queryKey: ['user-activity-infinite', currentUserId],
    exact: false,
  });

  // 사용자 서재 목록 쿼리 무효화
  queryClient.invalidateQueries({
    queryKey: ['user-libraries-infinite', currentUserId],
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
