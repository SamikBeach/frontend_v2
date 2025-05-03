import { Loader2 } from 'lucide-react';

// 전체 로딩 컴포넌트
export function NotificationLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
    </div>
  );
}

// 스크롤 로더 컴포넌트
export function ScrollLoader() {
  return (
    <div className="flex items-center justify-center py-3">
      <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
    </div>
  );
}
