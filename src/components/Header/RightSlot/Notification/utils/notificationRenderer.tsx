import { Notification } from '../types';
import { ReactNode } from 'react';

/**
 * 알림 내용 커스텀 렌더링 함수
 * 알림 타입에 따라 적절한 메시지를 생성합니다.
 */
export function renderNotificationContent(notification: Notification): ReactNode {
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
} 