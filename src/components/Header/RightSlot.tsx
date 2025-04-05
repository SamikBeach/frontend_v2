'use client';

import { logoutAtom, userAtom } from '@/atoms/auth';
import { useAtom, useSetAtom } from 'jotai';
import { LogOut, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { AuthDialog } from '../Auth/AuthDialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { NotificationButton } from './NotificationButton';

export function RightSlot() {
  const [user] = useAtom(userAtom);
  const logout = useSetAtom(logoutAtom);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <NotificationButton />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gray-200 text-gray-700">
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gray-200 text-gray-700">
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-0.5">
                <p className="text-sm leading-none font-medium">{user.name}</p>
                <p className="text-xs leading-none text-gray-500">
                  @{user.username}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <Link href="/profile">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>내 프로필</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/profile/settings">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>설정</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>로그아웃</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setAuthDialogOpen(true)}
        className="h-9 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      >
        로그인
      </Button>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
}
