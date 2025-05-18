import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '대화 | 미역서점',
  description: '다른 독자들과 함께 자유롭게 책에 대해 이야기해보세요',
  openGraph: {
    title: '대화 | 미역서점',
    description: '다른 독자들과 함께 자유롭게 책에 대해 이야기해보세요',
  },
};

export default function ChatLayout({ children }: { children: ReactNode }) {
  return <div className="mt-[56px] w-full px-2 py-4 sm:px-4">{children}</div>;
}
