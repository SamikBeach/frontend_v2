import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '홈 | 미역서점',
  description: '미역서점에서 책 여행을 시작하세요. 편안한 독서 경험',
  openGraph: {
    title: '홈 | 미역서점',
    description: '미역서점에서 책 여행을 시작하세요. 편안한 독서 경험',
  },
};

export default function HomeLayout({ children }: { children: ReactNode }) {
  return <div className="mt-[56px] w-full px-2 py-4 sm:px-4">{children}</div>;
}
