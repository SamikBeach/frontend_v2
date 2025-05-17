import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '발견하기',
  description: '다양한 책들을 발견하고 자유롭게 탐색해보세요',
  openGraph: {
    title: '발견하기 | 미역서점',
    description: '다양한 책들을 발견하고 자유롭게 탐색해보세요',
  },
};

export default function DiscoverLayout({ children }: { children: ReactNode }) {
  return <div className="mt-[56px] w-full pb-4 sm:px-4">{children}</div>;
}
