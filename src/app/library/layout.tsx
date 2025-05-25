import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '서재 | 미역서점',
  description: '개인 서재에서 자유롭게 책을 정리하고 기록해보세요',
  openGraph: {
    title: '서재 | 미역서점',
    description: '개인 서재에서 자유롭게 책을 정리하고 기록해보세요',
  },
};

export default function LibraryLayout({ children }: { children: ReactNode }) {
  return <div className="mt-[56px] w-full px-3 py-4 sm:px-8">{children}</div>;
}
