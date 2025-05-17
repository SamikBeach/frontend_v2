import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '서재 둘러보기 | 미역서점',
  description: '다양한 서재를 자유롭게 둘러보고 독서 취향을 나눠보세요',
  openGraph: {
    title: '서재 둘러보기 | 미역서점',
    description: '다양한 서재를 자유롭게 둘러보고 독서 취향을 나눠보세요',
  },
};

export default function LibrariesLayout({ children }: { children: ReactNode }) {
  return <div className="mt-[56px] w-full sm:px-4">{children}</div>;
}
