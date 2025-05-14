'use client';

import { Button } from '@/components/ui/button';
import {
  ResponsiveDropdownMenu,
  ResponsiveDropdownMenuContent,
  ResponsiveDropdownMenuTrigger,
} from '@/components/ui/responsive-dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { Suspense, useState } from 'react';
import { NotificationLoading } from './components/LoadingStates';
import { NotificationBadge } from './components/NotificationBadge';
import { NotificationContent } from './components/NotificationContent';
import { NotificationDropdownProps } from './types';

export function Notification({ className }: NotificationDropdownProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

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
        className="h-auto max-h-[75vh] w-[480px] overflow-y-auto rounded-xl border border-gray-100 p-0"
        drawerClassName="w-full p-0 pt-6 items-start justify-start"
        id="notification-scroll-container"
      >
        <Suspense fallback={<NotificationLoading />}>
          <NotificationContent onClose={() => setOpen(false)} isOpen={open} />
        </Suspense>
      </ResponsiveDropdownMenuContent>
    </ResponsiveDropdownMenu>
  );
}
