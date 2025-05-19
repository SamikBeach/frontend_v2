import { ReactNode } from 'react';

export default function BookLayout({ children }: { children: ReactNode }) {
  return <div className="mt-[56px] w-full bg-white">{children}</div>;
}
