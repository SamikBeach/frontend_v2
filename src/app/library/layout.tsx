import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '서재',
  description: '개인 서재에서 책을 관리하고 읽기 상태를 기록해보세요',
  openGraph: {
    title: '서재 | 고전산책',
    description: '개인 서재에서 책을 관리하고 읽기 상태를 기록해보세요',
  },
};

export default function LibraryLayout({ children }: { children: ReactNode }) {
  return <div className="mt-[56px] w-full px-3 py-4 sm:px-4">{children}</div>;
}
