import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '로그인 및 회원가입 | 미역서점',
  description:
    '미역서점에 로그인하거나 새 계정을 만들어 미역서점을 함께 즐겨보세요',
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: '로그인 및 회원가입 | 미역서점',
    description:
      '미역서점에 로그인하거나 새 계정을 만들어 미역서점을 함께 즐겨보세요',
  },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="mt-[56px] w-full px-2 py-4 sm:px-4">{children}</div>;
}
