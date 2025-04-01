'use client';

import { BookOpen, Compass, Home, Lightbulb, Users } from 'lucide-react';
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

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <Sidebar
        collapsible="icon"
        style={
          {
            '--sidebar-width': '16rem',
            '--sidebar-width-icon': '4rem',
          } as React.CSSProperties
        }
      >
        <SidebarHeader className="h-[56px] px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-6" />
          </Link>
        </SidebarHeader>
        <SidebarContent className="min-w-10 bg-white px-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainMenuItems.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="h-10 px-4 text-[15px] font-medium"
                      data-active={isActive(item.href)}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-[20px]! w-[20px]!" />
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
      <div className="fixed bottom-3 left-4 z-50">
        <SidebarTrigger />
      </div>
    </>
  );
}
