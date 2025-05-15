import { ReactNode } from 'react';

export default function DiscoverLayout({ children }: { children: ReactNode }) {
  return <main className="mt-[56px] w-full px-2 py-4 sm:px-4">{children}</main>;
}
