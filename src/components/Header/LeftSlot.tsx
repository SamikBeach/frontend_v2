import { Logo } from '@/components/Logo';
import { MobileSideSheet } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import Link from 'next/link';

export function LeftSlot() {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center gap-2">
      {isMobile ? (
        <>
          <MobileSideSheet
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-gray-700 hover:bg-gray-100"
                aria-label="메뉴 열기"
              >
                <Menu className="h-5 w-5" />
              </Button>
            }
          />
          <Link href="/">
            <Logo className="h-full" />
          </Link>
        </>
      ) : (
        <Link href="/">
          <Logo className="h-full" />
        </Link>
      )}
    </div>
  );
}
