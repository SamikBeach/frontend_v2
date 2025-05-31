import { CreateLibraryDto } from '@/apis/library/types';
import { LibraryDialog } from '@/components/Library';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useIsMyProfile } from '../../../hooks';
import {
  CreateLibraryButton,
  EmptyLibraryState,
  LibraryList,
} from './components';
import { useCreateLibrary, useLibraryTags, useUserLibraries } from './hooks';

export default function Libraries() {
  const params = useParams();
  const userId = Number(params.id as string);
  const isMyProfile = useIsMyProfile();
  const [showLibraryDialog, setShowLibraryDialog] = useState(false);
  const pageSize = 6;

  // 서재 목록 가져오기 (무한 스크롤)
  const { libraries, fetchNextPage, hasNextPage } = useUserLibraries({
    userId,
    pageSize,
  });

  // 태그 포맷팅 훅 사용
  const tags = useLibraryTags(libraries);

  // 새 서재 생성 훅 사용
  const { createLibraryMutation } = useCreateLibrary(userId, () => {
    setShowLibraryDialog(false);
  });

  // 새 서재 만들기 클릭 핸들러
  const handleCreateLibrary = () => {
    setShowLibraryDialog(true);
  };

  // 새 서재 생성 처리 함수
  const handleCreateNewLibrary = async (libraryData: CreateLibraryDto) => {
    return createLibraryMutation(libraryData);
  };

  // 서재가 없는 경우
  if (libraries.length === 0) {
    return (
      <EmptyLibraryState
        isMyProfile={isMyProfile}
        onCreateLibrary={handleCreateLibrary}
      />
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {isMyProfile && <CreateLibraryButton onClick={handleCreateLibrary} />}
      </div>

      <LibraryList
        libraries={libraries}
        tags={tags}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
      />

      <LibraryDialog
        open={showLibraryDialog}
        onOpenChange={setShowLibraryDialog}
        mode="create"
        onCreateLibrary={handleCreateNewLibrary}
      />
    </>
  );
}
