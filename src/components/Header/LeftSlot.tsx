import { Logo } from '@/components/Logo';
import Link from 'next/link';

export function LeftSlot() {
  return (
    <div className="flex items-center gap-2">
      <Link href="/">
        <Logo className="h-full" />
      </Link>
    </div>
  );
}
