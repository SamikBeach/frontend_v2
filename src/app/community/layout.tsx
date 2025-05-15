import { ReactNode } from 'react';

export default function CommunityLayout({ children }: { children: ReactNode }) {
  return <div className="mt-[56px] w-full px-2 sm:px-4">{children}</div>;
}
