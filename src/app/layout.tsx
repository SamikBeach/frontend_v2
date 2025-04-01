import { Header } from '@/components/Header';
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
        <main className="pt-[56px]">
          <Header />
          {children}
        </main>
      </body>
    </html>
  );
}
