'use client';

import { FeedbackButton } from '@/components/Feedback';
import { SearchBar } from '@/components/SearchBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Settings } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { LeftSlot } from './LeftSlot';
import { Notification } from './RightSlot/Notification';
import { UserDropdown } from './RightSlot/UserDropdown';

export function Header() {
  const isMobile = useIsMobile();
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!isMobile) return;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY.current) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-40 flex min-h-[56px] items-center justify-between border-b border-gray-200/50 bg-white transition-transform duration-300 ${
        isMobile ? 'px-2' : 'px-4'
      } ${isMobile ? (showHeader ? 'translate-y-0' : '-translate-y-full') : ''}`}
    >
      <div className="flex items-center gap-1">
        <LeftSlot />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:hidden sm:block">
        <SearchBar />
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden max-sm:block">
          <SearchBar />
        </div>
        <FeedbackButton />
        <Notification />
        {isMobile ? (
          <UserDropdown
            trigger={
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
                aria-label="설정"
              >
                <Settings className="h-4 w-4 text-gray-500" />
              </button>
            }
          />
        ) : (
          <UserDropdown />
        )}
      </div>
    </header>
  );
}
