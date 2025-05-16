import { Header } from '@/components/Header';
import { Initializer } from '@/components/Initializer';
import { AppSidebar } from '@/components/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { AtomsProvider } from '@/providers/AtomsProvider';
import { DialogProvider } from '@/providers/DialogProvider';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import '@/styles/globals.css';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: '고전산책',
      template: '%s | 고전산책',
    },
    description: '고전산책 - 당신의 고전 여행을 위한 최고의 플랫폼',
    keywords: ['고전', '독서', '도서', '서재', '문학', '독서 커뮤니티'],
    authors: [{ name: '고전산책' }],
    creator: '고전산책',
    publisher: '고전산책',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://gocheonsan.com'),
    alternates: {
      canonical: '/',
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: '고전산책',
      description: '고전산책 - 당신의 고전 여행을 위한 최고의 플랫폼',
      url: 'https://gocheonsan.com',
      siteName: '고전산책',
      locale: 'ko_KR',
      type: 'website',
    },
    icons: {
      icon: [
        { url: '/favicon.ico' },
        {
          url: '/favicons/favicon-96x96.png',
          sizes: '96x96',
          type: 'image/png',
        },
        { url: '/favicons/favicon.svg', type: 'image/svg+xml' },
      ],
      apple: [{ url: '/favicons/apple-touch-icon.png' }],
      other: [
        {
          rel: 'manifest',
          url: '/favicons/site.webmanifest',
        },
      ],
    },
  };
}

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
                <div className="w-full">{children}</div>
              </SidebarProvider>
              <Toaster />
            </DialogProvider>
          </AtomsProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
