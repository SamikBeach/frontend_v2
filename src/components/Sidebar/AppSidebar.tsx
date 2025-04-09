'use client';

import { BookOpen, Compass, Home, Lightbulb, Menu, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
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
import { VisuallyHidden } from '@/components/ui/visually-hidden';
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
    icon: BookOpen,
    href: '/libraries',
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // pathname이 변경될 때 모바일 메뉴 닫기
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // 모바일 메뉴
  if (isMobile) {
    return (
      <>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed bottom-6 left-6 z-50 h-12 w-12 rounded-full bg-gray-900 text-white shadow-lg hover:bg-gray-800"
              aria-label="메뉴 열기"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 sm:max-w-xs">
            <SheetTitle>
              <VisuallyHidden>메인 메뉴</VisuallyHidden>
            </SheetTitle>
            <div className="flex h-full flex-col">
              <div className="flex h-[52px] items-center border-b border-gray-100 px-5">
                <Link href="/" className="flex items-center gap-2">
                  <Logo />
                </Link>
              </div>
              <div className="flex-1 overflow-auto py-2">
                <nav className="px-1">
                  <ul className="flex flex-col gap-1">
                    {mainMenuItems.map(item => (
                      <li key={item.title}>
                        <Link
                          href={item.href}
                          className={`flex h-11 items-center gap-3 rounded-xl px-4 text-[15px] font-medium transition-colors hover:bg-gray-100/80 ${
                            isActive(item.href)
                              ? 'bg-gray-100 font-semibold text-gray-900'
                              : 'text-gray-600'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <item.icon className="h-[21px] w-[21px]" />
                          <span>{item.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
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
