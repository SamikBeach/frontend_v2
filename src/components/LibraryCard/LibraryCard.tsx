import { LibraryListItem } from '@/apis/library/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { useCurrentUser } from '@/hooks/useCurrentUser';
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
  const ownerAvatar = library.owner?.id
    ? `https://i.pravatar.cc/150?u=${library.owner.id}`
    : '';

  // 책 개수 - bookCount가 없는 경우 previewBooks 길이를 사용
  const booksCount = library.bookCount ?? displayBooks.length;

  return (
    <Link href={`/library/${library.id}`} className="block w-full">
      <Card className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-none transition-all duration-200 hover:border-gray-300">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0 border border-gray-50">
              <AvatarImage
                src={ownerAvatar}
                alt={ownerName}
                className="object-cover"
              />
              <AvatarFallback className="bg-gray-50 text-gray-700">
                {ownerName[0] || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="max-w-full truncate text-base font-medium text-gray-900 transition-colors duration-150 group-hover:text-[#3182F6]">
                  {library.name}
                </h3>

                {/* 라이브러리 태그들을 서재 제목 옆에 표시 */}
                <div className="flex flex-wrap gap-1.5">
                  {libraryTags.length > 0 &&
                    libraryTags.map(libTag => (
                      <span
                        key={libTag.id}
                        className="flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium text-gray-700"
                        style={{
                          backgroundColor: libTag.color,
                        }}
                      >
                        {libTag.name}
                      </span>
                    ))}

                  {/* 공개/비공개 태그 표시 - 내 서재(isOwner가 true)인 경우에만 표시하고, hidePublicTag가 true인 경우에는 표시하지 않음 */}
                  {isOwner && !hidePublicTag && (
                    <span className="flex flex-shrink-0 items-center rounded-full border border-gray-300 bg-white px-2 py-0.5 text-xs font-medium text-gray-500">
                      {library.isPublic ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
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
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
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
              <div className="mt-1">
                <p className="truncate text-sm text-gray-500">{ownerName}</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col px-5 pt-0 pb-3">
          {library.description && (
            <p className="mb-4 line-clamp-1 text-sm text-gray-600">
              {library.description}
            </p>
          )}

          <div className="flex flex-1 gap-2">
            {displayBooks && displayBooks.length > 0 ? (
              <div className="grid w-full grid-cols-3 items-end gap-2">
                {displayBooks.map((book: any) => (
                  <div
                    key={book.id}
                    className="aspect-[5/7] w-full overflow-hidden rounded-lg border border-gray-100"
                  >
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-0 flex min-h-[160px] w-full flex-1 items-center justify-center rounded-lg border border-gray-100 bg-gray-50">
                <p className="text-sm text-gray-400">
                  아직 등록된 책이 없어요.
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="mt-0 flex items-center justify-between border-t border-gray-50 px-5 py-3 text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-gray-400" />
              <span>{(booksCount ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-gray-400" />
              <span>{(library.subscriberCount ?? 0).toLocaleString()}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
