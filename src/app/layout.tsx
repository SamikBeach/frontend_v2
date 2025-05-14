import { Header } from '@/components/Header';
import { Initializer } from '@/components/Initializer';
import { AppSidebar } from '@/components/Sidebar/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { AtomsProvider } from '@/providers/AtomsProvider';
import { DialogProvider } from '@/providers/DialogProvider';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
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
        <ReactQueryProvider>
          <AtomsProvider>
            <DialogProvider>
              <Initializer />
              <SidebarProvider>
                <Header />
                <AppSidebar />
                <main className="mt-[56px] w-full px-2 py-4 sm:px-4">
                  {children}
                </main>
              </SidebarProvider>
              <Toaster />
            </DialogProvider>
          </AtomsProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
