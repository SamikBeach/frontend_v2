import { UpdateHistoryItem } from '@/apis/library/types';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { differenceInDays, format, formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronDown, Clock } from 'lucide-react';
import { FC, ReactNode, useState } from 'react';

interface LibrarySidebarUpdatesProps {
  updates: UpdateHistoryItem[];
  renderActivityMessage: (update: UpdateHistoryItem) => ReactNode;
}

export const LibrarySidebarUpdates: FC<LibrarySidebarUpdatesProps> = ({
  updates,
  renderActivityMessage,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // 스마트 시간 포맷팅 (3일 이내는 상대시간, 이후는 절대시간)
  const formatSmartTime = (date: Date): string => {
    const now = new Date();
    const daysDiff = differenceInDays(now, new Date(date));

    // 3일 이내는 상대시간 표시
    if (daysDiff <= 3) {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: ko,
      });
    }

    // 3일 이후는 절대시간 표시 (날짜 + 시간)
    return format(new Date(date), 'PPP p', { locale: ko });
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
              {formatSmartTime(update.date)}
            </span>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="-m-2 flex w-full items-center justify-between rounded-lg p-2 hover:bg-gray-100 lg:m-0 lg:cursor-default lg:p-0 lg:hover:bg-transparent">
          <div className="flex items-center">
            <Clock className="mr-1.5 h-4 w-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-900">최근 활동</h3>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-gray-500 lg:hidden ${
              isOpen ? 'rotate-180 text-gray-700' : 'text-gray-400'
            }`}
          />
        </CollapsibleTrigger>

        {/* 데스크톱에서는 항상 표시, 모바일에서는 Collapsible */}
        <div className="hidden lg:block">
          <div className="mt-2 space-y-2">{renderRecentUpdates()}</div>
        </div>

        <CollapsibleContent className="lg:hidden">
          <div className="mt-3 space-y-2">{renderRecentUpdates()}</div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
