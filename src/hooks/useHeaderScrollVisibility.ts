import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

/**
 * 모바일 환경에서 Header의 보임/숨김 상태를 스크롤 및 Drawer 열림/닫힘에 따라 관리하는 커스텀 훅
 * - Drawer가 열릴 때 Header 상태를 기억하고, 닫힐 때 복원
 * - Drawer가 열려 있는 동안에는 Header 상태를 변경하지 않음
 */
export function useHeaderScrollVisibility(): [
  boolean,
  Dispatch<SetStateAction<boolean>>,
] {
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const lastHeaderState = useRef(true);
  const isDrawerOpen = useRef(false);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 639px)').matches;
    if (!isMobile) return;

    let prevBodyPosition = document.body.style.position;

    const handleScroll = () => {
      // Drawer가 열려 있으면 Header 상태를 변경하지 않음
      if (isDrawerOpen.current) {
        return;
      }

      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setShowHeader(true);
        lastHeaderState.current = true;
      } else if (currentScrollY > lastScrollY.current) {
        setShowHeader(false);
        lastHeaderState.current = false;
      } else {
        setShowHeader(true);
        lastHeaderState.current = true;
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Drawer 열림/닫힘 감지
    const observer = new MutationObserver(() => {
      const now = document.body.style.position;

      // Drawer가 열릴 때
      if (now === 'fixed' && prevBodyPosition !== 'fixed') {
        isDrawerOpen.current = true;
        lastHeaderState.current = showHeader;
        // Drawer가 열릴 때 Header 상태를 즉시 변경하지 않음
      }

      // Drawer가 닫힐 때
      if (now !== 'fixed' && prevBodyPosition === 'fixed') {
        isDrawerOpen.current = false;
        // 잠시 후에 상태를 복원 (애니메이션이 완료된 후)
        setTimeout(() => {
          setShowHeader(lastHeaderState.current);
        }, 150);
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
  }, [showHeader]);

  return [showHeader, setShowHeader];
}
