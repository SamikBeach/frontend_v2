import { useRouter } from 'next/navigation';
import { useIsMobile } from './use-mobile';
import { useDialogQuery } from './useDialogQuery';

/**
 * 모바일이면 book 상세 페이지로 이동, 아니면 BookDialog를 open하는 커스텀 훅
 * @returns openBookDetail 함수 (isbn 또는 id, idType 전달)
 */
export function useBookDetailOpen() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const dialog = useDialogQuery({ type: 'book' });

  /**
   * 도서 상세 열기 함수
   * @param value isbn 또는 id 값
   * @param idType 'isbn' | 'id' (기본값: 'isbn')
   */
  function openBookDetail(value: string) {
    if (isMobile) {
      router.push(`/book/${value}`);
    } else {
      dialog.open(value);
    }
  }

  return openBookDetail;
}
