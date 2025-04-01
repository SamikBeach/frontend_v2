import { Logo } from '@/components/Logo';
import Link from 'next/link';

export function LeftSlot() {
  return (
    <Link href="/">
      <Logo className="h-full" />
    </Link>
  );
}
