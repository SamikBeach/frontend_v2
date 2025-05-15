import { ReactNode } from 'react';

export default function PopularLayout({ children }: { children: ReactNode }) {
  return <div className="mt-[56px] w-full pb-4 sm:px-4">{children}</div>;
}
