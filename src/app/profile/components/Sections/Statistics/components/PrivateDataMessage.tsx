import { AlertCircle } from 'lucide-react';

interface PrivateDataMessageProps {
  title?: string;
  message: string;
}

export function PrivateDataMessage({
  title = '비공개 통계',
  message,
}: PrivateDataMessageProps) {
  return (
    <div className="h-[340px] w-full rounded-lg bg-white p-3">
      <div className="flex h-full flex-col">
        <div className="mb-2">
          <h3 className="text-base font-medium text-gray-600">{title}</h3>
          <p className="text-xs text-gray-400">{message}</p>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center justify-center text-gray-300">
            <AlertCircle className="mb-2 h-10 w-10" />
            <p className="text-sm">비공개 통계</p>
          </div>
        </div>
      </div>
    </div>
  );
}
