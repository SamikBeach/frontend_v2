import { ReactNode } from 'react';

export default function ChatLayout({ children }: { children: ReactNode }) {
  return <div className="mt-[56px] w-full px-2 py-4 sm:px-4">{children}</div>;
}
