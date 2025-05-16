import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '분야별 인기',
  description: '다양한 분야별 인기 도서를 확인하고 독자들의 평가를 살펴보세요',
  openGraph: {
    title: '분야별 인기 | 고전산책',
    description:
      '다양한 분야별 인기 도서를 확인하고 독자들의 평가를 살펴보세요',
  },
};

export default function PopularLayout({ children }: { children: ReactNode }) {
  return <div className="mt-[56px] w-full pb-4 sm:px-4">{children}</div>;
}
