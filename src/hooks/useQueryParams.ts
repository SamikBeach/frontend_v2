import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

/**
 * URL query parameter를 관리하기 위한 커스텀 훅
 *
 * @example
 * ```tsx
 * const { updateQueryParams } = useQueryParams();
 *
 * // 단일 파라미터 업데이트
 * updateQueryParams({ sort: 'recent' });
 *
 * // 여러 파라미터 동시 업데이트
 * updateQueryParams({ sort: 'recent', view: 'grid' });
 *
 * // 파라미터 삭제
 * updateQueryParams({ sort: undefined });
 * ```
 *
 * @returns {Object} query parameter 관련 유틸리티
 * @property {URLSearchParams} searchParams - 현재 URL의 query parameter
 * @property {Function} updateQueryParams - query parameter를 업데이트하는 함수
 */
export function useQueryParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  /**
   * URL query parameter를 업데이트하는 함수
   *
   * @param {Record<string, string | undefined>} updates - 업데이트할 파라미터 객체
   * - key: 파라미터 이름
   * - value: 파라미터 값 (undefined인 경우 해당 파라미터 삭제)
   * @param {Object} options - 업데이트 옵션
   * @param {boolean} options.replace - history에 기록하지 않고 현재 URL을 대체할지 여부
   */
  const updateQueryParams = useCallback(
    (
      updates: Record<string, string | undefined>,
      options: { replace?: boolean } = {}
    ) => {
      // 현재 URL의 모든 query parameter를 복사
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      // 업데이트할 파라미터들을 순회하며 적용
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined) {
          current.delete(key);
        } else {
          current.set(key, value);
        }
      });

      // 업데이트된 query parameter로 URL 변경
      const search = current.toString();
      const query = search ? `?${search}` : '';

      if (options.replace) {
        router.replace(`${pathname}${query}`, { scroll: false });
      } else {
        router.push(`${pathname}${query}`, { scroll: false });
      }
    },
    [searchParams, pathname, router]
  );

  /**
   * 현재 URL에서 특정 쿼리 파라미터의 값을 가져오는 함수
   */
  const getQueryParam = useCallback(
    (key: string) => {
      return searchParams.get(key);
    },
    [searchParams]
  );

  /**
   * 모든 쿼리 파라미터를 제거하는 함수
   */
  const clearQueryParams = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  return {
    searchParams,
    updateQueryParams,
    getQueryParam,
    clearQueryParams,
  };
}
