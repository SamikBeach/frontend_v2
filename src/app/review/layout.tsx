import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '리뷰',
  description: '다양한 서평을 읽고 자유롭게 내 생각을 나눠보세요',
  openGraph: {
    title: '리뷰 | 미역서점',
    description: '다양한 서평을 읽고 자유롭게 내 생각을 나눠보세요',
  },
};

export default function ReviewLayout({ children }: { children: ReactNode }) {
  return <div className="mt-[56px] w-full px-2 py-4 sm:px-4">{children}</div>;
}
