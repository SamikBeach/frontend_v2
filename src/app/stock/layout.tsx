import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '재고 관리',
  description: '도서 재고를 관리하고 도서 정보를 업데이트하세요',
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: '재고 관리 | 고전산책',
    description: '도서 재고를 관리하고 도서 정보를 업데이트하세요',
  },
};

export default function StockLayout({ children }: { children: ReactNode }) {
  return <div className="mt-[56px] w-full px-2 py-4 sm:px-4">{children}</div>;
}
