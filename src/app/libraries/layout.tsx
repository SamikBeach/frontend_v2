import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '서재 둘러보기',
  description:
    '다양한 서재를 둘러보고 관심 있는 서재를 구독하여 독서 취향을 공유해보세요',
  openGraph: {
    title: '서재 둘러보기 | 고전산책',
    description:
      '다양한 서재를 둘러보고 관심 있는 서재를 구독하여 독서 취향을 공유해보세요',
  },
};

export default function LibrariesLayout({ children }: { children: ReactNode }) {
  return <div className="mt-[56px] w-full sm:px-4">{children}</div>;
}
