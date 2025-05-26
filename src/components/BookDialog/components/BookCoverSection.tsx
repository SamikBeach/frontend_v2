import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useCallback, useState } from 'react';
import { useBookDetails } from '../hooks';
import { AladinDrawer } from './AladinDrawer';

export function BookCoverSection() {
  const { book, isbn } = useBookDetails();
  const [isAladinDrawerOpen, setIsAladinDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

  // 알라딘 페이지 열기 핸들러
  const handleOpenAladin = useCallback(() => {
    if (!isbn) return;

    if (isMobile) {
      // 모바일에서는 드로어 열기
      setIsAladinDrawerOpen(true);
    } else {
      // 데스크톱에서는 새 창으로 열기
      window.open(
        `https://www.aladin.co.kr/shop/wproduct.aspx?isbn=${isbn}`,
        '_blank'
      );
    }
  }, [isbn, isMobile]);

  // drawer 닫기
  const handleCloseAladinDrawer = useCallback(() => {
    setIsAladinDrawerOpen(false);
  }, []);

  if (!book) return null;

  // 출간일 포맷팅
  const formattedDate = book.publishDate
    ? typeof book.publishDate === 'string'
      ? format(parseISO(book.publishDate), 'yyyy년 MM월 dd일', {
          locale: ko,
        })
      : format(new Date(book.publishDate), 'yyyy년 MM월 dd일', {
          locale: ko,
        })
    : '';

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* 책 표지 이미지 */}
      <div
        className="relative mx-auto w-44 cursor-pointer overflow-hidden rounded-2xl bg-gray-50 md:w-56 lg:w-64"
        onClick={handleOpenAladin}
      >
        <img
          src={book.coverImage}
          alt={book.title}
          className="h-auto w-full object-contain"
          loading="eager"
        />
      </div>

      {/* 책 정보(제목, 저자, 출판사, 출간일)는 이미지 아래에 배치 */}
      <div className="space-y-2 px-1 md:px-0">
        <div className="text-center md:text-left">
          <h2
            className="inline cursor-pointer text-lg font-bold text-gray-900 md:text-xl"
            onClick={handleOpenAladin}
          >
            {book.title}
          </h2>
          {/* 카테고리 태그 - 제목 바로 뒤에 인라인으로 배치 */}
          {book.category && (
            <Badge className="ml-2 rounded-full bg-gray-800 px-2 py-0.5 align-text-bottom text-[10px] font-medium text-white">
              {book.category.name}
            </Badge>
          )}
          {book.subcategory && (
            <Badge className="ml-1 rounded-full bg-gray-600 px-2 py-0.5 align-text-bottom text-[10px] font-medium text-white">
              {book.subcategory.name}
            </Badge>
          )}
        </div>

        <p className="text-sm text-gray-700 md:text-base">{book.author}</p>

        {book.publisher && (
          <p className="text-sm text-gray-500 md:text-base">{book.publisher}</p>
        )}
        {book.publishDate && (
          <p className="text-sm text-gray-500 md:text-base">
            출간일: {formattedDate}
          </p>
        )}
      </div>

      {/* 알라딘 드로어 - 모바일에서만 사용 */}
      <AladinDrawer
        isbn={isbn}
        isOpen={isAladinDrawerOpen}
        onClose={handleCloseAladinDrawer}
      />
    </div>
  );
}
