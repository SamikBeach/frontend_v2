/**
 * API 관련 유틸리티 함수
 */

/**
 * API 기본 URL을 반환합니다.
 * 환경에 따라 다른 URL을 반환할 수 있습니다.
 */
export function getApiBaseUrl(): string {
  // 환경변수에서 API URL을 가져오거나 기본값 사용
  return process.env.NEXT_PUBLIC_API_URL || 'https://api.bookstore.example.com';
}
