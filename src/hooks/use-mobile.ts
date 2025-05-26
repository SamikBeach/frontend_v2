import * as React from 'react';

const MOBILE_BREAKPOINT = 1024;

// 서버 사이드에서는 useEffect, 클라이언트에서는 useLayoutEffect 사용
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

/**
 * 현재 화면이 모바일 크기인지 확인하는 훅
 * @returns 모바일 크기일 경우 true, 그렇지 않을 경우 false를 반환
 */
export function useIsMobile() {
  // 초기값을 false로 설정하여 하이드레이션 미스매치 방지
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  // useIsomorphicLayoutEffect를 사용하여 환경에 맞는 effect 실행
  useIsomorphicLayoutEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // 초기값 설정
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}
