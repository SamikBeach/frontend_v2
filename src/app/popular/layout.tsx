import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '분야별 인기 | 미역서점',
  description: '다양한 분야의 인기 도서를 둘러보세요',
  openGraph: {
    title: '분야별 인기 | 미역서점',
    description: '다양한 분야의 인기 도서를 둘러보세요',
  },
};

export default function PopularLayout({ children }: { children: ReactNode }) {
  return <div className="mt-[56px] w-full pb-4 sm:px-4">{children}</div>;
}
