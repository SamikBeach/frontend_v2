import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '로그인 및 회원가입',
  description:
    '고전산책에 로그인하거나 새 계정을 만들어 다양한 기능을 이용해보세요',
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: '로그인 및 회원가입 | 고전산책',
    description:
      '고전산책에 로그인하거나 새 계정을 만들어 다양한 기능을 이용해보세요',
  },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="mt-[56px] w-full px-2 py-4 sm:px-4">{children}</div>;
}
