import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '커뮤니티 | 미역서점',
  description: '다른 독자들과 함께 자유롭게 생각을 나눠보세요',
  openGraph: {
    title: '커뮤니티 | 미역서점',
    description: '다른 독자들과 함께 자유롭게 생각을 나눠보세요',
  },
};

export default function CommunityLayout({ children }: { children: ReactNode }) {
  return <div className="mt-[56px] w-full px-2 sm:px-4">{children}</div>;
}
