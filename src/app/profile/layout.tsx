import { ReactNode } from 'react';

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mt-[56px] w-full px-4 py-4 sm:px-4 md:px-6">{children}</div>
  );
}
