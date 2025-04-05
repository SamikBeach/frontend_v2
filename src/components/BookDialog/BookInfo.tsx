import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookDetails } from './types';

interface BookInfoProps {
  book: BookDetails;
}

export function BookInfo({ book }: BookInfoProps) {
  return (
    <div className="space-y-7">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold tracking-tight">
          {book.title}
        </DialogTitle>
        {book.originalTitle && (
          <p className="text-gray-500">{book.originalTitle}</p>
        )}
      </DialogHeader>

      {/* 책 소개 섹션 */}
      <div className="space-y-3">
        <div className="prose prose-gray max-w-none space-y-4 text-gray-800">
          {book.description || '책 소개가 없습니다.'}
          {book.awards && book.awards.length > 0 && (
            <div className="mt-6">
              <p className="font-medium text-gray-900">수상 내역</p>
              <ul className="pl-5">
                {book.awards.map(award => (
                  <li key={award.name} className="text-sm">
                    {award.year}년 {award.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 저자 소개 */}
      {book.authorInfo && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-900">
            {book.author} 작가 소개
          </p>
          <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-800">
            {book.authorInfo}
          </div>
        </div>
      )}
    </div>
  );
}
