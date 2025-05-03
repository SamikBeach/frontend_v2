'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bell,
  BookOpen,
  Hash,
  Loader2,
  MessageSquare,
  ThumbsUp,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNotifications } from './hooks';
import { Notification } from './types';

// 로딩 컴포넌트
function NotificationLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
    </div>
  );
}

// 스크롤 로더 컴포넌트
function ScrollLoader() {
  return (
    <div className="flex items-center justify-center py-3">
      <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
    </div>
  );
}

// 알림 타입별 뱃지 컴포넌트
const NotificationTypeBadge = ({ type }: { type: string }) => {
  const getIcon = () => {
    switch (type) {
      case 'like':
        return <ThumbsUp className="h-3.5 w-3.5 text-pink-500" />;
      case 'comment_like':
        return <ThumbsUp className="h-3.5 w-3.5 text-red-500" />;
      case 'comment':
        return <MessageSquare className="h-3.5 w-3.5 text-purple-500" />;
      case 'follow':
        return <User className="h-3.5 w-3.5 text-yellow-500" />;
      case 'library_update':
        return <BookOpen className="h-3.5 w-3.5 text-green-500" />;
      case 'library_subscribe':
        return <BookOpen className="h-3.5 w-3.5 text-blue-500" />;
      default:
        return <Bell className="h-3.5 w-3.5 text-gray-500" />;
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'like':
        return '좋아요';
      case 'comment_like':
        return '댓글 좋아요';
      case 'comment':
        return '댓글';
      case 'follow':
        return '팔로우';
      case 'library_update':
        return '서재 업데이트';
      case 'library_subscribe':
        return '서재 구독';
      case 'system':
        return '시스템';
      default:
        return '알림';
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'like':
        return 'bg-pink-50 text-pink-600';
      case 'comment_like':
        return 'bg-red-50 text-red-600';
      case 'comment':
        return 'bg-purple-50 text-purple-600';
      case 'follow':
        return 'bg-yellow-50 text-yellow-600';
      case 'library_update':
        return 'bg-green-50 text-green-600';
      case 'library_subscribe':
        return 'bg-blue-50 text-blue-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] ${getBgColor()}`}
    >
      {getIcon()}
      <span>{getLabel()}</span>
    </span>
  );
};

// 게시물 유형 뱃지 컴포넌트
const PostTypeBadge = ({ sourceType }: { sourceType?: string }) => {
  if (!sourceType) return null;

  const getIcon = () => {
    switch (sourceType) {
      case 'review':
        return <BookOpen className="h-3 w-3" />;
      case 'comment':
        return <MessageSquare className="h-3 w-3" />;
      case 'library':
        return <Hash className="h-3 w-3" />;
      case 'user':
        return <User className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getLabel = () => {
    switch (sourceType) {
      case 'review':
        return '리뷰';
      case 'comment':
        return '댓글';
      case 'library':
        return '서재';
      case 'user':
        return '프로필';
      default:
        return '';
    }
  };

  const getColor = () => {
    switch (sourceType) {
      case 'review':
        return 'bg-blue-50 text-blue-600';
      case 'comment':
        return 'bg-purple-50 text-purple-600';
      case 'library':
        return 'bg-green-50 text-green-600';
      case 'user':
        return 'bg-yellow-50 text-yellow-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] ${getColor()}`}
    >
      {getIcon()}
      <span>{getLabel()}</span>
    </span>
  );
};

// 알림 내용 커스텀 렌더링 함수
const renderNotificationContent = (notification: Notification) => {
  // 액터 이름 (알림 주체)
  const actorName = notification.actor?.username || '누군가';

  // 콘텐츠 정보 추출
  const reviewContent = notification.review?.content || '';

  // 서재 업데이트인 경우 책 제목 추출
  let bookTitle = '';
  let bookCover = '';

  if (notification.type === 'library_update') {
    // book 속성이 있으면 직접 사용
    if (notification.book) {
      bookTitle = notification.book.title || '';
      bookCover = notification.book.coverImage || '';
    }
    // content에서 책 제목 추출
    else if (notification.content) {
      const contentMatch = notification.content.match(/'([^']+)'/);
      if (contentMatch && contentMatch[1]) {
        bookTitle = contentMatch[1];
      }
    }
  } else {
    // 다른 타입의 알림은 기존 로직 사용
    bookTitle = notification.review?.books?.[0]?.title || '';
    bookCover = notification.review?.books?.[0]?.coverImage || '';
  }

  const commentContent = notification.comment?.content || '';
  const libraryName = notification.library?.name || '';

  // 리뷰 내용 요약
  const shortReviewContent = reviewContent
    ? reviewContent.length > 30
      ? `${reviewContent.substring(0, 30)}...`
      : reviewContent
    : '';

  // 댓글 내용 요약
  const shortCommentContent = commentContent
    ? commentContent.length > 30
      ? `${commentContent.substring(0, 30)}...`
      : commentContent
    : '';

  // 알림 타입에 따라 다른 컨텐츠 렌더링
  switch (notification.type) {
    case 'comment':
      if (notification.sourceType === 'review') {
        return (
          <>
            <span className="font-medium">{actorName}</span>님이{' '}
            {bookTitle ? (
              <>
                <span className="font-medium">{bookTitle}</span>에 대한 리뷰
              </>
            ) : (
              '리뷰'
            )}
            에 댓글을 남겼습니다.
            {commentContent && (
              <>
                {' '}
                <span className="font-medium text-gray-700">
                  &ldquo;{shortCommentContent}&rdquo;
                </span>
              </>
            )}
          </>
        );
      } else {
        return (
          <>
            <span className="font-medium">{actorName}</span>님이 회원님의
            게시글에 댓글을 남겼습니다.
            {commentContent && (
              <>
                {' '}
                <span className="font-medium text-gray-700">
                  &ldquo;{shortCommentContent}&rdquo;
                </span>
              </>
            )}
          </>
        );
      }

    case 'comment_like':
      return (
        <>
          <span className="font-medium">{actorName}</span>님이{' '}
          {commentContent ? (
            <>
              회원님의 댓글{' '}
              <span className="font-medium text-gray-700">
                &ldquo;{shortCommentContent}&rdquo;
              </span>
              을
            </>
          ) : (
            <>회원님의 댓글을</>
          )}{' '}
          좋아합니다.
        </>
      );

    case 'like':
      if (notification.sourceType === 'review') {
        return (
          <>
            <span className="font-medium">{actorName}</span>님이{' '}
            {bookTitle ? (
              <>
                <span className="font-medium">{bookTitle}</span>에 대한
                {reviewContent && (
                  <>
                    게시글{' '}
                    <span className="font-medium text-gray-700">
                      &ldquo;{shortReviewContent}&rdquo;
                    </span>
                    를
                  </>
                )}
                {!reviewContent && <>게시글을</>}
              </>
            ) : (
              <>
                {reviewContent ? (
                  <>
                    게시글{' '}
                    <span className="font-medium text-gray-700">
                      &ldquo;{shortReviewContent}&rdquo;
                    </span>
                    를
                  </>
                ) : (
                  <>게시글을</>
                )}
              </>
            )}{' '}
            좋아합니다.
          </>
        );
      } else if (notification.sourceType === 'comment') {
        return (
          <>
            <span className="font-medium">{actorName}</span>님이{' '}
            {commentContent ? (
              <>
                댓글{' '}
                <span className="font-medium text-gray-700">
                  &ldquo;{shortCommentContent}&rdquo;
                </span>
                을
              </>
            ) : (
              <>회원님의 댓글을</>
            )}{' '}
            좋아합니다.
          </>
        );
      } else {
        return (
          <>
            <span className="font-medium">{actorName}</span>님이{' '}
            {reviewContent ? (
              <>
                게시글{' '}
                <span className="font-medium text-gray-700">
                  &ldquo;{shortReviewContent}&rdquo;
                </span>
                를
              </>
            ) : (
              <>회원님의 게시글을</>
            )}{' '}
            좋아합니다.
          </>
        );
      }

    case 'follow':
      return (
        <>
          <span className="font-medium">{actorName}</span>님이 회원님을
          팔로우하기 시작했습니다.
        </>
      );

    case 'library_update':
      return (
        <div className="flex flex-col space-y-2">
          <div>
            <span className="font-medium">{actorName}</span>님의{' '}
            <span className="font-medium">{libraryName || '서재'}</span>에{' '}
            {bookTitle ? (
              <>
                새 책{' '}
                <span className="font-medium">&ldquo;{bookTitle}&rdquo;</span>
                이(가) 추가되었습니다.
              </>
            ) : (
              <>새 책이 추가되었습니다.</>
            )}
          </div>

          {bookTitle && bookCover && (
            <div className="mt-1 flex items-center rounded-md bg-gray-50 p-2">
              <img
                src={bookCover}
                alt={bookTitle}
                className="mr-2 h-12 w-9 rounded object-cover shadow-sm"
              />
              <span className="font-medium">{bookTitle}</span>
            </div>
          )}
        </div>
      );

    case 'library_subscribe':
      if (notification.actor && libraryName) {
        if (notification.actor.id === notification.sourceId) {
          // 내 서재를 다른 사람이 구독한 경우
          return (
            <>
              <span className="font-medium">{actorName}</span>님이 회원님의{' '}
              <span className="font-medium">{libraryName}</span> 서재를
              구독했습니다.
            </>
          );
        } else {
          // 내가 다른 사람의 서재를 구독한 경우에 대한 알림
          return (
            <>
              회원님이 <span className="font-medium">{actorName}</span>님의{' '}
              <span className="font-medium">{libraryName}</span> 서재를
              구독했습니다.
            </>
          );
        }
      } else if (libraryName) {
        // 서재 정보만 있는 경우 (일반적인 구독 알림)
        return (
          <>
            <span className="font-medium">{libraryName}</span> 서재가 새로운
            구독자를 얻었습니다.
          </>
        );
      } else {
        // 기본 메시지 (불충분한 정보)
        return <>서재 구독 알림이 도착했습니다.</>;
      }

    default:
      return (notification.content || '새로운 알림이 도착했습니다.') + '.';
  }
};

// 알림 내용 컴포넌트
function NotificationContent({
  onClose,
  isOpen,
}: {
  onClose: () => void;
  isOpen: boolean;
}) {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    markAsRead,
    markAllAsReadMutation,
    deleteAllNotifications,
    formatNotificationTime,
    getNotificationLink,
    error,
    queryError,
  } = useNotifications(10, isOpen); // 드롭다운 상태 전달

  // 오류가 있는 경우 오류 메시지 표시
  if (error || queryError) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="rounded-full bg-red-50 p-4">
          <Bell className="h-8 w-8 text-red-400" />
        </div>
        <p className="mt-3 text-sm text-red-500">
          알림을 불러오는 중 오류가 발생했습니다
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3 rounded-full border-red-200 px-3 text-xs text-red-600 hover:bg-red-50"
          onClick={() => window.location.reload()}
        >
          새로고침
        </Button>
      </div>
    );
  }

  // UI에 필요한 추가 정보 설정
  const enhancedNotifications = notifications.map(notification => ({
    ...notification,
    timestamp: formatNotificationTime(notification.createdAt),
    user: notification.actor
      ? {
          name: notification.actor.username,
          avatar: notification.actor.profileImage,
        }
      : undefined,
  }));

  // 알림 클릭 핸들러
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    onClose();
    setTimeout(() => {
      if (notification.linkUrl) {
        router.push(notification.linkUrl);
      } else if (notification.sourceType && notification.sourceId) {
        const link = getNotificationLink(notification as any);
        router.push(link);
      }
    }, 100);
  };

  // 다음 페이지 로드 핸들러
  const loadMoreNotifications = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white p-3">
        <h3 className="font-medium text-gray-900">알림</h3>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 rounded-full px-2 text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              onClick={() => markAllAsReadMutation()}
            >
              모두 읽음
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 rounded-full px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => {
                if (
                  confirm(
                    '모든 알림을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
                  )
                ) {
                  deleteAllNotifications();
                }
              }}
            >
              전체 삭제
            </Button>
          )}
        </div>
      </div>

      {enhancedNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="rounded-full bg-gray-50 p-4">
            <Bell className="h-8 w-8 text-gray-300" />
          </div>
          <p className="mt-3 text-sm text-gray-500">알림이 없습니다</p>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={enhancedNotifications.length}
          next={loadMoreNotifications}
          hasMore={!!hasNextPage}
          loader={<ScrollLoader />}
          scrollableTarget="notification-scroll-container"
          className="divide-y divide-gray-50"
        >
          {enhancedNotifications.map(notification => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex cursor-pointer flex-col gap-0 px-4 py-3.5 transition-colors ${
                !notification.isRead ? 'bg-blue-50/40' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleNotificationClick(notification)}
              onSelect={e => e.preventDefault()} // 자동 닫힘 방지
            >
              <div className="flex w-full items-start gap-3">
                {/* 아바타 또는 아이콘 */}
                {renderNotificationIcon(notification)}

                <div className="min-w-0 flex-1">
                  {/* 태그와 메시지 */}
                  <div className="mb-1.5 flex items-center gap-2">
                    <NotificationTypeBadge type={notification.type} />

                    {notification.sourceType && (
                      <PostTypeBadge sourceType={notification.sourceType} />
                    )}

                    {/* 읽지 않음 표시 */}
                    {!notification.isRead && (
                      <div className="ml-auto h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                    )}
                  </div>

                  {/* 알림 메시지 */}
                  <div className="text-sm leading-normal break-words whitespace-normal text-gray-700">
                    {renderNotificationContent(notification)}
                  </div>

                  {/* 타임스탬프 */}
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">
                      {notification.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </InfiniteScroll>
      )}
    </>
  );
}

// 알림 아이콘 렌더링 함수
function renderNotificationIcon(notification: Notification) {
  // 사용자가 있는 경우 항상 아바타 표시
  if (notification.actor) {
    return (
      <Avatar className="h-10 w-10 flex-shrink-0">
        <AvatarImage
          src={notification.actor.profileImage}
          alt={notification.actor.username}
        />
        <AvatarFallback className="bg-gray-100 text-gray-600">
          {notification.actor.username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    );
  } else if (notification.user) {
    // 이전 방식 호환성 유지
    return (
      <Avatar className="h-10 w-10 flex-shrink-0">
        <AvatarImage
          src={notification.user.avatar}
          alt={notification.user.name}
        />
        <AvatarFallback className="bg-gray-100 text-gray-600">
          {notification.user.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    );
  }

  // 사용자 정보가 없는 경우 타입별 아이콘 표시
  switch (notification.type) {
    case 'library_update':
      return (
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
          <BookOpen className="h-5 w-5 text-green-600" />
        </div>
      );
    case 'library_subscribe':
      return (
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
          <BookOpen className="h-5 w-5 text-blue-600" />
        </div>
      );
    case 'follow':
      return (
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
          <User className="h-5 w-5 text-yellow-600" />
        </div>
      );
    case 'like':
      return (
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-pink-100">
          <ThumbsUp className="h-5 w-5 text-pink-600" />
        </div>
      );
    case 'comment_like':
      return (
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
          <ThumbsUp className="h-5 w-5 text-red-600" />
        </div>
      );
    case 'comment':
      return (
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-100">
          <MessageSquare className="h-5 w-5 text-purple-600" />
        </div>
      );
    case 'system':
    default:
      return (
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
          <Bell className="h-5 w-5 text-gray-500" />
        </div>
      );
  }
}

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-500 hover:text-gray-900"
        >
          <Suspense fallback={<Bell className="h-5 w-5" />}>
            <NotificationBadge />
          </Suspense>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-[75vh] w-[480px] overflow-y-auto rounded-xl border border-gray-100 p-0"
        id="notification-scroll-container"
      >
        <Suspense fallback={<NotificationLoading />}>
          <NotificationContent onClose={() => setOpen(false)} isOpen={open} />
        </Suspense>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// 알림 뱃지 컴포넌트 (읽지 않은 알림 수 표시)
function NotificationBadge() {
  // 항상 읽지 않은 알림 수는 확인해야 함 (드롭다운 상태와 무관하게)
  const { unreadCount } = useNotifications();

  return (
    <>
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </>
  );
}
