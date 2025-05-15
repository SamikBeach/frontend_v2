'use client';

import { BookOpen, Compass, Home, Lightbulb, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

import { Logo } from '@/components/Logo';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { VisuallyHidden } from '@/components/ui/visually-hidden';

const mainMenuItems = [
  {
    title: '홈',
    icon: Home,
    href: '/',
  },
  {
    title: '분야별 인기',
    icon: Lightbulb,
    href: '/popular',
  },
  {
    title: '발견하기',
    icon: Compass,
    href: '/discover',
  },
  {
    title: '커뮤니티',
    icon: Users,
    href: '/community',
  },
  {
    title: '서재 둘러보기',
    icon: BookOpen,
    href: '/libraries',
  },
];

interface MobileSideSheetProps {
  trigger: React.ReactNode;
}

export function MobileSideSheet({ trigger }: MobileSideSheetProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname.startsWith('/home');
    }
    return pathname.startsWith(href);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="left" className="p-0 sm:max-w-xs">
        <SheetTitle>
          <VisuallyHidden>메인 메뉴</VisuallyHidden>
        </SheetTitle>
        <div className="flex h-full flex-col">
          <div className="flex h-[52px] items-center border-b border-gray-100 px-5">
            <SheetClose asChild>
              <Link href="/" className="flex items-center gap-2">
                <Logo />
              </Link>
            </SheetClose>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="px-1">
              <ul className="flex flex-col gap-1">
                {mainMenuItems.map(item => (
                  <li key={item.title}>
                    <SheetClose asChild>
                      <Link
                        href={item.href}
                        className={`flex h-11 items-center gap-3 rounded-xl px-4 text-[15px] font-medium transition-colors hover:bg-gray-100/80 ${
                          isActive(item.href)
                            ? 'bg-gray-100 font-semibold text-gray-900'
                            : 'text-gray-600'
                        }`}
                      >
                        <item.icon className="h-[21px] w-[21px]" />
                        <span>{item.title}</span>
                      </Link>
                    </SheetClose>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
