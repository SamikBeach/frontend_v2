import { FC } from 'react';
import { useLibraryDetail } from '../../hooks';
import { useActivityMessage, useSubscribers } from './hooks';
import { LibrarySidebarInfo } from './LibrarySidebarInfo';
import { LibrarySidebarOwner } from './LibrarySidebarOwner';
import { LibrarySidebarSubscribers } from './LibrarySidebarSubscribers';
import { LibrarySidebarUpdates } from './LibrarySidebarUpdates';

interface LibrarySidebarContentProps {
  libraryId: number;
}

export const LibrarySidebarContent: FC<LibrarySidebarContentProps> = ({
  libraryId,
}) => {
  // 서재 정보 가져오기
  const { library } = useLibraryDetail(libraryId);

  if (!library) {
    return null;
  }

  // 활동 메시지 렌더링 훅
  const { renderActivityMessage } = useActivityMessage(library);

  // 구독자 관련 훅
  const { previewSubscribers, isCurrentUserSubscriber } =
    useSubscribers(library);

  // 책 개수 계산
  const booksCount = library.books?.length || 0;

  return (
    <div className="space-y-6">
      {/* 서재 소유자 정보 */}
      <LibrarySidebarOwner owner={library.owner} />

      {/* 서재 정보 */}
      <LibrarySidebarInfo
        booksCount={booksCount}
        subscriberCount={library.subscriberCount}
        createdAt={library.createdAt}
      />

      {/* 구독자 미리보기 */}
      {library.subscribers && library.subscribers.length > 0 && (
        <LibrarySidebarSubscribers
          subscribers={previewSubscribers}
          isCurrentUserSubscriber={isCurrentUserSubscriber}
        />
      )}

      {/* 업데이트 알림 섹션 */}
      <LibrarySidebarUpdates
        updates={library.recentUpdates || []}
        renderActivityMessage={renderActivityMessage}
      />
    </div>
  );
};
