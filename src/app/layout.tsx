import { Header } from '@/components/Header';
import { AppSidebar } from '@/components/Sidebar/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import '@/styles/globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: '고전산책',
  description: '고전산책 - 당신의 고전 여행',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="overflow-x-hidden">
        <SidebarProvider>
          <Header />
          <AppSidebar />
          <main className="mt-[56px] w-full">{children}</main>
        </SidebarProvider>
      </body>
    </html>
  );
}
