'use client';

import { Button } from '@/components/ui/button';
import {
  ResponsiveDropdownMenu,
  ResponsiveDropdownMenuContent,
  ResponsiveDropdownMenuTitle,
  ResponsiveDropdownMenuTrigger,
} from '@/components/ui/responsive-dropdown-menu';
import { Suspense, useState } from 'react';
import { NotificationLoading } from './components/LoadingStates';
import { NotificationBadge } from './components/NotificationBadge';
import { NotificationContent } from './components/NotificationContent';
import { NotificationDropdownProps } from './types';

export function NotificationDropdown({ className }: NotificationDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <ResponsiveDropdownMenu open={open} onOpenChange={setOpen}>
      <ResponsiveDropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`relative text-gray-500 hover:text-gray-900 ${className || ''}`}
        >
          <Suspense fallback={<span className="h-5 w-5" />}>
            <NotificationBadge />
          </Suspense>
        </Button>
      </ResponsiveDropdownMenuTrigger>
      <ResponsiveDropdownMenuContent
        align="end"
        className="max-h-[75vh] w-[480px] overflow-hidden rounded-xl border border-gray-100 p-0"
        drawerClassName="h-[80vh] p-0 overflow-hidden"
        id="notification-scroll-container"
      >
        <ResponsiveDropdownMenuTitle
          className="sr-only"
          drawerClassName="sr-only"
        >
          알림 목록
        </ResponsiveDropdownMenuTitle>
        <Suspense fallback={<NotificationLoading />}>
          <NotificationContent onClose={() => setOpen(false)} isOpen={open} />
        </Suspense>
      </ResponsiveDropdownMenuContent>
    </ResponsiveDropdownMenu>
  );
}

export * from './hooks';
export * from './types';
