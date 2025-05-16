import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '리뷰',
  description: '독자들의 다양한 서평과 독후감을 읽고 내 생각을 공유해보세요',
  openGraph: {
    title: '리뷰 | 고전산책',
    description: '독자들의 다양한 서평과 독후감을 읽고 내 생각을 공유해보세요',
  },
};

export default function ReviewLayout({ children }: { children: ReactNode }) {
  return <div className="mt-[56px] w-full px-2 py-4 sm:px-4">{children}</div>;
}
