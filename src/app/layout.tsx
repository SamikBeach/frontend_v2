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
      <body className="bg-background min-h-screen">
        <SidebarProvider>
          <div className="relative flex min-h-screen">
            <AppSidebar />
            <div className="flex-1">
              <Header />
              <main className="container mx-auto px-4 py-8 pt-[72px]">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
