import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '프로필',
  description: '나의 독서 활동과 통계를 확인하고 프로필을 관리해보세요',
  openGraph: {
    title: '프로필 | 고전산책',
    description: '나의 독서 활동과 통계를 확인하고 프로필을 관리해보세요',
  },
};

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mt-[56px] w-full px-4 py-4 sm:px-4 md:px-6">{children}</div>
  );
}
