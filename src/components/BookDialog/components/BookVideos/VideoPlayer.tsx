'use client';

import { YouTubeVideoResult } from '@/apis/youtube';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogPortal,
} from '@/components/ui/responsive-dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface VideoPlayerProps {
  video: YouTubeVideoResult;
  onClose: () => void;
  open: boolean;
}

export function VideoPlayer({ video, onClose, open }: VideoPlayerProps) {
  const isMobile = useIsMobile();

  // ESC 키로 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [onClose, open]);

  // 스크롤 방지
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [open]);

  const embedUrl = `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&showinfo=0`;

  // 모바일에서는 전체화면으로 띄우기
  if (isMobile) {
    if (!open) return null;

    return (
      <div className="fixed inset-0 z-[9999] bg-black">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-200 hover:bg-white/30"
        >
          <X className="h-5 w-5 text-white" />
        </button>

        {/* YouTube iframe - 전체 화면 */}
        <iframe
          src={embedUrl}
          title={video.title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  // 데스크톱에서는 ResponsiveDialog 사용
  return (
    <ResponsiveDialog open={open} onOpenChange={onClose}>
      <ResponsiveDialogPortal>
        {/* X 버튼 - 다이얼로그 바깥 우상단 */}
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-[60] transition-opacity duration-200 hover:opacity-70"
        >
          <X className="h-8 w-8 text-white" />
        </button>

        <ResponsiveDialogContent className="min-w-[60vw] border-0 bg-transparent p-0 shadow-none">
          {/* 배경 클릭으로 닫기 */}
          <div className="absolute inset-0 -z-10" onClick={onClose} />

          {/* 비디오 컨테이너 */}
          <div
            className="relative w-full"
            style={{
              aspectRatio: '16/9',
            }}
          >
            {/* YouTube iframe */}
            <iframe
              src={embedUrl}
              title={video.title}
              className="h-full w-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </ResponsiveDialogContent>
      </ResponsiveDialogPortal>
    </ResponsiveDialog>
  );
}
