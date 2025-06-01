import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

/**
 * 모바일 환경에서 필터의 보임/숨김 상태를 스크롤에 따라 관리하는 커스텀 훅
 * - 위로 스크롤하면 보임
 * - 아래로 스크롤하면 숨김
 * - 상단 근처에서는 항상 보임
 * - useHeaderScrollVisibility와 동일한 타이밍으로 동작
 */
export function useFilterScrollVisibility(): [
  boolean,
  Dispatch<SetStateAction<boolean>>,
] {
  const [showFilter, setShowFilter] = useState(true);
  const lastScrollY = useRef(0);
  const lastFilterState = useRef(true);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 639px)').matches;
    if (!isMobile) return;

    let prevBodyPosition = document.body.style.position;

    const handleScroll = () => {
      // Drawer가 열려 있으면 Filter 상태를 변경하지 않음
      if (document.body.style.position === 'fixed') {
        return;
      }

      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setShowFilter(true);
        lastFilterState.current = true;
      } else if (currentScrollY > lastScrollY.current) {
        setShowFilter(false);
        lastFilterState.current = false;
      } else {
        setShowFilter(true);
        lastFilterState.current = true;
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Drawer 열림/닫힘 감지
    const observer = new MutationObserver(() => {
      const now = document.body.style.position;
      // Drawer가 열릴 때 Filter 상태를 기억
      if (now === 'fixed' && prevBodyPosition !== 'fixed') {
        lastFilterState.current = showFilter;
      }
      // Drawer가 닫힐 때 Filter 상태를 복원
      if (now !== 'fixed' && prevBodyPosition === 'fixed') {
        setShowFilter(lastFilterState.current);
      }
      prevBodyPosition = now;
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style'],
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [showFilter]);

  return [showFilter, setShowFilter];
}
