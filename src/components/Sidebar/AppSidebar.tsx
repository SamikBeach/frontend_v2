'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { useAtom } from 'jotai';
import { BookOpen, Compass, Home, Lightbulb, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { sidebarExpandedAtom } from '@/atoms/sidebar';
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
  const [isExpanded, setIsExpanded] = useAtom(sidebarExpandedAtom);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <SidebarProvider defaultOpen={isExpanded} onOpenChange={setIsExpanded}>
      <Sidebar
        collapsible="icon"
        style={
          {
            '--sidebar-width': '17rem',
            '--sidebar-width-icon': '4rem',
          } as React.CSSProperties
        }
      >
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
                        <item.icon className="h-[21px]! w-[21px]!" />
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
        <SidebarTrigger className="rounded-xl bg-white/80 backdrop-blur-xl hover:bg-gray-100/80" />
      </div>
    </SidebarProvider>
  );
}
