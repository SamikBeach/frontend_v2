import { useBookDetails } from './hooks';

export function BookInfo() {
  const { book } = useBookDetails();

  if (!book) return null;

  return (
    <div className="space-y-6">
      {/* 책 소개 섹션 */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-900">책 소개</p>
        <div className="prose prose-gray max-w-none text-sm leading-relaxed text-gray-700">
          {book.description || '책 소개가 없습니다.'}
        </div>
        {book.awards && book.awards.length > 0 && (
          <div className="mt-4 rounded-xl bg-gray-50 p-4">
            <p className="mb-2 text-sm font-medium text-gray-900">수상 내역</p>
            <ul className="space-y-1">
              {book.awards.map(award => (
                <li key={award.name} className="text-sm text-gray-700">
                  {award.year}년 {award.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 저자 소개 */}
      {book.authorInfo && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-900">저자 소개</p>
          <div className="prose prose-gray max-w-none text-sm leading-relaxed text-gray-700">
            {book.authorInfo}
          </div>
        </div>
      )}
    </div>
  );
}
