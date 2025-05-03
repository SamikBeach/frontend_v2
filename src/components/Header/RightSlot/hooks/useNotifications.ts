import {
  NotificationResponse,
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
  getUnreadNotificationCount,
  markAllAsRead,
  updateNotification,
} from '@/apis/notification';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

/**
 * 알림 기능을 위한 커스텀 훅
 * Suspense와 함께 사용하며, 알림 목록, 읽지 않은 알림 수, 그리고 관련 액션을 제공합니다.
 * 무한 스크롤을 지원합니다.
 * @param initialLimit 페이지당 항목 수
 * @param isDropdownOpen 드롭다운이 열려있는지 여부 (열려있을 때만 목록 API 호출)
 */
export function useNotifications(initialLimit = 10, isDropdownOpen = false) {
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();

  // 알림 목록 가져오기 (무한 스크롤)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    error: queryError,
  } = useInfiniteQuery<NotificationResponse>({
    queryKey: ['notifications-infinite'],
    queryFn: async ({ pageParam }) => {
      const page = pageParam as number;
      try {
        const result = await getNotifications(page, initialLimit);
        console.log('[알림 API] 알림 목록 응답:', result);
        return result;
      } catch (err) {
        console.error('[알림 API] 알림 목록 오류:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        // API 에러 시 빈 데이터 반환
        return {
          notifications: [],
          total: 0,
        };
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce(
        (acc, page) => acc + page.notifications.length,
        0
      );
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
    },
    getPreviousPageParam: (firstPage, allPages) => {
      return allPages.length > 1 ? allPages.length - 1 : undefined;
    },
    // 드롭다운이 열려있을 때만 실행
    enabled: isDropdownOpen,
  });

  // 모든 페이지의 알림을 합쳐서 단일 배열로 만듦
  const notifications = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap(page => page.notifications);
  }, [data]);

  // 총 알림 개수
  const total = useMemo(() => {
    if (!data || data.pages.length === 0) return 0;
    return data.pages[0].total;
  }, [data]);

  // 읽지 않은 알림 수 가져오기
  const {
    data: unreadCount,
    refetch: refetchUnreadCount,
    error: unreadCountError,
  } = useSuspenseQuery<number>({
    queryKey: ['notifications-unread-count'],
    queryFn: async () => {
      try {
        const count = await getUnreadNotificationCount();
        console.log('[알림 API] 읽지 않은 알림 수:', count);
        return count;
      } catch (err) {
        console.error('[알림 API] 읽지 않은 알림 수 오류:', err);
        // 에러 발생 시 0 반환
        return 0;
      }
    },
    retry: 1,
  });

  // 오류 로깅
  useEffect(() => {
    if (queryError) {
      console.error('[알림 API] 알림 목록 쿼리 오류:', queryError);
    }
    if (unreadCountError) {
      console.error(
        '[알림 API] 읽지 않은 알림 수 쿼리 오류:',
        unreadCountError
      );
    }
  }, [queryError, unreadCountError]);

  // 드롭다운이 열릴 때 데이터 fetch
  useEffect(() => {
    if (isDropdownOpen) {
      refetch();
    }
  }, [isDropdownOpen, refetch]);

  // 알림 읽음 처리 mutation
  const { mutate: markAsRead, error: markAsReadError } = useMutation({
    mutationFn: async (id: number) => {
      try {
        console.log(`[알림 API] 알림 읽음 처리: ID ${id}`);
        return await updateNotification(id, true);
      } catch (err) {
        console.error(`[알림 API] 알림 읽음 처리 오류: ID ${id}`, err);
        throw err;
      }
    },
    onSuccess: () => {
      refetch();
      refetchUnreadCount();
    },
  });

  // 모든 알림 읽음 처리 mutation
  const { mutate: markAllAsReadMutation, error: markAllAsReadError } =
    useMutation({
      mutationFn: async () => {
        try {
          console.log('[알림 API] 모든 알림 읽음 처리');
          return await markAllAsRead();
        } catch (err) {
          console.error('[알림 API] 모든 알림 읽음 처리 오류:', err);
          throw err;
        }
      },
      onSuccess: () => {
        refetch();
        refetchUnreadCount();
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
    });

  // 알림 삭제 mutation
  const { mutate: deleteNotificationMutation, error: deleteNotificationError } =
    useMutation({
      mutationFn: async (id: number) => {
        try {
          console.log(`[알림 API] 알림 삭제: ID ${id}`);
          return await deleteNotification(id);
        } catch (err) {
          console.error(`[알림 API] 알림 삭제 오류: ID ${id}`, err);
          throw err;
        }
      },
      onSuccess: () => {
        refetch();
        refetchUnreadCount();
      },
    });

  // 모든 알림 삭제 mutation
  const {
    mutate: deleteAllNotificationsMutation,
    error: deleteAllNotificationsError,
  } = useMutation({
    mutationFn: async () => {
      try {
        console.log('[알림 API] 모든 알림 삭제');
        return await deleteAllNotifications();
      } catch (err) {
        console.error('[알림 API] 모든 알림 삭제 오류:', err);
        throw err;
      }
    },
    onSuccess: () => {
      refetch();
      refetchUnreadCount();
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // 알림 시간 포매팅 (상대적 시간으로 변환)
  const formatNotificationTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMinutes < 60) {
        return `${diffMinutes}분 전`;
      } else if (diffHours < 24) {
        return `${diffHours}시간 전`;
      } else if (diffDays < 7) {
        return `${diffDays}일 전`;
      } else {
        return date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }
    } catch (err) {
      console.error(`[알림 API] 날짜 포맷팅 오류: ${dateString}`, err);
      return '알 수 없는 시간';
    }
  };

  // 알림 링크 처리 (sourceType에 따라 다른 페이지로 이동)
  const getNotificationLink = (notification: any): string => {
    // 이미 링크가 있으면 그 링크 사용
    if (notification.linkUrl) {
      return notification.linkUrl;
    }

    // 소스 타입에 따라 링크 생성
    switch (notification.sourceType) {
      case 'review':
        // 리뷰 알림은 리뷰 상세 페이지로 이동 (좋아요, 댓글 등)
        // 만약 comment가 있으면 댓글 ID를 파라미터로 추가
        if (notification.type === 'comment' && notification.comment?.id) {
          return `/review/${notification.sourceId}?commentId=${notification.comment.id}`;
        }
        // 만약 댓글 좋아요라면 댓글 ID를 파라미터로 추가
        else if (
          notification.type === 'like' &&
          notification.sourceType === 'comment' &&
          notification.comment?.id
        ) {
          return `/review/${notification.review?.id || notification.sourceId}?commentId=${notification.comment.id}`;
        }
        return `/review/${notification.sourceId}`;
      case 'library':
        return `/library/${notification.sourceId}`;
      case 'user':
        return `/profile/${notification.sourceId}`;
      case 'system':
        return '/profile';
      default:
        return '#';
    }
  };

  // 알림 내용 처리 (details와 content를 결합)
  const getNotificationContent = (notification: any): string => {
    // 이미 처리된 content가 있으면 그대로 반환
    if (notification.content) {
      return notification.content;
    }

    // details의 metadata가 있으면 사용
    if (notification.details?.metadata) {
      return notification.details.metadata;
    }

    // 액터 이름 (알림 주체)
    const actorName = notification.actor?.username || '누군가';

    // 소스 정보
    const reviewTitle = notification.review?.content
      ? notification.review.content.length > 20
        ? `"${notification.review.content.substring(0, 20)}..."`
        : `"${notification.review.content}"`
      : '리뷰';

    const bookTitle =
      notification.details?.data?.bookTitle ||
      (notification.review?.books && notification.review.books.length > 0
        ? notification.review.books[0].title
        : '책');

    const commentContent =
      notification.comment?.content ||
      notification.details?.data?.commentContent ||
      '댓글';

    const libraryName =
      notification.library?.name ||
      notification.details?.data?.libraryName ||
      '서재';

    // 타입에 따라 상세 메시지 생성
    switch (notification.type) {
      case 'comment':
        // 댓글 관련 알림
        if (notification.sourceType === 'review') {
          // 리뷰에 달린 댓글
          return `${actorName}님이 ${bookTitle}에 대한 ${reviewTitle} 리뷰에 댓글을 남겼습니다: "${commentContent.length > 30 ? commentContent.substring(0, 30) + '...' : commentContent}"`;
        } else {
          // 기타 댓글
          return `${actorName}님이 댓글을 남겼습니다: "${commentContent.length > 30 ? commentContent.substring(0, 30) + '...' : commentContent}"`;
        }

      case 'like':
        // 좋아요 관련 알림
        if (notification.sourceType === 'review') {
          // 리뷰에 좋아요
          return `${actorName}님이 ${bookTitle}에 대한 ${reviewTitle} 리뷰를 좋아합니다.`;
        } else if (notification.sourceType === 'comment') {
          // 댓글에 좋아요
          return `${actorName}님이 회원님의 댓글을 좋아합니다: "${commentContent.length > 30 ? commentContent.substring(0, 30) + '...' : commentContent}"`;
        } else {
          // 기타 좋아요
          return `${actorName}님이 회원님의 콘텐츠를 좋아합니다.`;
        }

      case 'follow':
        // 팔로우 관련 알림
        return `${actorName}님이 회원님을 팔로우하기 시작했습니다.`;

      case 'library_update':
        // 서재 업데이트 관련 알림
        if (notification.details?.data?.action === 'add_book') {
          return `${libraryName} 서재에 새 책 '${bookTitle}'이(가) 추가되었습니다.`;
        } else if (notification.details?.data?.action === 'remove_book') {
          return `${libraryName} 서재에서 '${bookTitle}' 책이 제거되었습니다.`;
        } else if (notification.details?.data?.action === 'update') {
          return `${libraryName} 서재가 업데이트되었습니다.`;
        } else {
          return `${libraryName} 서재에 변경사항이 있습니다.`;
        }

      case 'system':
        // 시스템 알림
        if (notification.title) {
          return notification.title;
        } else {
          return '시스템 알림이 도착했습니다.';
        }

      default:
        // 기타 알림
        if (notification.title) {
          return notification.title;
        } else {
          return '새로운 알림이 도착했습니다.';
        }
    }
  };

  return {
    notifications,
    total,
    unreadCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    markAsRead,
    markAllAsReadMutation,
    deleteNotificationMutation,
    deleteAllNotifications: deleteAllNotificationsMutation,
    formatNotificationTime,
    getNotificationLink,
    getNotificationContent,
    error,
    queryError,
    unreadCountError,
    markAsReadError,
    markAllAsReadError,
    deleteNotificationError,
    deleteAllNotificationsError,
  };
}
