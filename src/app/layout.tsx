import { BottomNav } from '@/components';
import ClientSideScrollRestorer from '@/components/ClientSideScrollRestorer';
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
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReactNode, Suspense } from 'react';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: '미역서점',
      template: '%s',
    },
    description: '미역서점 - 책과 함께 유유자적',
    keywords: ['고전', '독서', '도서', '서재', '문학', '독서 커뮤니티'],
    authors: [{ name: '미역서점' }],
    creator: '미역서점',
    publisher: '미역서점',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://miyukbooks.com'),
    alternates: {
      canonical: '/',
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: '미역서점',
      description: '미역서점 - 책과 함께 유유자적',
      url: 'https://miyukbooks.com',
      siteName: '미역서점',
      locale: 'ko_KR',
      type: 'website',
      images: [
        {
          url: '/images/og-image.png',
          width: 1024,
          height: 1024,
          alt: '미역서점',
        },
      ],
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

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const messages = await getMessages();

  return (
    <html lang="ko">
      <body className="overflow-x-hidden">
        <ReactQueryProvider>
          <AtomsProvider>
            <NextIntlClientProvider messages={messages}>
              <DialogProvider>
                <Initializer />
                <SidebarProvider>
                  <Header />
                  <AppSidebar />
                  <main className="w-full pb-14 md:pb-0">{children}</main>
                  <BottomNav />
                </SidebarProvider>
                <Toaster />
                <Suspense>
                  <ClientSideScrollRestorer />
                </Suspense>
              </DialogProvider>
            </NextIntlClientProvider>
          </AtomsProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
