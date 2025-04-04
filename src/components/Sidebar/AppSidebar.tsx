'use client';

import { BookOpen, Compass, Home, Lightbulb, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

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
    subMenus: [],
  },
  {
    title: '분야별 고전',
    icon: Lightbulb,
    href: '/popular',
    subMenus: [
      { title: '철학', href: '/popular?category=philosophy' },
      { title: '문학', href: '/popular?category=literature' },
      { title: '역사', href: '/popular?category=history' },
      { title: '고전학', href: '/popular?category=classics' },
      { title: '종교', href: '/popular?category=religion' },
      { title: '사회과학', href: '/popular?category=social' },
      { title: '자연과학', href: '/popular?category=science' },
      { title: '예술', href: '/popular?category=art' },
    ],
  },
  {
    title: '오늘의 발견',
    icon: Compass,
    href: '/discover',
    subMenus: [
      { title: '오늘의 추천', href: '/discover/today' },
      { title: '이번 주 테마', href: '/discover/weekly' },
      { title: '큐레이터 추천', href: '/discover/curators' },
      { title: '신작 소개', href: '/discover/new' },
    ],
  },
  {
    title: '커뮤니티',
    icon: Users,
    href: '/community',
    subMenus: [
      { title: '독서 토론', href: '/community/discussions' },
      { title: '서평 나눔', href: '/community/reviews' },
      { title: '독서 모임', href: '/community/groups' },
      { title: '이벤트', href: '/community/events' },
    ],
  },
  {
    title: '서재 둘러보기',
    icon: BookOpen,
    href: '/libraries',
    subMenus: [
      { title: '인기 서재', href: '/libraries/popular' },
      { title: '새로운 서재', href: '/libraries/new' },
      { title: '주제별 서재', href: '/libraries/topics' },
      { title: '팔로우한 서재', href: '/libraries/following' },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleMenuClick = (title: string) => {
    if (expandedMenu === title) {
      setExpandedMenu(null);
    } else {
      setExpandedMenu(title);
    }
  };

  useEffect(() => {
    const currentMenu = mainMenuItems.find(
      item => pathname === item.href || pathname.startsWith(`${item.href}/`)
    );
    if (currentMenu) {
      setExpandedMenu(currentMenu.title);
    }
  }, [pathname]);

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader className="h-[56px] px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
        </SidebarHeader>
        <SidebarContent className="bg-white px-1">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainMenuItems.map(item => (
                  <div key={item.title}>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        className="h-11 rounded-xl px-4 text-[15px] font-medium text-gray-600 transition-colors hover:bg-gray-100/80 data-[active=true]:bg-gray-100 data-[active=true]:font-semibold data-[active=true]:text-gray-900"
                        data-active={isActive(item.href)}
                        tooltip={item.title}
                        onClick={() => handleMenuClick(item.title)}
                      >
                        <Link
                          href={item.href}
                          className="flex w-full items-center gap-3"
                        >
                          <item.icon className="h-[21px]! w-[21px]!" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    {expandedMenu === item.title &&
                      item.subMenus.length > 0 && (
                        <div className="mt-1 mb-2 ml-10 space-y-1">
                          {item.subMenus.map(subMenu => (
                            <Link
                              key={subMenu.title}
                              href={subMenu.href}
                              className={`block rounded-lg px-4 py-1.5 text-[14px] transition-colors ${
                                pathname === subMenu.href
                                  ? 'font-medium text-blue-600'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {subMenu.title}
                            </Link>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <div className="fixed bottom-3 left-4 z-50">
        <SidebarTrigger className="rounded-xl bg-white/80 backdrop-blur-xl hover:bg-gray-100/80" />
      </div>
    </>
  );
}
