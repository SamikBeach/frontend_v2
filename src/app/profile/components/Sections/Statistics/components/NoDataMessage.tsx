import { BarChart3 } from 'lucide-react';

interface NoDataMessageProps {
  title?: string;
  message?: string;
}

export function NoDataMessage({
  title = '',
  message = '데이터가 없습니다',
}: NoDataMessageProps) {
  return (
    <div className="h-[340px] w-full rounded-lg bg-white md:p-3">
      <div className="flex h-full flex-col">
        <div className="mb-2">
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
              <BarChart3 className="h-10 w-10 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-500">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
