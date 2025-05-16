import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '커뮤니티',
  description:
    '독서 커뮤니티에서 다양한 사람들과 함께 책에 대한 생각과 의견을 나눠보세요',
  openGraph: {
    title: '커뮤니티 | 고전산책',
    description:
      '독서 커뮤니티에서 다양한 사람들과 함께 책에 대한 생각과 의견을 나눠보세요',
  },
};

export default function CommunityLayout({ children }: { children: ReactNode }) {
  return <div className="mt-[56px] w-full px-2 sm:px-4">{children}</div>;
}
