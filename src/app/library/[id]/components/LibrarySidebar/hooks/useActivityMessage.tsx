import {
  Library,
  LibraryActivityType,
  UpdateHistoryItem,
} from '@/apis/library/types';
import { useDialogQuery } from '@/hooks';
import { getTagColor } from '@/utils/tags';
import { ReactNode } from 'react';

export function useActivityMessage(library: Library) {
  const { open: openBookDialog } = useDialogQuery({
    type: 'book',
    idType: 'id',
  });

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
  const renderActivityMessage = (update: UpdateHistoryItem): ReactNode => {
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
        const bookTitle = update.bookTitle || getBookTitleById(update.bookId);
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
          update.bookTitle ||
          getBookTitleById(update.bookId) ||
          update.message.match(/"(.+?)"/)?.at(1) ||
          '알 수 없는 책';
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
            책이 서재에서 제거되었습니다.
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

  return { renderActivityMessage };
}
