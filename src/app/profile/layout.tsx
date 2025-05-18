import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '프로필 | 미역서점',
  description: '나의 독서 활동과 자유로운 독서 여정을 확인해보세요',
  openGraph: {
    title: '프로필 | 미역서점',
    description: '나의 독서 활동과 자유로운 독서 여정을 확인해보세요',
  },
};

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mt-[56px] w-full px-4 py-4 sm:px-4 md:px-6">{children}</div>
  );
}
