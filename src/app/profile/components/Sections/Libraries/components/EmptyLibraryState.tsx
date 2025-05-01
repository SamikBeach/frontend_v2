import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyLibraryStateProps {
  isMyProfile: boolean;
  onCreateLibrary: () => void;
}

export function EmptyLibraryState({
  isMyProfile,
  onCreateLibrary,
}: EmptyLibraryStateProps) {
  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">아직 등록된 서재가 없습니다.</p>
        </div>
        {isMyProfile && (
          <Button
            onClick={onCreateLibrary}
            className="flex items-center gap-1.5 rounded-full border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            variant="outline"
          >
            <Plus className="h-4 w-4" />새 서재 만들기
          </Button>
        )}
      </div>

      <div className="flex h-64 w-full flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 py-10">
        <p className="mt-4 text-base font-medium text-gray-600">
          서재가 없습니다
        </p>
        <p className="mt-1 text-sm text-gray-500">
          {isMyProfile
            ? '첫 번째 서재를 만들어보세요!'
            : '이 사용자는 아직 서재를 만들지 않았습니다.'}
        </p>
        {isMyProfile && (
          <Button
            onClick={onCreateLibrary}
            variant="default"
            className="mt-4 rounded-full bg-gray-900 px-5 text-sm hover:bg-gray-800"
          >
            <Plus className="mr-1.5 h-4 w-4" />새 서재 만들기
          </Button>
        )}
      </div>
    </>
  );
}
