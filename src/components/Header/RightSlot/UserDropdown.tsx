'use client';

import { logout as logoutApi } from '@/apis/auth';
import { authUtils } from '@/apis/axios';
import { userAtom } from '@/atoms/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  ResponsiveDropdownMenu,
  ResponsiveDropdownMenuContent,
  ResponsiveDropdownMenuItem,
  ResponsiveDropdownMenuSeparator,
  ResponsiveDropdownMenuTrigger,
} from '@/components/ui/responsive-dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMutation } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { LoginButton } from './LoginButton';

interface UserDropdownProps {
  trigger?: ReactNode;
}

export function UserDropdown({ trigger }: UserDropdownProps) {
  const isMobile = useIsMobile();
  const [user, setUser] = useAtom(userAtom);
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  /**
   * 로그아웃 요청을 처리하는 mutation
   * 성공 시 사용자 정보 초기화 및 토큰 제거
   * 실패 시에도 클라이언트에서 로그아웃 처리 진행
   */
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      return logoutApi();
    },
    onSuccess: () => {
      setUser(null);
      authUtils.removeTokens();
    },
    onError: error => {
      console.error('로그아웃 실패:', error);
      setUser(null);
      authUtils.removeTokens();
    },
  });

  /**
   * 로그아웃 버튼 클릭 핸들러
   */
  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  // 프로필 페이지로 이동 핸들러
  const handleProfileClick = () => {
    setIsOpen(false);
    router.push(`/profile/${user?.id}`);
  };

  // 설정 페이지로 이동 핸들러
  const handleSettingsClick = () => {
    setIsOpen(false);
    router.push('/profile/settings');
  };

  // 사용자 표시 정보 설정
  const displayName = user?.username || user?.email.split('@')[0];
  const initial = displayName?.charAt(0).toUpperCase();
  const avatarUrl = user?.profileImage || null;

  if (!user) {
    if (isMobile || !isMounted) return null;
    return <LoginButton />;
  }

  return (
    <ResponsiveDropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <ResponsiveDropdownMenuTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={avatarUrl || undefined} alt={displayName} />
              <AvatarFallback className="bg-gray-200 text-gray-700">
                {initial}
              </AvatarFallback>
            </Avatar>
          </Button>
        )}
      </ResponsiveDropdownMenuTrigger>
      <ResponsiveDropdownMenuContent
        align="end"
        className="w-auto max-w-80 min-w-56"
        drawerClassName="w-full"
      >
        <div className="flex w-full items-center justify-start gap-2 p-2">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={avatarUrl || undefined} alt={displayName} />
            <AvatarFallback className="bg-gray-200 text-gray-700">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col space-y-0.5 text-left">
            <p className="truncate text-sm leading-none font-medium">
              {displayName}
            </p>
            <p className="text-xs leading-none break-all text-gray-500">
              {user.email}
            </p>
          </div>
        </div>
        <ResponsiveDropdownMenuSeparator />
        <ResponsiveDropdownMenuItem
          className="cursor-pointer"
          onSelect={handleProfileClick}
        >
          <UserIcon className="mr-2 h-4 w-4" />
          <span>내 프로필</span>
        </ResponsiveDropdownMenuItem>
        <ResponsiveDropdownMenuItem
          className="cursor-pointer"
          onSelect={handleSettingsClick}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>설정</span>
        </ResponsiveDropdownMenuItem>
        <ResponsiveDropdownMenuSeparator />
        <ResponsiveDropdownMenuItem
          onSelect={handleLogout}
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>로그아웃</span>
        </ResponsiveDropdownMenuItem>
      </ResponsiveDropdownMenuContent>
    </ResponsiveDropdownMenu>
  );
}
