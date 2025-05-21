'use client';

import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogPortal,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { useIsMobile } from '@/hooks/use-mobile';

interface AladinDrawerProps {
  isbn: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AladinDrawer({ isbn, isOpen, onClose }: AladinDrawerProps) {
  const isMobile = useIsMobile();

  if (!isbn) return null;

  // 모바일이 아닌 경우 아무것도 렌더링하지 않음
  if (!isMobile) {
    return null;
  }

  const aladinUrl = `https://www.aladin.co.kr/shop/wproduct.aspx?isbn=${isbn}`;

  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={open => {
        if (!open) onClose();
      }}
      shouldScaleBackground={false}
    >
      <ResponsiveDialogPortal>
        <ResponsiveDialogContent drawerClassName="w-full h-[100dvh] bg-white p-0 rounded-t-[16px] overflow-hidden shadow-lg">
          <div className="flex h-full flex-col">
            <ResponsiveDialogTitle
              className="sr-only"
              drawerClassName="sr-only"
            >
              알라딘 도서 정보
            </ResponsiveDialogTitle>
            <div className="h-full w-full flex-1 overflow-hidden">
              <iframe
                src={aladinUrl}
                title="알라딘 도서 정보"
                className="h-full w-full border-0"
                loading="lazy"
              />
            </div>
          </div>
        </ResponsiveDialogContent>
      </ResponsiveDialogPortal>
    </ResponsiveDialog>
  );
}
