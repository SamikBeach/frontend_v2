import { Button } from '@/components/ui/button';
import { Library, Plus } from 'lucide-react';
import { EmptyState } from '../../../common';

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

      <EmptyState
        title="서재가 없습니다"
        description={
          isMyProfile
            ? '첫 번째 서재를 만들어보세요!'
            : '이 사용자는 아직 서재를 만들지 않았습니다.'
        }
        icon={<Library className="h-6 w-6 text-gray-400 sm:h-8 sm:w-8" />}
        action={
          isMyProfile
            ? {
                label: '새 서재 만들기',
                onClick: onCreateLibrary,
                variant: 'default' as const,
              }
            : undefined
        }
      />
    </>
  );
}
