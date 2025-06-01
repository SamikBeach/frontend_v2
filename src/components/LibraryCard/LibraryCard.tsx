import { LibraryListItem } from '@/apis/library/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { decodeHtmlEntities } from '@/lib/utils';
import { Tag } from '@/utils/tags';
import { BookOpen, Users } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

export interface LibraryCardProps {
  library: LibraryListItem | any; // Allow any for test data
  tags?: Tag[];
  hidePublicTag?: boolean; // Add new prop to hide public/private tag
}

export function LibraryCard({
  library,
  tags = [],
  hidePublicTag = false,
}: LibraryCardProps) {
  // 현재 사용자 정보 가져오기
  const currentUser = useCurrentUser();

  // API URL 환경 변수

  // 사용자가 서재의 소유자인지 확인
  const isOwner = currentUser?.id === library.owner?.id;

  // 서재에 연결된 태그 목록 표시
  const libraryTags = useMemo(() => {
    if (!library.tags || !tags.length) return [];
    return library.tags
      .map((libTag: any) => {
        // 태그 ID를 문자열로 변환해서 일치하는 태그 찾기
        const foundTag = tags.find(t => t.id === String(libTag.tagId));
        return foundTag || null;
      })
      .filter(Boolean) as Tag[];
  }, [library.tags, tags]);

  // 책 데이터 - previewBooks 사용
  const displayBooks = library.previewBooks || [];

  // 소유자 정보
  const ownerName = library.owner?.username || 'Unknown';

  // 책 개수 - bookCount가 없는 경우 previewBooks 길이를 사용
  const booksCount = library.bookCount ?? displayBooks.length;

  return (
    <Link href={`/library/${library.id}`} className="block w-full">
      <Card className="group flex h-full min-h-[300px] min-w-[240px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-none transition-all duration-200 hover:border-gray-300 sm:min-h-[320px] sm:min-w-[280px]">
        <CardHeader className="p-3 pb-2 sm:p-5 sm:pb-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0 border border-gray-50 sm:h-10 sm:w-10">
              <AvatarImage
                src={library.owner?.profileImage}
                alt={ownerName}
                className="object-cover"
              />
              <AvatarFallback className="bg-gray-50 text-gray-700">
                {ownerName[0] || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h3 className="max-w-full truncate text-sm font-medium text-gray-900 transition-colors duration-150 group-hover:text-[#3182F6] sm:text-base">
                  {library.name}
                </h3>

                {/* 라이브러리 태그들을 서재 제목 옆에 표시 */}
                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                  {libraryTags.length > 0 &&
                    libraryTags.map(libTag => (
                      <span
                        key={libTag.id}
                        className="flex-shrink-0 rounded-full px-1.5 py-0.5 text-xs font-medium text-gray-700 sm:px-2"
                        style={{
                          backgroundColor: libTag.color,
                        }}
                      >
                        {libTag.name}
                      </span>
                    ))}

                  {/* 공개/비공개 태그 표시 - 내 서재(isOwner가 true)인 경우에만 표시하고, hidePublicTag가 true인 경우에는 표시하지 않음 */}
                  {isOwner && !hidePublicTag && (
                    <span className="flex flex-shrink-0 items-center rounded-full border border-gray-300 bg-white px-1.5 py-0.5 text-xs font-medium text-gray-500 sm:px-2">
                      {library.isPublic ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="8"
                            height="8"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-0.5 sm:mr-1 sm:h-3.5 sm:w-3.5"
                          >
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          공개
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="8"
                            height="8"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-0.5 sm:mr-1 sm:h-3.5 sm:w-3.5"
                          >
                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                            <line x1="2" x2="22" y1="2" y2="22" />
                          </svg>
                          비공개
                        </>
                      )}
                    </span>
                  )}
                </div>
              </div>
              <p className="truncate text-xs text-gray-500 sm:text-sm">
                {ownerName}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col px-3 pt-0 pb-2 sm:px-5 sm:pb-3">
          {library.description && (
            <p className="mb-3 line-clamp-1 text-sm text-gray-600 sm:mb-4 sm:text-sm">
              {decodeHtmlEntities(library.description)}
            </p>
          )}

          <div className="flex flex-1 gap-1.5 sm:gap-2">
            {displayBooks && displayBooks.length > 0 ? (
              <div className="grid w-full grid-cols-3 items-end gap-1.5 sm:gap-2">
                {displayBooks.map((book: any) => (
                  <div
                    key={book.id}
                    className="aspect-[5/7] w-full overflow-hidden rounded-lg border border-gray-100"
                  >
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-full w-full object-cover"
                      onError={e => {
                        // 이미지 로드 실패 시 기본 이미지로 대체
                        e.currentTarget.src = '/images/no-image.png';
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-0 flex min-h-[120px] w-full flex-1 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 sm:min-h-[160px]">
                <p className="text-xs text-gray-400 sm:text-sm">
                  아직 등록된 책이 없어요.
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="mt-0 flex items-center justify-between border-t border-gray-50 px-3 py-2 text-xs text-gray-500 sm:px-5 sm:py-3 sm:text-sm">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-gray-400 sm:h-4 sm:w-4" />
              <span>{(booksCount ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Users className="h-3.5 w-3.5 text-gray-400 sm:h-4 sm:w-4" />
              <span>{(library.subscriberCount ?? 0).toLocaleString()}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
