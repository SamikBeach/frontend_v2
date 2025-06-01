'use client';

import { FeedbackButton } from '@/components/Feedback';
import { SearchBar } from '@/components/SearchBar';
import { useHeaderScrollVisibility } from '@/hooks';
import { Settings } from 'lucide-react';
import { LeftSlot } from './LeftSlot';
import { Notification } from './RightSlot/Notification';
import { UserDropdown } from './RightSlot/UserDropdown';

export function Header() {
  const [showHeader] = useHeaderScrollVisibility();

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-40 flex min-h-[56px] items-center justify-between border-b border-gray-200/50 bg-white px-2 transition-transform duration-300 sm:translate-y-0 md:px-4 ${
        showHeader ? 'translate-y-0' : '-translate-y-[150%]'
      }`}
    >
      <div className="flex items-center gap-1">
        <LeftSlot />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:hidden sm:block">
        <SearchBar />
      </div>
      <div className="flex items-center gap-2">
        <div className="sm:hidden">
          <SearchBar />
        </div>
        <FeedbackButton />
        <Notification />
        <div className="sm:hidden">
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
        </div>
        <div className="hidden sm:block">
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
