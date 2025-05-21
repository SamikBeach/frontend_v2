import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

/**
 * 모바일 환경에서 BottomNav의 보임/숨김 상태를 스크롤 및 Drawer 열림/닫힘에 따라 관리하는 커스텀 훅
 * - Drawer가 열릴 때 BottomNav 상태를 기억하고, 닫힐 때 복원
 * - Drawer가 열려 있는 동안에는 BottomNav 상태를 변경하지 않음
 */
export function useBottomNavScrollVisibility(): [
  boolean,
  Dispatch<SetStateAction<boolean>>,
] {
  const [showBottomNav, setShowBottomNav] = useState(true);
  const lastScrollY = useRef(0);
  const lastBottomNavState = useRef(true);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 639px)').matches;
    if (!isMobile) return;

    let prevBodyPosition = document.body.style.position;

    const handleScroll = () => {
      // Drawer가 열려 있으면 BottomNav 상태를 변경하지 않음
      if (document.body.style.position === 'fixed') {
        return;
      }

      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setShowBottomNav(true);
        lastBottomNavState.current = true;
      } else if (currentScrollY > lastScrollY.current) {
        // 아래로 스크롤할 때 숨김
        setShowBottomNav(false);
        lastBottomNavState.current = false;
      } else {
        // 위로 스크롤할 때 보임
        setShowBottomNav(true);
        lastBottomNavState.current = true;
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Drawer 열림/닫힘 감지
    const observer = new MutationObserver(() => {
      const now = document.body.style.position;
      // Drawer가 열릴 때 BottomNav 상태를 기억
      if (now === 'fixed' && prevBodyPosition !== 'fixed') {
        lastBottomNavState.current = showBottomNav;
      }
      // Drawer가 닫힐 때 BottomNav 상태를 복원
      if (now !== 'fixed' && prevBodyPosition === 'fixed') {
        setShowBottomNav(lastBottomNavState.current);
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
  }, [showBottomNav]);

  return [showBottomNav, setShowBottomNav];
}
