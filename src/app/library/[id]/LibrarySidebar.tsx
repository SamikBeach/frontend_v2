import { LibraryActivityType, UpdateHistoryItem } from '@/apis/library/types';
import { useLibraryDetail } from '@/app/libraries/hooks/useLibraryDetail';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDialogQuery } from '@/hooks';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { getTagColor } from '@/utils/tags';
import { format, formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { BookOpen, Calendar, Clock, Users } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';

export function LibrarySidebar() {
  const params = useParams();
  const libraryId = parseInt(params.id as string, 10);

  return (
    <Suspense fallback={<LibrarySidebarSkeleton />}>
      <LibrarySidebarContent libraryId={libraryId} />
    </Suspense>
  );
}

function LibrarySidebarContent({ libraryId }: { libraryId: number }) {
  const currentUser = useCurrentUser();
  const { open: openBookDialog } = useDialogQuery({
    type: 'book',
    idType: 'id',
  });

  // useLibraryDetail 훅으로 상태와 핸들러 함수 가져오기
  const { library } = useLibraryDetail(libraryId);

  if (!library) {
    return null;
  }

  // 상대적 시간 포맷팅 (예: "2일 전")
  const formatRelativeTime = (date: Date): string => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ko });
  };

  // 구독자 정보 (최대 3명)
  const previewSubscribers = library.subscribers?.slice(0, 3) || [];

  // 활동 타입별 아이콘 매핑
  const getActivityIcon = (activityType: LibraryActivityType): string => {
    switch (activityType) {
      case LibraryActivityType.LIBRARY_CREATE:
        return '🏛️';
      case LibraryActivityType.LIBRARY_UPDATE:
        return '📚';
      case LibraryActivityType.LIBRARY_TITLE_UPDATE:
        return '✏️';
      case LibraryActivityType.LIBRARY_DELETE:
        return '🗑️';
      case LibraryActivityType.BOOK_ADD:
        return '📘';
      case LibraryActivityType.BOOK_REMOVE:
        return '📕';
      case LibraryActivityType.TAG_ADD:
        return '🏷️';
      case LibraryActivityType.TAG_REMOVE:
        return '✂️';
      case LibraryActivityType.SUBSCRIPTION_ADD:
        return '🔔';
      case LibraryActivityType.SUBSCRIPTION_REMOVE:
        return '🔕';
      default:
        return '📣';
    }
  };

  // 현재 사용자가 구독자인지 확인하는 함수
  const isCurrentUserSubscriber = (subscriberId: number) => {
    return currentUser?.id === subscriberId;
  };

  // 사용자 이름 가져오기
  const getUsernameById = (userId: number | undefined) => {
    if (!userId) return '알 수 없는 사용자';

    // 서재 소유자인 경우
    if (library.owner.id === userId) {
      return library.owner.username;
    }

    // 구독자 중에 있는 경우
    const subscriber = library.subscribers?.find(sub => sub.id === userId);
    if (subscriber) {
      return subscriber.username;
    }

    return '알 수 없는 사용자';
  };

  // 책 제목 가져오기
  const getBookTitleById = (bookId: number | undefined) => {
    if (!bookId) return '알 수 없는 책';

    const book = library.books?.find(book => book.bookId === bookId);
    if (book) {
      return book.book.title || '알 수 없는 책';
    }

    return '알 수 없는 책';
  };

  // 태그 이름 가져오기
  const getTagNameById = (tagId: number | undefined) => {
    if (!tagId) return '알 수 없는 태그';

    const tag = library.tags?.find(tag => tag.tagId === tagId);
    if (tag) {
      return tag.tagName || '알 수 없는 태그';
    }

    return '알 수 없는 태그';
  };

  // 활동 타입에 따른 메시지 구성
  const renderActivityMessage = (
    update: UpdateHistoryItem
  ): React.ReactNode => {
    const activityIcon = getActivityIcon(update.activityType);

    switch (update.activityType) {
      case LibraryActivityType.LIBRARY_CREATE:
        return (
          <>
            {activityIcon}{' '}
            <span className="font-medium text-gray-800">{library.name}</span>이
            생성되었습니다.
          </>
        );

      case LibraryActivityType.LIBRARY_UPDATE:
        return (
          <>
            {activityIcon}{' '}
            <span className="font-medium text-gray-800">{library.name}</span>{' '}
            서재 정보가 수정되었습니다.
          </>
        );

      case LibraryActivityType.LIBRARY_TITLE_UPDATE:
        return (
          <>
            {activityIcon} 서재 이름이{' '}
            <span className="font-medium text-gray-800">{library.name}</span>
            으로 변경되었습니다.
          </>
        );

      case LibraryActivityType.BOOK_ADD: {
        const bookTitle = getBookTitleById(update.bookId);
        return (
          <>
            {activityIcon}{' '}
            <span
              className="cursor-pointer font-medium text-gray-800 hover:underline"
              onClick={() => {
                if (update.bookId) {
                  openBookDialog(update.bookId.toString());
                }
              }}
            >
              {bookTitle}
            </span>{' '}
            책이 서재에 추가되었습니다.
          </>
        );
      }

      case LibraryActivityType.BOOK_REMOVE: {
        const bookTitle =
          getBookTitleById(update.bookId) ||
          update.message.match(/"(.+?)"/)?.at(1) ||
          '알 수 없는 책';
        return (
          <>
            {activityIcon}{' '}
            <span className="font-medium text-gray-800">{bookTitle}</span> 책이
            서재에서 제거되었습니다.
          </>
        );
      }

      case LibraryActivityType.TAG_ADD: {
        const tagName = getTagNameById(update.tagId);
        const tagColor = getTagColor((update.tagId || 0) % 8);
        return (
          <div className="flex items-center">
            <span
              className="mr-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: tagColor,
                color: '#464646',
              }}
            >
              {tagName}
            </span>
            <span>태그가 서재에 추가되었습니다.</span>
          </div>
        );
      }

      case LibraryActivityType.TAG_REMOVE: {
        const tagName =
          getTagNameById(update.tagId) ||
          update.message.match(/"(.+?)"/)?.at(1) ||
          '알 수 없는 태그';
        const tagColor = getTagColor((update.tagId || 0) % 8);
        return (
          <div className="flex items-center">
            <span
              className="mr-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: tagColor,
                color: '#464646',
              }}
            >
              {tagName}
            </span>
            <span>태그가 서재에서 제거되었습니다.</span>
          </div>
        );
      }

      case LibraryActivityType.SUBSCRIPTION_ADD: {
        const username = getUsernameById(update.userId);
        return (
          <>
            {activityIcon}{' '}
            <span className="font-medium text-gray-800">{username}</span>님이
            서재를 구독했습니다.
          </>
        );
      }

      case LibraryActivityType.SUBSCRIPTION_REMOVE: {
        const username = getUsernameById(update.userId);
        return (
          <>
            {activityIcon}{' '}
            <span className="font-medium text-gray-800">{username}</span>님이
            서재 구독을 취소했습니다.
          </>
        );
      }

      default:
        // 기타 활동이거나 서버에서 직접 메시지가 제공된 경우
        return (
          <>
            {activityIcon} {update.message}
          </>
        );
    }
  };

  // 가장 최근 업데이트
  const renderRecentUpdates = () => {
    if (!library.recentUpdates || library.recentUpdates.length === 0) {
      return (
        <div className="text-center text-sm text-gray-500 italic">
          아직 업데이트가 없습니다.
        </div>
      );
    }

    return library.recentUpdates.slice(0, 5).map((update, index) => {
      const formattedMessage = renderActivityMessage(update);
      const isReactNode = typeof formattedMessage !== 'string';

      return (
        <div key={index} className="mb-2 rounded-md bg-white p-3 last:mb-0">
          <div className="flex flex-col">
            <div className="text-gray-700">
              {isReactNode ? (
                formattedMessage
              ) : (
                <div dangerouslySetInnerHTML={{ __html: formattedMessage }} />
              )}
            </div>
            <span className="mt-1 text-xs text-gray-500">
              {formatRelativeTime(update.date)}
            </span>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* 서재 소유자 정보 */}
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border border-gray-200">
              <AvatarImage
                src={`https://i.pravatar.cc/150?u=${library.owner.id}`}
                alt={library.owner.username}
              />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {library.owner.username[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-gray-900">
                {library.owner.username}
              </h3>
              <p className="text-sm text-gray-500">@{library.owner.username}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 rounded-full bg-gray-200 text-xs hover:bg-gray-300"
            // TODO: 유저 팔로우 기능 - 추후 구현 예정
          >
            팔로우
          </Button>
        </div>
      </div>

      {/* 서재 정보 */}
      <div className="rounded-xl bg-gray-50 p-4">
        <h3 className="mb-3 font-medium text-gray-900">서재 정보</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <BookOpen className="h-4 w-4" />
              <span>책</span>
            </div>
            <span className="font-medium text-gray-900">
              {library.books?.length || 0}권
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-4 w-4" />
              <span>구독자</span>
            </div>
            <span className="font-medium text-gray-900">
              {library.subscriberCount}명
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>생성일</span>
            </div>
            <span className="font-medium text-gray-900">
              {format(new Date(library.createdAt), 'yyyy년 MM월 dd일', {
                locale: ko,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* 구독자 미리보기 */}
      {library.subscribers && library.subscribers.length > 0 && (
        <div className="rounded-xl bg-gray-50 p-4">
          <h3 className="font-medium text-gray-900">구독자</h3>

          <div className="mt-3 space-y-3">
            {previewSubscribers.length > 0 ? (
              previewSubscribers.map(subscriber => (
                <div key={subscriber.id} className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border border-gray-200">
                    <AvatarImage
                      src={
                        subscriber.profileImage ||
                        `https://i.pravatar.cc/150?u=${subscriber.id}`
                      }
                      alt={subscriber.username}
                    />
                    <AvatarFallback className="bg-gray-200">
                      {subscriber.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {subscriber.username}
                    </p>
                  </div>
                  {!isCurrentUserSubscriber(subscriber.id) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 rounded-full text-xs"
                      // TODO: 유저 팔로우 기능 - 추후 구현 예정
                    >
                      팔로우
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500">
                아직 구독자가 없습니다.
              </p>
            )}
          </div>
        </div>
      )}

      {/* 업데이트 알림 섹션 - 항상 표시 */}
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="mb-3 flex items-center">
          <Clock className="mr-2 h-4 w-4 text-gray-500" />
          <h3 className="font-medium text-gray-900">최근 활동</h3>
        </div>
        <div className="space-y-3">{renderRecentUpdates()}</div>

        <div className="mt-4 flex items-center justify-center rounded-lg bg-gray-100 p-2.5 text-xs text-gray-600">
          구독하면 이 서재의 모든 활동 소식을 볼 수 있습니다
        </div>
      </div>
    </div>
  );
}

// 서재 사이드바 스켈레톤 컴포넌트
function LibrarySidebarSkeleton() {
  return (
    <div className="space-y-6">
      {/* 서재 소유자 정보 스켈레톤 */}
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="mt-1 h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>
      </div>

      {/* 서재 정보 스켈레톤 */}
      <div className="rounded-xl bg-gray-50 p-4">
        <Skeleton className="mb-3 h-5 w-24" />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </div>

      {/* 구독자 미리보기 스켈레톤 */}
      <div className="rounded-xl bg-gray-50 p-4">
        <Skeleton className="h-5 w-16" />
        <div className="mt-3 space-y-3">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <div className="flex-1"></div>
                <Skeleton className="h-7 w-16 rounded-full" />
              </div>
            ))}
        </div>
      </div>

      {/* 업데이트 알림 섹션 스켈레톤 */}
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="mb-3 flex items-center">
          <Skeleton className="mr-2 h-4 w-4" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="space-y-3">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="mb-2 rounded-md bg-white p-3 last:mb-0"
              >
                <div className="flex flex-col">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="mt-1 h-3 w-1/3" />
                </div>
              </div>
            ))}
        </div>
        <Skeleton className="mt-4 h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}
