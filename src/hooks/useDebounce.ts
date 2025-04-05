import { useEffect, useState } from 'react';

/**
 * 입력 값에 대한 디바운스를 적용하는 커스텀 훅
 *
 * @param value - 디바운스할 값
 * @param delay - 디바운스 지연 시간 (밀리초)
 * @returns 디바운스된 값
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 *
 * // debouncedSearchTerm이 변경될 때만 검색 API 호출
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     searchAPI(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
