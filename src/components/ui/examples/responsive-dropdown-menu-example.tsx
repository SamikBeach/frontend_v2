'use client';

import { Button } from '@/components/ui/button';
import {
  ResponsiveDropdownMenu,
  ResponsiveDropdownMenuClose,
  ResponsiveDropdownMenuContent,
  ResponsiveDropdownMenuGroup,
  ResponsiveDropdownMenuItem,
  ResponsiveDropdownMenuLabel,
  ResponsiveDropdownMenuSeparator,
  ResponsiveDropdownMenuTrigger,
} from '@/components/ui/responsive-dropdown-menu';
import { CreditCard, LogOut, Settings, User } from 'lucide-react';

export function ResponsiveDropdownMenuExample() {
  return (
    <ResponsiveDropdownMenu>
      <ResponsiveDropdownMenuTrigger asChild>
        <Button variant="outline">메뉴 열기</Button>
      </ResponsiveDropdownMenuTrigger>
      <ResponsiveDropdownMenuContent className="w-56" drawerClassName="px-2">
        <ResponsiveDropdownMenuClose />
        <ResponsiveDropdownMenuLabel>내 계정</ResponsiveDropdownMenuLabel>
        <ResponsiveDropdownMenuSeparator />
        <ResponsiveDropdownMenuGroup>
          <ResponsiveDropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>프로필</span>
          </ResponsiveDropdownMenuItem>
          <ResponsiveDropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>결제 정보</span>
          </ResponsiveDropdownMenuItem>
          <ResponsiveDropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>설정</span>
          </ResponsiveDropdownMenuItem>
        </ResponsiveDropdownMenuGroup>
        <ResponsiveDropdownMenuSeparator />
        <ResponsiveDropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>로그아웃</span>
        </ResponsiveDropdownMenuItem>
      </ResponsiveDropdownMenuContent>
    </ResponsiveDropdownMenu>
  );
}
