import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '홈',
  description: '고전산책에서 제공하는 다양한 고전 도서와 서재를 만나보세요',
  openGraph: {
    title: '홈 | 고전산책',
    description: '고전산책에서 제공하는 다양한 고전 도서와 서재를 만나보세요',
  },
};

export default function HomeLayout({ children }: { children: ReactNode }) {
  return <div className="mt-[56px] w-full px-2 py-4 sm:px-4">{children}</div>;
}
