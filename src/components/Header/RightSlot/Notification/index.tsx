'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Suspense, useState } from 'react';
import { NotificationLoading } from './components/LoadingStates';
import { NotificationBadge } from './components/NotificationBadge';
import { NotificationContent } from './components/NotificationContent';
import { NotificationDropdownProps } from './types';

export function NotificationDropdown({ className }: NotificationDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`relative text-gray-500 hover:text-gray-900 ${className || ''}`}
        >
          <Suspense fallback={<span className="h-5 w-5" />}>
            <NotificationBadge />
          </Suspense>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-[75vh] w-[480px] overflow-y-auto rounded-xl border border-gray-100 p-0"
        id="notification-scroll-container"
      >
        <Suspense fallback={<NotificationLoading />}>
          <NotificationContent onClose={() => setOpen(false)} isOpen={open} />
        </Suspense>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export * from './hooks';
export * from './types';
