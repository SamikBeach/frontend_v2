import { ReactNode } from 'react';

export default function LibrariesLayout({ children }: { children: ReactNode }) {
  return <div className="mt-[56px] w-full sm:px-4">{children}</div>;
}
