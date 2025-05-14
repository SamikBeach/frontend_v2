'use client';

import { logout as logoutApi } from '@/apis/auth';
import { authUtils } from '@/apis/axios';
import { User } from '@/apis/user/types';
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
import { useMutation } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

interface UserDropdownProps {
  user: User;
}

export function UserDropdown({ user }: UserDropdownProps) {
  const setUser = useSetAtom(userAtom);

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
  };

  // 사용자 표시 정보 설정
  const displayName = user.username || user.email.split('@')[0];
  const initial = displayName.charAt(0).toUpperCase();
  const avatarUrl = user.profileImage || null;

  return (
    <ResponsiveDropdownMenu>
      <ResponsiveDropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src={avatarUrl || undefined} alt={displayName} />
            <AvatarFallback className="bg-gray-200 text-gray-700">
              {initial}
            </AvatarFallback>
          </Avatar>
        </Button>
      </ResponsiveDropdownMenuTrigger>
      <ResponsiveDropdownMenuContent
        align="end"
        className="w-56"
        drawerClassName="w-full"
      >
        <div className="flex w-full items-center justify-start gap-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl || undefined} alt={displayName} />
            <AvatarFallback className="bg-gray-200 text-gray-700">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5 text-left">
            <p className="text-sm leading-none font-medium">{displayName}</p>
            <p className="text-xs leading-none text-gray-500">{user.email}</p>
          </div>
        </div>
        <ResponsiveDropdownMenuSeparator />
        <Link href={`/profile/${user.id}`} passHref legacyBehavior>
          <ResponsiveDropdownMenuItem className="cursor-pointer" asChild>
            <a className="flex w-full items-center">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>내 프로필</span>
            </a>
          </ResponsiveDropdownMenuItem>
        </Link>
        <Link href="/profile/settings" passHref legacyBehavior>
          <ResponsiveDropdownMenuItem className="cursor-pointer" asChild>
            <a className="flex w-full items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>설정</span>
            </a>
          </ResponsiveDropdownMenuItem>
        </Link>
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
