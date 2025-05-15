import { ReactNode } from 'react';

export default function PopularLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mt-[56px] w-full px-2 py-1 pb-4 sm:px-4">{children}</main>
  );
}
