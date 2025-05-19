'use client';

import { AuthDialog } from '@/components/Auth/AuthDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { cn } from '@/lib/utils';
import { BookOpen, Compass, Flame, Home, User, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const NAV_ITEMS = [
  {
    label: '홈',
    href: '/home',
    icon: Home,
  },
  {
    label: '분야별 인기',
    href: '/popular',
    icon: Flame,
  },
  {
    label: '발견하기',
    href: '/discover',
    icon: Compass,
  },
  {
    label: '커뮤니티',
    href: '/community',
    icon: Users,
  },
  {
    label: '서재',
    href: '/libraries',
    icon: BookOpen,
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const currentUser = useCurrentUser();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  // activeColor는 green-800, inactiveColor는 gray-500으로 조금 더 진하게
  const activeColor = 'text-green-800';
  const inactiveColor = 'text-gray-500';
  const iconSize = 22;
  const iconStroke = 1.4;
  const fontClass = 'text-[11px]';

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-50 flex h-16 w-full items-center justify-between border-t border-gray-100 bg-white px-1 md:hidden"
      role="navigation"
      aria-label="모바일 하단 메뉴"
    >
      {/* 일반 메뉴 */}
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-0.5 rounded-md py-1.5 transition-colors duration-150 hover:bg-gray-50',
              isActive ? activeColor : inactiveColor
            )}
            aria-current={isActive ? 'page' : undefined}
            tabIndex={0}
          >
            <Icon
              className={cn(
                'mb-0.5 transition-colors duration-150',
                isActive ? activeColor : inactiveColor
              )}
              size={iconSize}
              strokeWidth={iconStroke}
            />
            <span
              className={cn(
                fontClass,
                isActive ? 'font-semibold' : 'font-normal',
                isActive ? activeColor : inactiveColor
              )}
            >
              {label}
            </span>
          </Link>
        );
      })}
      {/* 내 프로필 메뉴 */}
      <button
        type="button"
        className={cn(
          'flex flex-1 flex-col items-center justify-center gap-0.5 rounded-md py-1.5 transition-colors duration-150 hover:bg-gray-50 focus:outline-none',
          pathname.startsWith('/profile') ? activeColor : inactiveColor
        )}
        aria-current={pathname.startsWith('/profile') ? 'page' : undefined}
        tabIndex={0}
        onClick={() => {
          if (currentUser?.id) {
            router.push(`/profile/${currentUser.id}`);
          } else {
            setAuthDialogOpen(true);
          }
        }}
      >
        {/* 로그인 상태: Avatar, 로그아웃 상태: User 아이콘 */}
        {currentUser ? (
          <Avatar
            className={cn(
              'mb-0.5 h-6 w-6',
              pathname.startsWith('/profile')
                ? 'ring-2 ring-green-800'
                : 'ring-1 ring-gray-300'
            )}
          >
            {currentUser.profileImage ? (
              <AvatarImage
                src={currentUser.profileImage}
                alt={currentUser.username || currentUser.email || '아바타'}
              />
            ) : null}
            <AvatarFallback className="bg-gray-200 text-xs text-gray-700">
              {(
                currentUser.username?.[0] ||
                currentUser.email?.[0] ||
                '?'
              ).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <User
            className={cn(
              'mb-0.5 transition-colors duration-150',
              pathname.startsWith('/profile') ? activeColor : inactiveColor
            )}
            size={iconSize}
            strokeWidth={iconStroke}
          />
        )}
        <span
          className={cn(
            fontClass,
            pathname.startsWith('/profile') ? 'font-semibold' : 'font-normal',
            pathname.startsWith('/profile') ? activeColor : inactiveColor
          )}
        >
          My
        </span>
      </button>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </nav>
  );
}
