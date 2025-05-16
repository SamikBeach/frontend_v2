import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '발견하기',
  description: '새로운 고전 도서를 발견하고 다양한 작품을 탐색해보세요',
  openGraph: {
    title: '발견하기 | 고전산책',
    description: '새로운 고전 도서를 발견하고 다양한 작품을 탐색해보세요',
  },
};

export default function DiscoverLayout({ children }: { children: ReactNode }) {
  return <div className="mt-[56px] w-full pb-4 sm:px-4">{children}</div>;
}
