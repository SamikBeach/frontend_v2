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
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div>
          <p className="text-xs text-gray-500 sm:text-sm">
            아직 등록된 서재가 없습니다.
          </p>
        </div>
        {isMyProfile && (
          <Button
            onClick={onCreateLibrary}
            className="flex h-9 items-center gap-1 rounded-full border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 sm:h-10 sm:gap-1.5 sm:text-sm"
            variant="outline"
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />새 서재 만들기
          </Button>
        )}
      </div>

      <div className="flex h-40 w-full flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 sm:h-64 sm:px-6 sm:py-10">
        <p className="mt-2 text-sm font-medium text-gray-600 sm:mt-4 sm:text-base">
          서재가 없습니다
        </p>
        <p className="mt-1 text-center text-xs text-gray-500 sm:text-sm">
          {isMyProfile
            ? '첫 번째 서재를 만들어보세요!'
            : '이 사용자는 아직 서재를 만들지 않았습니다.'}
        </p>
        {isMyProfile && (
          <Button
            onClick={onCreateLibrary}
            variant="default"
            className="mt-3 h-9 rounded-full bg-gray-900 px-4 text-xs hover:bg-gray-800 sm:mt-4 sm:h-10 sm:px-5 sm:text-sm"
          >
            <Plus className="mr-1 h-3.5 w-3.5 sm:mr-1.5 sm:h-4 sm:w-4" />새 서재
            만들기
          </Button>
        )}
      </div>
    </>
  );
}
