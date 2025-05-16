import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '대화',
  description: '다른 독자들과 함께 책과 독서에 대해 대화를 나눠보세요',
  openGraph: {
    title: '대화 | 고전산책',
    description: '다른 독자들과 함께 책과 독서에 대해 대화를 나눠보세요',
  },
};

export default function ChatLayout({ children }: { children: ReactNode }) {
  return <div className="mt-[56px] w-full px-2 py-4 sm:px-4">{children}</div>;
}
