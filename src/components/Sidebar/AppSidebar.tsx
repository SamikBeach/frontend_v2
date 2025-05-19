'use client';

import { Compass, Home, Library, Lightbulb, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Logo } from '@/components/Logo';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

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
    icon: Library,
    href: '/libraries',
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const isActive = (href: string) => {
    if (href === '/') {
      // 홈 메뉴는 / 경로이거나 /home으로 시작하는 경로에서 활성화
      return pathname === '/' || pathname.startsWith('/home');
    }
    return pathname.startsWith(href);
  };

  // 모바일 환경에서는 사이드바를 표시하지 않음
  if (isMobile) {
    return null;
  }

  // 데스크톱 메뉴
  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader className="h-[56px] px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
        </SidebarHeader>
        <SidebarContent className="border-r-0 px-1 pt-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainMenuItems.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="h-11 rounded-xl px-4 text-[15px] font-medium text-gray-600 transition-colors hover:bg-gray-100/80 data-[active=true]:bg-gray-100 data-[active=true]:font-semibold data-[active=true]:text-gray-900"
                      data-active={isActive(item.href)}
                      tooltip={item.title}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-3"
                      >
                        <item.icon className="h-[21px] w-[21px]" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <div className="fixed bottom-3 left-4 z-50 hidden md:block">
        <SidebarTrigger className="rounded-xl bg-white/80 backdrop-blur-xl hover:bg-gray-100/80" />
      </div>
    </>
  );
}
