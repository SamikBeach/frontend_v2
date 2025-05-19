import { UpdateHistoryItem } from '@/apis/library/types';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Clock } from 'lucide-react';
import { FC, ReactNode } from 'react';

interface LibrarySidebarUpdatesProps {
  updates: UpdateHistoryItem[];
  renderActivityMessage: (update: UpdateHistoryItem) => ReactNode;
}

export const LibrarySidebarUpdates: FC<LibrarySidebarUpdatesProps> = ({
  updates,
  renderActivityMessage,
}) => {
  // 상대적 시간 포맷팅 (예: "2일 전")
  const formatRelativeTime = (date: Date): string => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ko });
  };

  // 가장 최근 업데이트
  const renderRecentUpdates = () => {
    if (!updates || updates.length === 0) {
      return (
        <div className="text-center text-sm text-gray-500 italic">
          아직 업데이트가 없습니다.
        </div>
      );
    }

    return updates.slice(0, 5).map((update, index) => {
      const formattedMessage = renderActivityMessage(update);
      const isReactNode = typeof formattedMessage !== 'string';

      return (
        <div key={index} className="mb-2 rounded-md bg-white p-3 last:mb-0">
          <div className="flex flex-col">
            <div className="text-sm text-gray-700">
              {isReactNode ? (
                formattedMessage
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: formattedMessage as string,
                  }}
                />
              )}
            </div>
            <span className="mt-0.5 text-xs text-gray-500">
              {formatRelativeTime(update.date)}
            </span>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <div className="mb-3 flex items-center">
        <Clock className="mr-1.5 h-4 w-4 text-gray-500" />
        <h3 className="text-sm font-medium text-gray-900">최근 활동</h3>
      </div>
      <div className="space-y-2">{renderRecentUpdates()}</div>
    </div>
  );
};
